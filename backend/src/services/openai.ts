import OpenAI from "openai";

interface RecipeInput {
	skill: number;
	taste: number;
	cuisine: string;
	time: number;
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

	// Build the prompt for OpenAI
	const prompt = `Suggest a dinner recipe based on these preferences:\n
Skill level: ${skill}\nTaste vs Nutrition: ${taste}\nCuisine: ${cuisine}\nTime available: ${time} minutes\n
Return a JSON object with the following fields: name, description, ingredients (array of objects with name and quantity), instructions (array), cuisine, prep time (number) in minutes, cook time (number) in minutes, skill level.`;

	const response = await openai.chat.completions.create({
		model: "gpt-3.5-turbo",
		messages: [
			{ role: "system", content: "You are a helpful chef assistant." },
			{ role: "user", content: prompt },
		],
		temperature: 0.7,
		max_tokens: 600,
	});

	// Try to parse the response as JSON
	const text = response.choices[0]?.message?.content || "";
	try {
		return JSON.parse(text);
	} catch {
		return { error: "Could not parse recipe response." };
	}
}
