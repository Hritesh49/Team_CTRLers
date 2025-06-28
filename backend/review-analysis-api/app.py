from flask import Flask, request, jsonify
from flask_cors import CORS
from analyze import analyze_single_review
from utils import get_review_hash
from models_db import ReviewLog, Product, SessionLocal
from datetime import datetime, timezone

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

@app.route('/')
def home():
    return "Review Analysis API is running!"

@app.route('/products', methods=['POST'])
def add_product():
    data = request.get_json()
    session = SessionLocal()
    try:
        new_product = Product(
            id=data["id"],
            name=data["name"],
            description=data.get("description", ""),
            price=data.get("price", 0.0),
        )
        session.add(new_product)
        session.commit()
        return jsonify({"message": "✅ Product added successfully!"})
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

@app.route('/products', methods=['GET'])
def get_products():
    session = SessionLocal()
    try:
        products = session.query(Product).all()
        result = [{
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": p.price,
            "created_at": p.created_at.isoformat()
        } for p in products]
        return jsonify(result)
    finally:
        session.close()

def save_to_db(review, result, product_id):
    session = SessionLocal()
    try:
        review_hash = get_review_hash(review)
        existing = session.query(ReviewLog).filter_by(hash=review_hash).first()
        if existing:
            print("⚠️ Skipping duplicate review in DB")
            return

        log_entry = ReviewLog(
            product_id=product_id,
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
            timestamp=datetime.now(timezone.utc)
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
    product_id = data.get("product_id")
    result = analyze_single_review(review)
    result["timestamp"] = datetime.now(timezone.utc).isoformat()
    save_to_db(review, result, product_id)
    return jsonify(result)

@app.route('/reviews/<product_id>', methods=['GET'])
def get_reviews_by_product(product_id):
    session = SessionLocal()
    try:
        logs = session.query(ReviewLog).filter_by(product_id=product_id).order_by(ReviewLog.timestamp.desc()).all()
        result = []
        for log in logs:
            result.append({
                "original_review": log.review,
                "sentiment": {"label": log.sentiment, "score": log.sentiment_score},
                "emotion": {"label": log.emotion, "score": log.emotion_score},
                "aspect_sentiments": {
                    "delivery": {"label": log.delivery_sentiment, "score": log.delivery_score},
                    "product": {"label": log.product_sentiment, "score": log.product_score},
                    "price": {"label": log.price_sentiment, "score": log.price_score},
                    "packaging": {"label": log.packaging_sentiment, "score": log.packaging_score},
                    "support": {"label": log.support_sentiment, "score": log.support_score}
                },
                "timestamp": log.timestamp.isoformat() if log.timestamp else None
            })
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

if __name__ == '__main__':
    app.run(debug=True)
