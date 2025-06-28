from sqlalchemy import create_engine, Column, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timezone

Base = declarative_base()

class Product(Base):
    __tablename__ = 'products'
    id = Column(String, primary_key=True)  # Example: "p1", "mouse001"
    name = Column(String, nullable=False)
    description = Column(Text)
    price = Column(Float)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))

class ReviewLog(Base):
    __tablename__ = 'review_logs'
    review = Column(Text, primary_key=True)
    hash = Column(String, unique=True)
    product_id = Column(String, ForeignKey('products.id'), nullable=False)
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
    timestamp = Column(DateTime, default=datetime.now(timezone.utc))

engine = create_engine("sqlite:///review_logs.db")
Base.metadata.create_all(engine)
SessionLocal = sessionmaker(bind=engine)
