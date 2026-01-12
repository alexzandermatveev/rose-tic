import json
import os
import sys

def generate_config(backend_url):
    """Generate config.json for the frontend"""
    config = {
        "BACKEND_URL": backend_url
    }
    
    # Write to public/config.json
    with open('public/config.json', 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2)
    
    print(f"✅ Configuration generated: {config}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python generate_config.py <backend_url>")
        print("Example: python generate_config.py https://your-backend.herokuapp.com")
        sys.exit(1)
    
    backend_url = sys.argv[1]
    generate_config(backend_url)