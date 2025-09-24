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

	const skillDescriptions = {
		1: "very easy - minimal cooking skills required, simple techniques",
		2: "easy - basic cooking skills, simple preparation methods",
		3: "intermediate - moderate cooking skills, some techniques required",
		4: "advanced - good cooking skills, complex techniques and timing",
		5: "expert - professional level skills, advanced techniques and precision",
	};

	const tasteDescriptions = {
		1: "extremely healthy and nutritious - focus on whole foods, low calories, high nutrients",
		2: "mostly healthy - balanced nutrition with some flavor compromises",
		3: "balanced - good mix of nutrition and taste",
		4: "indulgent - prioritize flavor with some nutritional value",
		5: "maximum flavor - rich, decadent, comfort food focused",
	};

	const creativityPrompts = [
		"Create a unique twist on a classic dish.",
		"Suggest something unexpected and creative.",
		"Focus on fresh, seasonal ingredients.",
		"Make it restaurant-quality but achievable at home.",
		"Include interesting flavor combinations.",
		"Make it Instagram-worthy and delicious.",
	];
	const randomCreativity =
		creativityPrompts[Math.floor(Math.random() * creativityPrompts.length)];

	const prompt = `Create a unique ${cuisine} dinner recipe with these specific requirements:

SKILL LEVEL: ${skill}/5 - ${
		skillDescriptions[skill as keyof typeof skillDescriptions]
	}
TASTE/NUTRITION: ${taste}/5 - ${
		tasteDescriptions[taste as keyof typeof tasteDescriptions]
	}  
CUISINE: ${cuisine}
TIME CONSTRAINT: Total cooking time (prep + cook) must be EXACTLY within ${time} minutes or less
CREATIVITY: ${randomCreativity}

CRITICAL REQUIREMENTS:
- Skill level ${skill} means the recipe complexity must match exactly (not easier or harder)
- Time constraint of ${time} minutes is MANDATORY - prepTime + cookTime ≤ ${time}
- Taste/nutrition balance of ${taste} must be reflected in ingredient choices and cooking methods
- Must be authentic to ${cuisine} cuisine style
- Make it varied and unique - avoid common/repetitive recipes

Return ONLY a valid JSON object with this exact structure:
{
  "name": "Unique Recipe Name",
  "description": "Brief 1-2 sentence description of the dish and its appeal",
  "ingredients": [
    {"name": "specific ingredient name", "quantity": "exact amount with unit"}
  ],
  "instructions": ["detailed step 1 with specific techniques", "step 2", "step 3", "etc"],
  "cuisine": "${cuisine}",
  "prepTime": number_in_minutes,
  "cookTime": number_in_minutes, 
  "skillLevel": ${skill},
  "nutrition": ${taste},
  "imageUrl": ""
}`;

	const response = await openai.chat.completions.create({
		model: "gpt-4o-mini", 
		messages: [
			{
				role: "system",
				content: `You are a professional chef and culinary expert. You create diverse, authentic recipes that precisely match the requested parameters. Always respond with valid JSON only, no markdown or additional text. 

Key principles:
- STRICTLY follow time constraints - prepTime + cookTime must not exceed the given time limit
- Match skill level exactly - don't make recipes easier or harder than requested  
- Reflect the taste/nutrition balance accurately in ingredient choices
- Create varied, unique recipes - avoid repetition
- Ensure authenticity to the requested cuisine
- Include specific techniques appropriate for the skill level
- Keep descriptions concise - maximum 1-2 sentences only`,
			},
			{ role: "user", content: prompt },
		],
		temperature: 0.8, 
		max_tokens: 1500, 
		response_format: { type: "json_object" },
	});

	
	const text = response.choices[0]?.message?.content || "";
	try {
		const recipe: any = JSON.parse(text);

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

		if (!recipe.imageUrl) {
			recipe.imageUrl = "";
		}

		const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
		if (totalTime > time) {
			console.warn(
				`Recipe time (${totalTime}min) exceeds limit (${time}min), regenerating...`
			);
			return {
				error: `Recipe time exceeds limit. Total time: ${totalTime} minutes, limit: ${time} minutes. Please try again.`,
			};
		}

		if (recipe.skillLevel !== skill) {
			console.warn(
				`Recipe skill level (${recipe.skillLevel}) doesn't match requested (${skill})`
			);
		}

		if (recipe.nutrition !== taste) {
			console.warn(
				`Recipe nutrition level (${recipe.nutrition}) doesn't match requested (${taste})`
			);
		}

		if (
			!Array.isArray(recipe.ingredients) ||
			recipe.ingredients.some((ing: any) => !ing.name || !ing.quantity)
		) {
			return {
				error:
					"Invalid ingredients format. Each ingredient must have name and quantity.",
			};
		}

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

const imageCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function generateRecipeImage(
	recipeName: string,
	description: string,
	cuisine: string
) {
	const cacheKey = `${recipeName
		.toLowerCase()
		.trim()}_${cuisine.toLowerCase()}`;

	const cached = imageCache.get(cacheKey);
	if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
		console.log(`Using cached image for: ${recipeName}`);
		return { imageUrl: cached.url };
	}

	const openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});

	const prompt = `Close-up ${recipeName}, ${cuisine} cuisine. ${description}. Professional food photography, appetizing, well-lit, restaurant quality presentation, overhead view, vibrant colors, fresh ingredients visible, food only, no camera, no people, no hands`;

	try {
		const response = await openai.images.generate({
			model: "dall-e-3",
			prompt: prompt,
			n: 1,
			size: "1792x1024", 
			quality: "standard", 
			style: "natural",
		});

		if (!response.data || response.data.length === 0) {
			throw new Error("No image data returned from OpenAI");
		}

		const imageUrl = response.data[0]?.url;
		if (!imageUrl) {
			throw new Error("No image URL returned from OpenAI");
		}

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
