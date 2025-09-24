import { createContext, useState, useEffect } from "react";
import type { RecipeInput } from "../types/recipeInput";
import type { Recipe } from "../types/recipe";
import { localStorageService } from "../services/localStorageService";

interface RecipeContextType {
	userInput: RecipeInput | null;
	setUserInput: (input: RecipeInput | null) => void;
	recipe: Recipe | null;
	setRecipe: (recipe: Recipe | null) => void;
	isLoading: boolean;
	setIsLoading: (loading: boolean) => void;
	error: string | null;
	setError: (error: string | null) => void;
	clearRecipeData: () => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export default RecipeContext;

export function RecipeProvider({ children }: { children: React.ReactNode }) {
	const [userInput, setUserInput] = useState<RecipeInput | null>(null);
	const [recipe, setRecipe] = useState<Recipe | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const storedData = localStorageService.getRecipeData();
		if (storedData) {
			setUserInput(storedData.userInput);
			setRecipe(storedData.recipe);
		}
	}, []);

	useEffect(() => {
		if (recipe !== null || userInput !== null) {
			localStorageService.saveRecipeData(recipe, userInput);
		}
	}, [recipe, userInput]);

	const handleSetUserInput = (input: RecipeInput | null) => {
		setUserInput(input);
	};

	const handleSetRecipe = (newRecipe: Recipe | null) => {
		setRecipe(newRecipe);
	};

	const clearRecipeData = () => {
		setUserInput(null);
		setRecipe(null);
		setError(null);
		localStorageService.clearRecipeData();
	};

	return (
		<RecipeContext.Provider
			value={{
				userInput,
				setUserInput: handleSetUserInput,
				recipe,
				setRecipe: handleSetRecipe,
				isLoading,
				setIsLoading,
				error,
				setError,
				clearRecipeData,
			}}>
			{children}
		</RecipeContext.Provider>
	);
}
