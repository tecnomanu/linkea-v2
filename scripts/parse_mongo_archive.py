#!/usr/bin/env python3
"""
Parse MongoDB archive and extract data to JSON files.
MongoDB archive format uses BSON internally.
"""
import os
import sys
import json
import gzip
import struct
from datetime import datetime
from bson import ObjectId, decode
from bson.errors import InvalidBSON

OUTPUT_DIR = 'storage/mongo_import'

class MongoArchiveParser:
    """Parser for MongoDB archive files."""
    
    def __init__(self, archive_path):
        self.archive_path = archive_path
        self.collections = {}
        
    def parse(self):
        """Parse the archive and extract collections."""
        print(f"Parsing archive: {self.archive_path}")
        
        with gzip.open(self.archive_path, 'rb') as f:
            data = f.read()
        
        print(f"Archive size: {len(data)} bytes")
        
        # Find BSON documents in the raw data
        self._extract_bson_documents(data)
        
        return self.collections
    
    def _extract_bson_documents(self, data):
        """Extract BSON documents from raw data."""
        pos = 0
        docs_found = 0
        
        while pos < len(data) - 4:
            # Try to read BSON document length (little-endian int32)
            try:
                doc_len = struct.unpack('<i', data[pos:pos+4])[0]
                
                # Validate document length (reasonable size for BSON doc)
                if doc_len < 5 or doc_len > 16 * 1024 * 1024:  # Max 16MB
                    pos += 1
                    continue
                
                # Check if we have enough data
                if pos + doc_len > len(data):
                    pos += 1
                    continue
                
                # Try to decode as BSON
                doc_data = data[pos:pos + doc_len]
                
                # BSON documents end with \x00
                if doc_data[-1:] != b'\x00':
                    pos += 1
                    continue
                
                try:
                    doc = decode(doc_data)
                    
                    # Classify and store the document
                    self._classify_document(doc)
                    docs_found += 1
                    pos += doc_len
                    
                except (InvalidBSON, Exception):
                    pos += 1
                    
            except struct.error:
                pos += 1
        
        print(f"Total documents found: {docs_found}")
    
    def _classify_document(self, doc):
        """Classify document by its fields and add to appropriate collection."""
        # Detect collection by document structure
        collection = self._detect_collection(doc)
        
        if collection and collection != 'metadata':
            if collection not in self.collections:
                self.collections[collection] = []
            self.collections[collection].append(doc)
    
    def _detect_collection(self, doc):
        """Detect which collection a document belongs to based on its fields."""
        keys = set(doc.keys())
        
        # Skip metadata documents
        if 'metadata' in keys or 'options' in keys and 'indexes' in str(doc.get('metadata', '')):
            return 'metadata'
        
        # Skip system documents
        if 'featureCompatibilityVersion' in keys:
            return 'metadata'
        if 'authSchema' in keys:
            return 'metadata'
        if 'credentials' in keys and 'SCRAM-SHA-1' in str(doc):
            return 'metadata'
        
        # Users - have email, first_name, roles
        if 'email' in keys and ('first_name' in keys or 'username' in keys):
            return 'users'
        
        # Companies - have name, owner_id or slug but not domain_name
        if 'name' in keys and 'owner_id' in keys and 'domain_name' not in keys:
            return 'companies'
        
        # Landings - have domain_name, template_config, logo
        if 'domain_name' in keys or ('template_config' in keys and 'logo' in keys):
            return 'landings'
        
        # Links - have landing_id, text/link, type (button, social, etc)
        if 'landing_id' in keys and ('text' in keys or 'link' in keys):
            return 'links'
        
        # Roles - just name and maybe type
        if keys == {'_id', 'name'} or keys == {'_id', 'name', 'type'}:
            return 'roles'
        
        # Newsletters - have subject and message
        if 'subject' in keys and 'message' in keys:
            return 'newsletters'
        
        # Newsletters (alternative detection) - have subject and status
        if 'subject' in keys and 'status' in keys:
            return 'newsletters'
        
        # Newsletter users
        if 'newsletter_id' in keys and 'user_id' in keys:
            return 'newsletter_users'
        
        # Notifications
        if 'title' in keys and ('message' in keys or 'content' in keys):
            return 'notifications'
        
        # Notification users
        if 'notification_id' in keys and 'user_id' in keys:
            return 'notification_users'
        
        # Memberships
        if 'name' in keys and 'type' in keys and len(keys) <= 5:
            return 'memberships'
        
        return None
    
    def serialize_for_json(self, obj):
        """Convert MongoDB types to JSON-serializable types."""
        if isinstance(obj, ObjectId):
            return str(obj)
        elif isinstance(obj, datetime):
            return obj.isoformat()
        elif isinstance(obj, bytes):
            return obj.decode('utf-8', errors='replace')
        elif isinstance(obj, dict):
            return {k: self.serialize_for_json(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self.serialize_for_json(item) for item in obj]
        return obj
    
    def save_to_json(self, output_dir):
        """Save extracted collections to JSON files."""
        os.makedirs(output_dir, exist_ok=True)
        
        for collection, docs in self.collections.items():
            filename = os.path.join(output_dir, f'{collection}.json')
            serialized = [self.serialize_for_json(doc) for doc in docs]
            
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(serialized, f, indent=2, ensure_ascii=False)
            
            print(f"Saved {len(docs)} documents to {filename}")


def main():
    if len(sys.argv) < 2:
        print("Usage: python parse_mongo_archive.py <archive.gz> [output_dir]")
        sys.exit(1)
    
    archive_path = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else OUTPUT_DIR
    
    parser = MongoArchiveParser(archive_path)
    parser.parse()
    parser.save_to_json(output_dir)
    
    print("\nSummary:")
    for collection, docs in parser.collections.items():
        print(f"  {collection}: {len(docs)} documents")


if __name__ == '__main__':
    main()

