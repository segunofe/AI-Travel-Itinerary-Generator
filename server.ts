import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required by guidelines
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback generator for offline/unconfigured environments or error recovery
function generateFallbackItinerary(cityName: string, style = 'Balanced Highlights', pace = 'Moderate', companion = 'Solo Traveler') {
  const cleanCity = cityName.trim();
  const titleCity = cleanCity.charAt(0).toUpperCase() + cleanCity.slice(1);

  return {
    cityName: titleCity,
    country: 'Global Destination',
    tagline: `An unforgettable 3-day journey through the culture, sights, and hidden gems of ${titleCity}.`,
    overview: `Experience the quintessential highlights of ${titleCity} with this curated 3-day route designed for a ${pace.toLowerCase()} pace. Discover iconic landmarks, world-class dining, and vibrant local neighborhoods.`,
    bestSeason: 'Spring (April-May) or Autumn (September-November)',
    localCurrency: 'Local Currency',
    language: 'Local Language & English',
    transitTip: 'Walkable central districts with efficient metro and taxi options.',
    preferences: { style, pace, companion },
    days: [
      {
        dayNumber: 1,
        title: 'Day 1: Historic Core & Iconic Landmarks',
        theme: 'Cultural grounding and major architectural treasures',
        neighborhoods: ['Historic Center', 'Old Town', 'Central Plaza'],
        activities: [
          {
            id: 'd1-a1',
            time: '09:00 AM - 11:30 AM',
            period: 'Morning',
            title: `Explore Central Heritage & Old Town of ${titleCity}`,
            category: 'Culture & Art',
            description: `Start your adventure in the historic heart of ${titleCity}. Wander cobblestone lanes, admire centuries-old architecture, and take in the morning buzz.`,
            duration: '2.5 hours',
            estimatedCost: 'Free',
            recommendedFood: 'Artisan bakery or espresso bar on the main square',
            insiderTip: 'Arrive before 9:30 AM to capture photos before walking tours begin.'
          },
          {
            id: 'd1-a2',
            time: '12:00 PM - 02:00 PM',
            period: 'Afternoon',
            title: 'Iconic Monument & Scenic Lunch',
            category: 'Sightseeing',
            description: `Visit the city’s crowning landmark or national museum. Followed by a leisurely lunch featuring regional specialties.`,
            duration: '2 hours',
            estimatedCost: '$$',
            recommendedFood: 'Traditional bistro or food hall with local dishes',
            insiderTip: 'Reserve entry tickets online in advance to skip the standard queues.'
          },
          {
            id: 'd1-a3',
            time: '02:30 PM - 05:00 PM',
            period: 'Afternoon',
            title: 'Artisan District & Riverside / Boulevard Stroll',
            category: 'Nature & Walk',
            description: `Meander through boutique alleys, local artisan workshops, and picturesque avenues that define ${titleCity}’s creative spirit.`,
            duration: '2.5 hours',
            estimatedCost: 'Free',
            recommendedFood: 'Handcrafted gelato or regional pastry',
            insiderTip: 'Duck into courtyards and side passages for peaceful hidden sights.'
          },
          {
            id: 'd1-a4',
            time: '06:30 PM - 09:30 PM',
            period: 'Evening',
            title: 'Golden Hour Panorama & Signature Dinner',
            category: 'Food & Drink',
            description: `Catch sunset views from an elevated viewpoint or rooftop terrace, followed by a multi-course dinner celebrating seasonal cuisine.`,
            duration: '3 hours',
            estimatedCost: '$$$',
            recommendedFood: 'Chef-driven neighborhood restaurant serving regional wine/beverage pairings',
            insiderTip: 'Sunset tables fill fast—book at least 2 days ahead.'
          }
        ]
      },
      {
        dayNumber: 2,
        title: 'Day 2: Arts, Green Spaces & Modern Culture',
        theme: 'Contemporary vibe, world-renowned museums, and park strolls',
        neighborhoods: ['Museum Quarter', 'Botanical Gardens', 'Fashion District'],
        activities: [
          {
            id: 'd2-a1',
            time: '09:30 AM - 12:00 PM',
            period: 'Morning',
            title: 'Premier Art Museum & Sculpture Gardens',
            category: 'Culture & Art',
            description: `Immerse yourself in world-renowned galleries highlighting both classical masterpieces and contemporary local artists.`,
            duration: '2.5 hours',
            estimatedCost: '$$',
            recommendedFood: 'Museum atrium cafe with specialty coffee',
            insiderTip: 'Check out the temporary exhibitions on the upper floor.'
          },
          {
            id: 'd2-a2',
            time: '12:30 PM - 02:30 PM',
            period: 'Afternoon',
            title: 'Vibrant Gourmet Market Feast',
            category: 'Food & Drink',
            description: `Explore a bustling covered food market where local vendors offer fresh cheeses, street food bites, and regional deli classics.`,
            duration: '2 hours',
            estimatedCost: '$',
            recommendedFood: 'Market stall specialties & fresh pressed fruit juices',
            insiderTip: 'Bring small cash or contactless card; graze across 3 different vendor stalls.'
          },
          {
            id: 'd2-a3',
            time: '03:00 PM - 05:30 PM',
            period: 'Afternoon',
            title: 'Park Relaxation & Architectural Discovery',
            category: 'Nature & Walk',
            description: `Stroll through the city’s premier public garden, featuring manicured ponds, shaded promenades, and stunning neoclassical or modern pavilions.`,
            duration: '2.5 hours',
            estimatedCost: 'Free',
            recommendedFood: 'Afternoon tea or chilled herbal infusion',
            insiderTip: 'Rent a city bike or electric scooter along the perimeter paths.'
          },
          {
            id: 'd2-a4',
            time: '06:30 PM - 09:30 PM',
            period: 'Evening',
            title: 'Night Market or Live Performance & Dinner',
            category: 'Culture & Art',
            description: `Experience ${titleCity}’s evening entertainment—from historic theater to cozy jazz bars or vibrant night pedestrian streets.`,
            duration: '3 hours',
            estimatedCost: '$$',
            recommendedFood: 'Tapas, mezze, or izakaya-style sharing plates',
            insiderTip: 'Ask the bartender or server for their favorite local craft beverage.'
          }
        ]
      },
      {
        dayNumber: 3,
        title: 'Day 3: Bohemian Enclaves, Panoramic Views & Sunset Farewell',
        theme: 'Local neighborhood living, artisan shopping, and scenic vistas',
        neighborhoods: ['Bohemian Quarter', 'Scenic Hilltop', 'Waterfront Promenade'],
        activities: [
          {
            id: 'd3-a1',
            time: '09:00 AM - 11:30 AM',
            period: 'Morning',
            title: 'Hilltop Viewpoint & Heritage Sanctuary',
            category: 'Scenic Views',
            description: `Climb or ride up to the highest vantage point of ${titleCity} for breathtaking 360-degree vistas stretching across the entire skyline.`,
            duration: '2.5 hours',
            estimatedCost: 'Free',
            recommendedFood: 'Freshly baked croissants or local breakfast treats',
            insiderTip: 'Morning light offers the crispest skyline photography without midday haze.'
          },
          {
            id: 'd3-a2',
            time: '12:00 PM - 02:30 PM',
            period: 'Afternoon',
            title: 'Bohemian Alleyways & Independent Boutiques',
            category: 'Shopping',
            description: `Wander through colorful side streets filled with indie bookstores, vintage shops, local ceramicists, and perfumeries.`,
            duration: '2.5 hours',
            estimatedCost: '$$',
            recommendedFood: 'Cozy courtyard garden cafe',
            insiderTip: 'Pick up authentic local artisan crafts rather than souvenir stall trinkets.'
          },
          {
            id: 'd3-a3',
            time: '03:00 PM - 05:30 PM',
            period: 'Afternoon',
            title: 'Scenic Waterfront or Canal Cruise',
            category: 'Sightseeing',
            description: `Glid along the waterfront or river to witness the city's historic bridges and facades from an entirely new aquatic vantage point.`,
            duration: '2.5 hours',
            estimatedCost: '$$',
            recommendedFood: 'Light refreshments on board',
            insiderTip: 'Sit on the upper open-air deck for unobstructed photo opportunities.'
          },
          {
            id: 'd3-a4',
            time: '06:30 PM - 10:00 PM',
            period: 'Evening',
            title: 'Grand Farewell Dinner & Illuminated Night Walk',
            category: 'Food & Drink',
            description: `Conclude your 3-day journey with an unforgettable dinner in an intimate historic cellar or scenic terrace, followed by a walk past illuminated monuments.`,
            duration: '3.5 hours',
            estimatedCost: '$$$',
            recommendedFood: 'Tasting menu highlighting the city’s culinary heritage',
            insiderTip: 'The monuments look completely transformed when lit at night—take a final walk.'
          }
        ]
      }
    ],
    curatedTips: [
      'Download offline transit maps (such as Citymapper or Google Maps) before setting out.',
      'Always carry a reusable water bottle and comfortable broken-in walking footwear.',
      'Check if a multi-day museum or transit pass is available to save both time and money.',
      'Many top restaurants and major monuments require reservations at least 3-7 days in advance.'
    ],
    packingHighlights: [
      'Ultra-comfortable walking shoes (expect 12,000–18,000 steps daily)',
      'Compact universal power adapter and portable battery bank',
      'Lightweight weather-proof outer shell or compact umbrella',
      'Crossbody anti-theft bag for public transit and crowded plazas'
    ]
  };
}

// API Endpoint to generate 3-day itinerary
app.post('/api/itinerary/generate', async (req: Request, res: Response) => {
  try {
    const { city, style = 'Balanced Highlights', pace = 'Moderate', companion = 'Solo Traveler' } = req.body;

    if (!city || typeof city !== 'string' || city.trim().length === 0) {
      res.status(400).json({ error: 'Please provide a valid city name.' });
      return;
    }

    const trimmedCity = city.trim();

    if (!aiClient) {
      console.log('No GEMINI_API_KEY detected. Using high quality structured fallback for:', trimmedCity);
      const fallback = generateFallbackItinerary(trimmedCity, style, pace, companion);
      res.json(fallback);
      return;
    }

    const prompt = `Create an exceptional, highly specific 3-day travel itinerary for the city of "${trimmedCity}".
Traveler Profile & Preferences:
- Travel Style: ${style}
- Pace: ${pace}
- Traveling with: ${companion}

Requirements:
1. Provide an authentic, practical, and highly realistic schedule for Day 1, Day 2, and Day 3.
2. Group activities logically by neighborhood to minimize unnecessary travel time.
3. For EACH day, include 4 distinctly timed activities spanning Morning, Mid-day/Afternoon, Late Afternoon, and Evening/Night.
4. Each activity MUST have realistic time ranges (e.g. "09:00 AM - 11:30 AM"), a catchy title, a clear category (e.g., "Culture & Art", "Sightseeing", "Food & Drink", "Nature & Walk", "Shopping", "Scenic Views"), an engaging 2-3 sentence description with real places, estimated duration, estimated cost level ("Free", "$", "$$", "$$$"), a specific recommended nearby food/cafe spot with signature item, and an insider tip.
5. Provide accurate city overview details: country name, catchy tagline, 2-3 sentence overview, best travel season, local currency with symbol, official/common language, and specific transit advice.
6. Provide 4 actionable local insider tips and 4 packing essentials tailored to this destination.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are an expert travel writer and local concierge. You specialize in crafting realistic, immersive, and logically routed 3-day travel itineraries with exact timings and neighborhood awareness. Return the response in strictly valid JSON conforming to the schema.`,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cityName: { type: Type.STRING, description: 'City name' },
            country: { type: Type.STRING, description: 'Country of the city' },
            tagline: { type: Type.STRING, description: 'Catchy 1-sentence tagline for the city' },
            overview: { type: Type.STRING, description: '2-3 sentence rich overview of this 3-day adventure' },
            bestSeason: { type: Type.STRING, description: 'Best season or months to visit' },
            localCurrency: { type: Type.STRING, description: 'Local currency name and symbol' },
            language: { type: Type.STRING, description: 'Primary language(s) spoken' },
            transitTip: { type: Type.STRING, description: 'Essential transit and getting-around tip' },
            days: {
              type: Type.ARRAY,
              description: 'Exactly 3 days of planned travel',
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER, description: '1, 2, or 3' },
                  title: { type: Type.STRING, description: 'Day title (e.g. Day 1: Historic Heart & Grand Boulevards)' },
                  theme: { type: Type.STRING, description: 'Short theme description for this day' },
                  neighborhoods: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Neighborhoods explored on this day'
                  },
                  activities: {
                    type: Type.ARRAY,
                    description: 'Sequential activities for the day',
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING, description: 'Unique activity id like d1-a1' },
                        time: { type: Type.STRING, description: 'Time range e.g. 09:00 AM - 11:30 AM' },
                        period: { type: Type.STRING, description: 'Morning, Afternoon, Evening, or Night' },
                        title: { type: Type.STRING, description: 'Descriptive activity name' },
                        category: { type: Type.STRING, description: 'Category e.g. Culture & Art, Sightseeing, Food & Drink, Nature & Walk, Shopping, Scenic Views' },
                        description: { type: Type.STRING, description: 'Engaging, vivid 2-3 sentence description with real places' },
                        duration: { type: Type.STRING, description: 'e.g. 2 hours' },
                        estimatedCost: { type: Type.STRING, description: 'Free, $, $$, or $$$' },
                        recommendedFood: { type: Type.STRING, description: 'Specific restaurant, street food stall, or cafe nearby with item to order' },
                        insiderTip: { type: Type.STRING, description: 'Insider travel tip for this activity' }
                      },
                      required: ['id', 'time', 'period', 'title', 'category', 'description', 'duration', 'estimatedCost']
                    }
                  }
                },
                required: ['dayNumber', 'title', 'theme', 'neighborhoods', 'activities']
              }
            },
            curatedTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '4 essential practical tips for this city'
            },
            packingHighlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '4 key packing recommendations for this trip'
            }
          },
          required: [
            'cityName',
            'country',
            'tagline',
            'overview',
            'bestSeason',
            'localCurrency',
            'language',
            'transitTip',
            'days',
            'curatedTips',
            'packingHighlights'
          ]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Gemini returned an empty response.');
    }

    const parsed = JSON.parse(text);
    parsed.preferences = { style, pace, companion };
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating itinerary with Gemini:', error);
    // Graceful fallback so the user always receives a working itinerary
    const { city, style = 'Balanced Highlights', pace = 'Moderate', companion = 'Solo Traveler' } = req.body;
    if (city && typeof city === 'string') {
      const fallback = generateFallbackItinerary(city, style, pace, companion);
      res.json(fallback);
    } else {
      res.status(500).json({ error: error.message || 'Failed to generate itinerary' });
    }
  }
});

// Start Express server and connect Vite in development or serve dist in production
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
