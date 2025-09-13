import express from "express";
import { generateRecipe } from "../services/openai";

export const recipeRouter = express.Router();

// POST /api/recipe
recipeRouter.post("/", async (req, res) => {
	try {
		const { skill, taste, cuisine, time } = req.body;
		if (!skill || !taste || !cuisine || !time) {
			return res.status(400).json({ error: "Missing required fields." });
		}
		const recipe = await generateRecipe({ skill, taste, cuisine, time });
		res.json(recipe);
	} catch (error) {
		res.status(500).json({ error: "Failed to generate recipe." });
	}
});
