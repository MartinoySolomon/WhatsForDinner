import express from "express";
import axios from "axios";

export const imageRouter = express.Router();

// GET /api/image?dish=Pizza
imageRouter.get("/", async (req, res) => {
	const dish = req.query.dish;
	if (!dish) {
		return res.status(400).json({ error: "Missing 'dish' query parameter." });
	}
	try {
		console.log("UNSPLASH_ACCESS_KEY:", process.env.UNSPLASH_ACCESS_KEY);
		const response = await axios.get("https://api.unsplash.com/search/photos", {
			params: {
				query: dish,
				per_page: 1,
				orientation: "landscape",
			},
			headers: {
				Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
			},
		});
		const results = response.data.results;
		if (results && results.length > 0) {
			return res.json({ imageUrl: results[0].urls.regular });
		} else {
			return res.status(404).json({ error: "No image found for this dish." });
		}
	} catch (error: any) {
		if (error.response) {
			console.error("Unsplash fetch error:", error.response.data);
			return res
				.status(500)
				.json({
					error: "Failed to fetch image from Unsplash.",
					details: error.response.data,
				});
		} else {
			console.error("Unsplash fetch error:", error.message || error);
			return res
				.status(500)
				.json({
					error: "Failed to fetch image from Unsplash.",
					details: error.message || String(error),
				});
		}
	}
});
