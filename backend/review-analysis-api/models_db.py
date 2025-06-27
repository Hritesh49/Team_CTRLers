from sqlalchemy import create_engine, Column, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

Base = declarative_base()

class ReviewLog(Base):
    __tablename__ = 'review_logs'
    review = Column(Text, primary_key=True)
    hash = Column(String, unique=True)
    sentiment = Column(String)
    sentiment_score = Column(Float)
    emotion = Column(String)
    emotion_score = Column(Float)
    delivery_sentiment = Column(String)
    delivery_score = Column(Float)
    product_sentiment = Column(String)
    product_score = Column(Float)
    price_sentiment = Column(String)
    price_score = Column(Float)
    packaging_sentiment = Column(String)
    packaging_score = Column(Float)
    support_sentiment = Column(String)
    support_score = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)

# Replace with your PostgreSQL URL if needed
engine = create_engine("sqlite:///review_logs.db")
Base.metadata.create_all(engine)
SessionLocal = sessionmaker(bind=engine)
