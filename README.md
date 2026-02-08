# AgriCycle Connect Genkit Backend

A professional Genkit-powered backend service for analyzing agricultural waste images using Google AI (Gemini).

## Features

- **AI Analysis**: Identifies agricultural waste types (Rice Husk, Wheat Straw, etc.) from images.
- **Quality Assessment**: Evaluates cleanliness, moisture, and decay states.
- **Market Valuation**: Suggests fair price ranges in INR (₹).
- **Logistics**: Estimates weight based on visible volume.
- **Environmental Impact**: Calculates potential carbon offset.
- **JSON Schema**: Returns strictly structured data for easy frontend integration.

## Tech Stack

- [Genkit](https://github.com/firebase/genkit)
- [Google AI (Gemini)](https://ai.google.dev/)
- TypeScript
- Express.js

## Prerequisites

- Node.js (v18 or higher)
- Google AI API Key (Get one from [Google AI Studio](https://aistudio.google.com/))

## Setup

1.  **Clone the repository**:
    ```bash
    git clone <your-repo-url>
    cd genkit
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env` file in the root directory:
    ```env
    GEMINI_API_KEY=your_google_ai_api_key
    PORT=3400
    ```

## Development

Run the Genkit developer UI to test flows:
```bash
npm run dev
```

Run the server in development mode:
```bash
npm run start:watch
```

## Production

1.  **Build the project**:
    ```bash
    npm run build
    ```

2.  **Start the server**:
    ```bash
    npm run start
    ```

## API Specification

### Flow: `wasteAuditFlow`

**Input**:
```json
{
  "image": "data:image/jpeg;base64,...",
  "location": {
    "city": "Panipat",
    "state": "Haryana",
    "country": "India"
  }
}
```

**Output**:
```json
{
  "wasteType": "Rice Husk",
  "reasoning": "Visual identification of light-brown, boat-shaped husks...",
  "quality": "Excellent",
  "confidence": 95,
  "suggestedPrice": "₹6 - ₹9 per kg",
  "industries": ["Biomass Energy", "Cement Manufacturing"],
  "estimatedWeight": "400 - 600 kg",
  "environmentalImpact": "Prevents stubble burning and reduces CO2 emissions."
}
```

## Vercel Deployment

This service is optimized for deployment on **Vercel** as a serverless function.

### Deployment Steps:

1.  **Push to GitHub**: Push your code to a GitHub repository.
2.  **Import to Vercel**: Connect your repository to Vercel.
3.  **Environment Variables**: In the Vercel dashboard, add the following environment variable:
    - `GEMINI_API_KEY`: Your Google AI Studio API Key.
4.  **Deploy**: Vercel will automatically detect the `vercel.json` and deploy your backend.

## API Specification

**Base URL**: `https://your-deployment-url.vercel.app/api`

### Endpoint: `POST /wasteAudit`

**Headers**:
- `Content-Type: application/json`

**Request Body**:
```json
{
  "image": "data:image/jpeg;base64,...",
  "location": {
    "city": "Panipat",
    "state": "Haryana",
    "country": "India"
  }
}
```

**Response Body**:
```json
{
  "wasteType": "Rice Husk",
  "reasoning": "Visual identification...",
  "quality": "Excellent",
  "confidence": 95,
  "suggestedPrice": "₹6 - ₹9 per kg",
  "industries": ["Biomass Energy"],
  "estimatedWeight": "400 - 600 kg",
  "environmentalImpact": "..."
}
```

### Endpoint: `GET /health`
Returns `{ "status": "ok", "service": "..." }`.

## Local Development

1.  **Install dependencies**: `npm install`
2.  **Set up .env**: Add your `GEMINI_API_KEY`.
3.  **Run Development Server**:
    ```bash
    npm run start:watch
    ```
    The server will be available at `http://localhost:3400`.
    The flow endpoint will be `http://localhost:3400/api/wasteAudit`.

---
Built for AgriCycle Connect Marketplace.
