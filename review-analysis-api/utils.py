import pandas as pd
import os
from datetime import datetime
import hashlib


def flatten_result(review, result):
    """Flatten the result dict for easier CSV writing."""
    base = {
        "review": review,
        "sentiment": result["sentiment"]["label"],
        "sentiment_score": result["sentiment"]["score"],
        "emotion": result["emotion"]["label"],
        "emotion_score": result["emotion"]["score"],
    }
    for aspect, data in result.get("aspect_sentiments", {}).items():
        base[f"{aspect}_sentiment"] = data.get("label")
        base[f"{aspect}_score"] = data.get("score")
    return base


def get_review_hash(review):
    """Generate a unique hash based on review content."""
    return hashlib.md5(review.encode('utf-8')).hexdigest()


def log_results_to_csv(results, filename="review_logs.csv"):
    """
    Logs a list of results to a CSV file, avoiding duplicates using hash-based deduplication.
    `results` should be a list of dicts, each like: { "review": str, "sentiment": {...}, "emotion": {...}, "aspect_sentiments": {...} }
    """
    flattened = [
        flatten_result(r["review"], r) if "aspect_sentiments" in r else r for r in results
    ]

    for r in flattened:
        r["hash"] = get_review_hash(r["review"])

    df = pd.DataFrame(flattened)
    df["timestamp"] = datetime.now().isoformat()

    # Deduplicate if file already exists
    if os.path.exists(filename):
        try:
            existing = pd.read_csv(filename)
            df = df[~df["hash"].isin(existing["hash"])]
        except pd.errors.ParserError:
            print(f"⚠️ Warning: Failed to parse '{filename}'. Skipping deduplication.")

    # Append new data
    df.to_csv(filename, mode="a", header=not os.path.exists(filename), index=False)
