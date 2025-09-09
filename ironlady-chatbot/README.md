# IronLady Chatbot (React)

Demo of a lightweight FAQ chatbot aligned with Iron Lady branding.

## How to run
1. Install dependencies:
   npm install
2. Run dev server:
   npm run dev
3. Open browser at the URL shown (usually http://127.0.0.1:5173)

## Features
- 5 built-in FAQs (Program details, Duration, Mode, Certification, Mentors)
- Personalized greeting (asks and stores name)
- Quick reply chips, localStorage persistence
- Clean widget-style UI that can be styled to match Iron Lady colors

## Notes
- This version is fully client-side and needs a backend if you plan to integrate OpenAI (do not commit API keys).
- To add AI fallback, create a small backend endpoint that proxies OpenAI requests securely, and call that when FAQ matching fails.
