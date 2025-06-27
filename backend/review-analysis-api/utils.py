import hashlib

def get_review_hash(review):
    """Generate a unique hash based on review content."""
    return hashlib.md5(review.encode('utf-8')).hexdigest()
