import express from "express";
import axios from "axios";
import { generateRecipeImage } from "../services/openai";

export const imageRouter = express.Router();

// Helper function to create food-specific search queries
const createFoodSearchQueries = (dish: string): string[] => {
	const dishName = dish.toString().toLowerCase().trim();

	// Primary search with food-specific keywords
	const primaryQueries = [
		`${dishName} food photography`,
		`${dishName} dish meal`,
		`${dishName} recipe food`,
		`delicious ${dishName} food`,
	];

	// Fallback queries for broader food search
	const fallbackQueries = [
		`${dishName} cuisine`,
		`${dishName} cooking`,
		`food ${dishName}`,
	];

	return [...primaryQueries, ...fallbackQueries];
};

// Helper function to search for food images with multiple query strategies
const searchFoodImage = async (queries: string[], accessKey: string) => {
	for (const query of queries) {
		try {
			const response = await axios.get(
				"https://api.unsplash.com/search/photos",
				{
					params: {
						query: query,
						per_page: 5, // Get more results to choose from
						orientation: "landscape",
						// Add content filter to focus on food photography
						content_filter: "high",
						// Order by relevance to get best matches first
						order_by: "relevance",
					},
					headers: {
						Authorization: `Client-ID ${accessKey}`,
					},
				}
			);

			const results = response.data.results;
			if (results && results.length > 0) {
				// Filter results for food-related images based on tags and description
				const foodImage = results.find((image: any) => {
					const tags =
						image.tags?.map((tag: any) => tag.title?.toLowerCase()) || [];
					const description = (
						image.description ||
						image.alt_description ||
						""
					).toLowerCase();

					// Look for food-related keywords in tags and descriptions
					const foodKeywords = [
						"food",
						"dish",
						"meal",
						"cuisine",
						"recipe",
						"cooking",
						"restaurant",
						"delicious",
						"tasty",
						"eat",
						"dinner",
						"lunch",
						"breakfast",
						"snack",
						"plate",
						"bowl",
						"kitchen",
						"chef",
						"ingredients",
						"fresh",
					];

					const hasFootKeywords = foodKeywords.some(
						(keyword) => tags.includes(keyword) || description.includes(keyword)
					);

					// Avoid non-food images
					const avoidKeywords = [
						"person",
						"people",
						"human",
						"man",
						"woman",
						"face",
						"portrait",
						"building",
						"architecture",
						"landscape",
						"nature",
						"animal",
						"car",
						"technology",
						"phone",
						"computer",
						"abstract",
						"art",
						"design",
					];

					const hasAvoidKeywords = avoidKeywords.some(
						(keyword) => tags.includes(keyword) || description.includes(keyword)
					);

					return hasFootKeywords && !hasAvoidKeywords;
				});

				// Return the filtered food image or the first result if no specific food image found
				const selectedImage = foodImage || results[0];
				return selectedImage.urls.regular;
			}
		} catch (error: any) {
			console.log(
				`Failed to search with query: "${query}"`,
				error.message || error
			);
			continue; // Try next query
		}
	}
	return null;
};

// GET /api/image/generate - Generate AI image for recipe
imageRouter.post("/generate", async (req, res) => {
	const { name, description, cuisine } = req.body;

	if (!name) {
		return res.status(400).json({ error: "Missing 'name' in request body." });
	}

	try {
		console.log(`Generating AI image for recipe: ${name}`);

		const result = await generateRecipeImage(
			name,
			description || "",
			cuisine || "international"
		);

		return res.json(result);
	} catch (error: any) {
		console.error("AI image generation error:", error.message || error);
		return res.status(500).json({
			error: "Failed to generate AI image.",
			details: error.message || String(error),
		});
	}
});

// GET /api/image?dish=Pizza - Legacy Unsplash endpoint (keep for fallback)
imageRouter.get("/", async (req, res) => {
	const dish = req.query.dish;
	if (!dish) {
		return res.status(400).json({ error: "Missing 'dish' query parameter." });
	}

	try {
		console.log("UNSPLASH_ACCESS_KEY:", process.env.UNSPLASH_ACCESS_KEY);

		const queries = createFoodSearchQueries(dish.toString());
		const imageUrl = await searchFoodImage(
			queries,
			process.env.UNSPLASH_ACCESS_KEY!
		);

		if (imageUrl) {
			return res.json({ imageUrl });
		} else {
			return res
				.status(404)
				.json({ error: "No food image found for this dish." });
		}
	} catch (error: any) {
		if (error.response) {
			console.error("Unsplash fetch error:", error.response.data);
			return res.status(500).json({
				error: "Failed to fetch image from Unsplash.",
				details: error.response.data,
			});
		} else {
			console.error("Unsplash fetch error:", error.message || error);
			return res.status(500).json({
				error: "Failed to fetch image from Unsplash.",
				details: error.message || String(error),
			});
		}
	}
});
