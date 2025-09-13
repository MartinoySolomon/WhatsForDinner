import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { recipeRouter } from "./routes/recipe";
import { imageRouter } from "./routes/image";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("What's For Dinner backend is running!");
});

app.use("/api/recipe", recipeRouter);
app.use("/api/image", imageRouter);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
