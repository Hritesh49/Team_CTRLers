from flask import Flask, request, jsonify
from flask_cors import CORS
from analyze import analyze_single_review
from utils import get_review_hash
from models_db import ReviewLog, SessionLocal
from datetime import datetime

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

@app.route('/')
def home():
    return "Review Analysis API is running!"

def save_to_db(review, result):
    session = SessionLocal()
    try:
        review_hash = get_review_hash(review)
        existing = session.query(ReviewLog).filter_by(hash=review_hash).first()
        if existing:
            print("⚠️ Skipping duplicate review in DB")
            return

        log_entry = ReviewLog(
            review=review,
            hash=review_hash,
            sentiment=result["sentiment"]["label"],
            sentiment_score=result["sentiment"]["score"],
            emotion=result["emotion"]["label"],
            emotion_score=result["emotion"]["score"],
            delivery_sentiment=result["aspect_sentiments"].get("delivery", {}).get("label"),
            delivery_score=result["aspect_sentiments"].get("delivery", {}).get("score"),
            product_sentiment=result["aspect_sentiments"].get("product", {}).get("label"),
            product_score=result["aspect_sentiments"].get("product", {}).get("score"),
            price_sentiment=result["aspect_sentiments"].get("price", {}).get("label"),
            price_score=result["aspect_sentiments"].get("price", {}).get("score"),
            packaging_sentiment=result["aspect_sentiments"].get("packaging", {}).get("label"),
            packaging_score=result["aspect_sentiments"].get("packaging", {}).get("score"),
            support_sentiment=result["aspect_sentiments"].get("support", {}).get("label"),
            support_score=result["aspect_sentiments"].get("support", {}).get("score"),
            timestamp=datetime.utcnow()
        )
        session.add(log_entry)
        session.commit()
    except Exception as e:
        session.rollback()
        print(f"❌ Error saving to DB: {e}")
    finally:
        session.close()

@app.route('/analyze-review', methods=['POST'])
def analyze_review_endpoint():
    data = request.get_json()
    review = data.get("review")
    result = analyze_single_review(review)
    save_to_db(review, result)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
