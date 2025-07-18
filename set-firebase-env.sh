#!/bin/bash

# Set Firebase Functions environment variables
firebase functions:config:set \
  finnhub.api_key="ct7fgm9r01qht2qng4v0ct7fgm9r01qht2qng4vg" \
  openai.api_key="your_openai_api_key_here"

echo "Firebase environment variables set successfully!"
echo "Note: Replace 'your_openai_api_key_here' with your actual OpenAI API key"