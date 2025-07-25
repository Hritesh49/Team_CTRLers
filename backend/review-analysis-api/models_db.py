from sqlalchemy import create_engine, Column, String, Float, DateTime, Text, ForeignKey, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timezone
import uuid

Base = declarative_base()

class Product(Base):
    __tablename__ = 'products'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))  # 👈 UUID here
    name = Column(String, nullable=False)
    description = Column(Text)
    price = Column(Float)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
class ReviewLog(Base):
    __tablename__ = 'review_logs'
    review = Column(Text, primary_key=True)
    hash = Column(String, unique=True)
    product_id = Column(String, ForeignKey('products.id', ondelete="CASCADE"), nullable=False)
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
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))  # ✅ UTC

# DB Setup
engine = create_engine("sqlite:///review_logs.db")

@event.listens_for(engine, "connect")
def enable_sqlite_fk_constraints(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

Base.metadata.create_all(engine)
SessionLocal = sessionmaker(bind=engine)
