#!/usr/bin/env python3
"""
Simple execution script for the event scraper service
Ensures proper Python path setup for Context7 compliance
"""

import sys
import os

# Add the current directory to Python path to ensure imports work
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# Import and run the main scraper
from main import main

if __name__ == "__main__":
    main() 