import { API_BASE_URLS } from "../utils/constants";
import { mockImage } from "./mockImage";
import { USE_MOCK_RECIPE_API } from "./recipeApi";

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
	}finally{}
}
