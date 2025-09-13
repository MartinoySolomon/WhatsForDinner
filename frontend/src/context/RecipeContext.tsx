import { createContext, useState } from "react";
import type { RecipeInput } from "../types/recipeInput";
import type { Recipe } from "../types/recipe";

interface RecipeContextType {
	userInput: RecipeInput | null;
	setUserInput: (input: RecipeInput | null) => void;
	recipe: Recipe | null;
	setRecipe: (recipe: Recipe | null) => void;
	isLoading: boolean;
	setIsLoading: (loading: boolean) => void;
	error: string | null;
	setError: (error: string | null) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export default RecipeContext;

export function RecipeProvider({ children }: { children: React.ReactNode }) {
	const [userInput, setUserInput] = useState<RecipeInput | null>(null);
	const [recipe, setRecipe] = useState<Recipe | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	return (
		<RecipeContext.Provider value={{ userInput, setUserInput, recipe, setRecipe, isLoading, setIsLoading, error, setError }}>
			{children}
		</RecipeContext.Provider>
	);
}
