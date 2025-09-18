import "./Result.css";
import useRecipe from "../../hooks/useRecipe";
export default function Result() {
	const { recipe } = useRecipe();
	console.log(recipe);
	return (
		<>
			<div>
				<h1>Result</h1>
				{recipe && (
					<div>
						<h2>{recipe.name}</h2>
						<img
							src={recipe.imageUrl}
							alt={recipe.name}
						/>
						<p>{recipe.description}</p>
						<p>
							{recipe.ingredients.map((ingredient, index) => (
								<ul>
									<li key={index}>
										{ingredient.quantity} {ingredient.name}{" "}
									</li>
								</ul>
							))}
						</p>
					</div>
				)}
			</div>
		</>
	);
}
