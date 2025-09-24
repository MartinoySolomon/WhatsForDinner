import type { Recipe } from "../types/recipe";
import type { RecipeInput } from "../types/recipeInput";
import { API_BASE_URLS } from "../utils/constants";
import { mockRecipe } from "./mockRecipe";

// Toggle this to true to use mock data
export const USE_MOCK_RECIPE_API = false;

export async function fetchRecipe(input: RecipeInput): Promise<Recipe> {
	if (USE_MOCK_RECIPE_API) {
		await new Promise((res) => setTimeout(res, 3000));
		return mockRecipe;
	}
	try {
		const response = await fetch(`${API_BASE_URLS.RECIPE}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(input),
		});
		if (!response.ok) {
			throw new Error("Failed to fetch recipe");
		}
		return response.json();
	} catch (error) {
		console.error("Error fetching recipe:", error);
		throw error;
	}
}
