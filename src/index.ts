import { genkit, z } from 'genkit';
import { googleAI, gemini15Flash } from '@genkit-ai/googleai';
import 'dotenv/config';

import cors from 'cors';

import express from 'express';

const ai = genkit({
    plugins: [
        googleAI({ apiKey: process.env.GEMINI_API_KEY }),
    ],
    model: gemini15Flash,
});

// JSON Schema for Output
const WasteAnalysisSchema = z.object({
    wasteType: z.string().describe("e.g., 'Rice Husk', 'Wheat Straw'"),
    reasoning: z.string().describe("Detailed visual justification"),
    quality: z.enum(['Excellent', 'Good', 'Average', 'Poor']),
    confidence: z.number().min(0).max(100),
    suggestedPrice: z.string().describe("e.g., '₹5 - ₹8 per kg'"),
    industries: z.array(z.string()),
    estimatedWeight: z.string().describe("e.g., '500-1000 kg'"),
    environmentalImpact: z.string().describe("Brief note on carbon offset or benefit"),
});

// Input Schema
const WasteAnalysisInputSchema = z.object({
    image: z.string().describe("Base64 data URI or URL of the agricultural waste image"),
    location: z.object({
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
    }).optional().describe("Optional location for localized pricing"),
});

export const wasteAuditFlow = ai.defineFlow(
    {
        name: 'wasteAuditFlow',
        inputSchema: WasteAnalysisInputSchema,
        outputSchema: WasteAnalysisSchema,
    },
    async (input) => {
        const prompt = `
      You are a professional agricultural waste and biomass auditor for the AgriCycle Connect marketplace.
      Your goal is to analyze visual characteristics of agricultural waste from user-uploaded images and provide precise, actionable data for buyers and sellers.
      
      ### Analysis Protocol:
      1. **Visual Inspection**: Analyze color, fiber length, texture, and density.
      2. **Identification**: Map visual features to specific waste types (e.g., Rice Husk, Wheat Straw, Sugarcane Bagasse, Cotton Stalks, Corn Stover, Groundnut Shells).
      3. **Quality Assessment**: Evaluate cleanliness (presence of soil/stones), moisture level (visual hints), and decay states.
      4. **Market Valuation**: Estimate a fair price range in INR (₹) based on the quality and type. ${input.location ? `Consider the location: ${JSON.stringify(input.location)} for local market rates.` : ''}
      5. **Logistics**: Estimate weight based on the volume visible in the image relative to surroundings.
      
      ### Guidelines:
      - Be objective and realistic.
      - If the image is not agricultural waste, return a "confidence" score below 20 and an error message in the "reasoning" field.
      - Ensure the output strictly follows the JSON schema provided.
    `;

        const response = await ai.generate({
            prompt: prompt,
            messages: [
                {
                    role: 'user',
                    content: [
                        { media: { url: input.image, contentType: 'image/jpeg' } },
                        { text: 'Analyze this agricultural waste image.' },
                    ],
                },
            ],
            output: { schema: WasteAnalysisSchema },
        });

        const output = response.output;
        if (!output) {
            throw new Error('Analysis failed to generate structured output.');
        }
        return output as z.infer<typeof WasteAnalysisSchema>;
    }
);

// Express Server with CORS for Vercel & Local Dev
const app = express();

const allowedOrigins = [
    'https://agricycle-connect.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));

// Route to handle flow execution
app.post('/api/wasteAudit', async (req, res) => {
    try {
        const result = await wasteAuditFlow(req.body);
        res.json(result);
    } catch (error: any) {
        console.error('Flow error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'AgriCycle Connect Genkit Backend' });
});

// Local development server
if (require.main === module) {
    const port = process.env.PORT || 3400;
    app.listen(port, () => {
        console.log(`AgriCycle Connect Genkit Backend running on port ${port}`);
    });
}

export default app;
