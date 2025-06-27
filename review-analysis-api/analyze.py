from models import sentiment_model, emotion_model, absa_pipeline
import json
import csv
import os
import spacy

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# List of predefined aspects to check for in the review
ASPECTS = ["delivery", "product", "price", "packaging", "support"]

# Checks if an aspect is mentioned in the noun phrases of the review
def is_aspect_mentioned(aspect, review_text):
    doc = nlp(review_text)
    return any(aspect in chunk.text.lower() for chunk in doc.noun_chunks)

# Filters out aspects not mentioned in the review text
def filter_aspects(aspect_dict, review_text):
    return {
        aspect: value
        for aspect, value in aspect_dict.items()
        if is_aspect_mentioned(aspect, review_text)
    }

# Logs result into a local CSV file (only needed for debug or legacy logging)
def log_analysis(review, result, filename='logs.csv'):
    log_file = os.path.join(os.getcwd(), filename)
    with open(log_file, mode='a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow([review, json.dumps(result)])

# Main function: Analyze a single review and return sentiment, emotion, and filtered aspects
def analyze_single_review(review):
    sentiment = sentiment_model(review)[0]  # e.g., {'label': 'POSITIVE', 'score': 0.98}
    emotion = emotion_model(review)[0]      # e.g., {'label': 'joy', 'score': 0.85}

    aspect_sentiments = {}
    for aspect in ASPECTS:
        input_text = f"{review} [SEP] {aspect}"
        result = absa_pipeline(input_text)[0]
        aspect_sentiments[aspect] = {
            "label": result["label"],
            "score": round(result["score"], 3)
        }

    filtered_aspects = filter_aspects(aspect_sentiments, review)

    result = {
        "sentiment": {
            "label": sentiment["label"],
            "score": round(sentiment["score"], 3)
        },
        "emotion": {
            "label": emotion["label"],
            "score": round(emotion["score"], 3)
        },
        "aspect_sentiments": filtered_aspects
    }

    # Optional CSV log – not needed if you're using database logging
    log_analysis(review, result)

    return result

# Analyze a batch of reviews (list of strings)
def analyze_batch_reviews(reviews):
    return [analyze_single_review(review) for review in reviews]
