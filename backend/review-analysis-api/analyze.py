from models import sentiment_model, emotion_model, absa_pipeline
import spacy
from langdetect import detect
from deep_translator import GoogleTranslator

nlp = spacy.load("en_core_web_lg")

ASPECTS = ["delivery", "product", "price", "packaging", "support"]
SIMILARITY_THRESHOLD = 0.7

def is_aspect_mentioned(aspect, review_text):
    doc = nlp(review_text.lower())
    aspect_doc = nlp(aspect.lower())
    for chunk in doc.noun_chunks:
        chunk_text = chunk.text.strip()
        if aspect in chunk_text:
            return True
        chunk_doc = nlp(chunk_text)
        similarity = chunk_doc.similarity(aspect_doc)
        if similarity >= SIMILARITY_THRESHOLD:
            return True
    return False

def filter_aspects(aspect_dict, review_text):
    return {
        aspect: value
        for aspect, value in aspect_dict.items()
        if is_aspect_mentioned(aspect, review_text)
    }

def translate_if_needed(text, target_lang="en"):
    try:
        detected_lang = detect(text)
        if detected_lang != target_lang:
            translated = GoogleTranslator(source='auto', target=target_lang).translate(text)
            return translated
        return text
    except Exception as e:
        print(f"⚠️ Language detection/translation failed: {e}")
        return text

def analyze_single_review(review):
    review_in_english = translate_if_needed(review)
    sentiment = sentiment_model(review_in_english)[0]
    emotion = emotion_model(review_in_english)[0]
    aspect_sentiments = {}
    for aspect in ASPECTS:
        input_text = f"{review_in_english} [SEP] {aspect}"
        result = absa_pipeline(input_text)[0]
        aspect_sentiments[aspect] = {
            "label": result["label"],
            "score": round(result["score"], 3)
        }
    filtered_aspects = filter_aspects(aspect_sentiments, review_in_english)
    result = {
        "original_review": review,
        "translated_review": review_in_english,
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
    return result
