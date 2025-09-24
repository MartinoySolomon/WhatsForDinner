import type { Recipe } from "../types/recipe";
import type { RecipeInput } from "../types/recipeInput";

const RECIPE_STORAGE_KEY = "whatsfordinner_recipe";

export interface StoredRecipeData {
	recipe: Recipe | null;
	userInput: RecipeInput | null;
	timestamp: number;
}

class LocalStorageService {
	//  Save recipe data to local storage
	saveRecipeData(recipe: Recipe | null, userInput: RecipeInput | null): void {
		try {
			const data: StoredRecipeData = {
				recipe,
				userInput,
				timestamp: Date.now(),
			};
			localStorage.setItem(RECIPE_STORAGE_KEY, JSON.stringify(data));
		} catch (error) {
			console.error("Failed to save recipe data to localStorage:", error);
		}
	}

	//  Retrieve recipe data from local storage
	getRecipeData(): StoredRecipeData | null {
		try {
			const storedData = localStorage.getItem(RECIPE_STORAGE_KEY);
			if (!storedData) return null;

			const parsedData: StoredRecipeData = JSON.parse(storedData);
			return parsedData;
		} catch (error) {
			console.error("Failed to retrieve recipe data from localStorage:", error);
			return null;
		}
	}

	//  Clear recipe data from local storage
	clearRecipeData(): void {
		try {
			localStorage.removeItem(RECIPE_STORAGE_KEY);
		} catch (error) {
			console.error("Failed to clear recipe data from localStorage:", error);
		}
	}

	//  Check if there's valid stored recipe data
	hasStoredRecipeData(): boolean {
		const data = this.getRecipeData();
		return data !== null && (data.recipe !== null || data.userInput !== null);
	}
}

export const localStorageService = new LocalStorageService();
