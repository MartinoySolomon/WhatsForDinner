import "./Result.css";
import useRecipe from "../../hooks/useRecipe";
export default function Result() {
	const { recipe } = useRecipe();
	console.log(recipe);
	return (
		<>
			<div>
				{recipe && (
					<div>
						<h2>{recipe.name}</h2>
						<img
							src={recipe.imageUrl}
							alt={recipe.name}
						/>
						<p>{recipe.description}</p>

						<ul>
							{recipe.ingredients.map((ingredient, index) => (
								<li key={index}>
									{ingredient.quantity} {ingredient.name}{" "}
								</li>
							))}
						</ul>

						<p>{recipe.instructions}</p>
					</div>
				)}
			</div>
		</>
	);
}
