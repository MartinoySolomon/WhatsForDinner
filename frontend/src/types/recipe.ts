export interface Ingredient {
  name: string;
  quantity: string; 
}

export interface Recipe {
	name: string;
	description: string;
	ingredients: Ingredient[];
	instructions: string[];
	cuisine: string;
	prepTime: number; // in minutes
	cookTime: number; // in minutes
	skillLevel: number;
	nutrition: number; 
	imageUrl: string;
}
