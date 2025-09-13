import type { Recipe } from "../types/recipe";
import type { RecipeInput } from "../types/recipeInput";
import { API_BASE_URLS } from "../utils/constants";

export async function fetchRecipe(input: RecipeInput): Promise<Recipe> {
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
	} finally {
	}
}
