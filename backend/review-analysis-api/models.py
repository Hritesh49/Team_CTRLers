from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification

# General sentiment analysis model
sentiment_model = pipeline("sentiment-analysis")

# Emotion detection model
emotion_model = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    return_all_scores=False
)

# ABSA model
absa_model_id = "yangheng/deberta-v3-base-absa-v1.1"
absa_tokenizer = AutoTokenizer.from_pretrained(absa_model_id)
absa_model = AutoModelForSequenceClassification.from_pretrained(absa_model_id)

absa_pipeline = pipeline("text-classification", model=absa_model, tokenizer=absa_tokenizer)
