import OpenAI from "openai";

interface RecipeInput {
	skill: number;
	taste: number;
	cuisine: string;
	time: number;
}

interface Ingredient {
	name: string;
	quantity: string;
}

interface Recipe {
	name: string;
	description: string;
	ingredients: Ingredient[];
	instructions: string[];
	cuisine: string;
	prepTime: number;
	cookTime: number;
	skillLevel: number;
	nutrition: number;
	imageUrl: string;
}

export async function generateRecipe({
	skill,
	taste,
	cuisine,
	time,
}: RecipeInput) {
	// Initialize OpenAI client here to ensure env vars are loaded
	const openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});

	// Build the prompt for OpenAI with exact JSON format specification
	const prompt = `Suggest a dinner recipe based on these preferences:
Skill level: ${skill} (1-5 scale, where 1 is easy, 5 is advanced)
Taste vs Nutrition balance: ${taste} (1-5 scale, where 1 is healthy, 5 is tasty)
Cuisine: ${cuisine}
Time available: ${time} in minutes

You must return ONLY a valid JSON object with this exact structure:
{
  "name": "Recipe Name",
  "description": "Brief description of the dish",
  "ingredients": [
    {"name": "ingredient name", "quantity": "amount with unit"}
  ],
  "instructions": ["step 1", "step 2", "step 3"],
  "cuisine": "${cuisine}",
  "prepTime": number_in_minutes,
  "cookTime": number_in_minutes,
  "skillLevel": ${skill},
  "nutrition": ${taste},
  "imageUrl": ""
}

Ensure prepTime + cookTime does not exceed ${time} in minutes. Return only the JSON object, no additional text.`;

	const response = await openai.chat.completions.create({
		model: "gpt-3.5-turbo",
		messages: [
			{
				role: "system",
				content:
					"You are a helpful chef assistant. Always respond with valid JSON only, no markdown or additional text.",
			},
			{ role: "user", content: prompt },
		],
		temperature: 0.7,
		max_tokens: 800,
		response_format: { type: "json_object" },
	});

	// Try to parse the response as JSON
	const text = response.choices[0]?.message?.content || "";
	try {
		const recipe: any = JSON.parse(text);

		// Validate that all required fields are present
		const requiredFields = [
			"name",
			"description",
			"ingredients",
			"instructions",
			"cuisine",
			"prepTime",
			"cookTime",
			"skillLevel",
			"nutrition",
		];
		const missingFields = requiredFields.filter((field) => !(field in recipe));

		if (missingFields.length > 0) {
			console.error("Missing required fields:", missingFields);
			return {
				error: `Invalid recipe format. Missing fields: ${missingFields.join(
					", "
				)}`,
			};
		}

		// Ensure imageUrl exists (set to empty string if not provided)
		if (!recipe.imageUrl) {
			recipe.imageUrl = "";
		}

		// Validate ingredients format
		if (
			!Array.isArray(recipe.ingredients) ||
			recipe.ingredients.some((ing: any) => !ing.name || !ing.quantity)
		) {
			return {
				error:
					"Invalid ingredients format. Each ingredient must have name and quantity.",
			};
		}

		// Validate instructions format
		if (
			!Array.isArray(recipe.instructions) ||
			recipe.instructions.length === 0
		) {
			return {
				error:
					"Invalid instructions format. Must be a non-empty array of strings.",
			};
		}

		return recipe as Recipe;
	} catch (error) {
		console.error("JSON parsing error:", error);
		console.error("Raw response:", text);
		return {
			error: "Could not parse recipe response. Please try again.",
		};
	}
}

// Simple in-memory cache for generated images
const imageCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function generateRecipeImage(
	recipeName: string,
	description: string,
	cuisine: string
) {
	// Create cache key from recipe name and cuisine
	const cacheKey = `${recipeName
		.toLowerCase()
		.trim()}_${cuisine.toLowerCase()}`;

	// Check cache first
	const cached = imageCache.get(cacheKey);
	if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
		console.log(`Using cached image for: ${recipeName}`);
		return { imageUrl: cached.url };
	}

	// Initialize OpenAI client
	const openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});

	// Create a focused prompt for food-only image generation
	const prompt = `Close-up ${recipeName}, ${cuisine} cuisine. ${description}. Professional food photography, appetizing, well-lit, restaurant quality presentation, overhead view, vibrant colors, fresh ingredients visible, food only, no camera, no people, no hands`;

	try {
		const response = await openai.images.generate({
			model: "dall-e-3",
			prompt: prompt,
			n: 1,
			size: "1792x1024", // Landscape format
			quality: "standard", // Standard quality to save credits
			style: "natural",
		});

		if (!response.data || response.data.length === 0) {
			throw new Error("No image data returned from OpenAI");
		}

		const imageUrl = response.data[0]?.url;
		if (!imageUrl) {
			throw new Error("No image URL returned from OpenAI");
		}

		// Cache the generated image
		imageCache.set(cacheKey, { url: imageUrl, timestamp: Date.now() });
		console.log(`Generated and cached new image for: ${recipeName}`);

		return { imageUrl };
	} catch (error) {
		console.error("Image generation error:", error);
		throw new Error(
			`Failed to generate image: ${
				error instanceof Error ? error.message : "Unknown error"
			}`
		);
	}
}
