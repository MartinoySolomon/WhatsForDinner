import { API_BASE_URLS } from "../utils/constants";
import { mockImage } from "./mockImage";
import { USE_MOCK_RECIPE_API } from "./recipeApi";

interface Recipe {
	name: string;
	description?: string;
	cuisine?: string;
}

// New AI image generation function
export async function generateRecipeImage(
	recipe: Recipe
): Promise<{ imageUrl: string }> {
	if (USE_MOCK_RECIPE_API) {
		// Simulate network delay
		await new Promise((res) => setTimeout(res, 1000)); // Longer delay for AI generation simulation
		return mockImage;
	}

	try {
		const response = await fetch(API_BASE_URLS.AI_IMAGE, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: recipe.name,
				description: recipe.description || "",
				cuisine: recipe.cuisine || "international",
			}),
		});

		if (!response.ok) {
			throw new Error(`Failed to generate AI image: ${response.statusText}`);
		}

		return response.json();
	} catch (error) {
		console.error("Error generating AI image:", error);
		throw error;
	}
}

// Legacy function for Unsplash (kept for fallback)
export async function fetchImage(dish: string): Promise<{ imageUrl: string }> {
	if (USE_MOCK_RECIPE_API) {
		// Simulate network delay
		await new Promise((res) => setTimeout(res, 200));
		return mockImage;
	}
	try {
		const response = await fetch(
			`${API_BASE_URLS.IMAGE}${encodeURIComponent(dish)}`
		);
		if (!response.ok) {
			throw new Error("Failed to fetch image");
		}
		return response.json();
	} catch (error) {
		console.error("Error fetching image:", error);
		throw error;
	}
}
