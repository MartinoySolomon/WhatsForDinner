import "./Result.css";
import useRecipe from "../../hooks/useRecipe";
import { useNavigate } from "react-router-dom";
export default function Result() {
	const navigate = useNavigate();
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
						<button
							onClick={() => {
								navigate("/recipe");
							}}>
							Start
						</button>
					</div>
				)}
			</div>
		</>
	);
}
