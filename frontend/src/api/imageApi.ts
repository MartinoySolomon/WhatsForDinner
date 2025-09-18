import { API_BASE_URLS } from "../utils/constants";

export async function fetchImage(dish: string): Promise<{ imageUrl: string }> {
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
