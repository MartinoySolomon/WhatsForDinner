import "./Recipe.css";
import Timer from "../../components/Timer/Timer";
import useRecipe from "../../hooks/useRecipe";
import Logo from "../../components/Logo/Logo";
export default function Recipe() {
	const { recipe, error } = useRecipe();
	console.log(recipe);

	return (
		<>
			{error && <div className="error">{error}</div>}
			{recipe && (
				<div className="recipe">
					<Logo />
					<div className="recipe-title">
						<h2>{recipe.name}</h2>
						<p>{recipe.description}</p>
					</div>
					<div className="recipe-content">
						<div className="recipe-ingredients">
							<h3>Ingredients</h3>
							{recipe.ingredients.map((ingredient, index) => (
								<div
									className="ingredient"
									key={index}>
									<b>{ingredient.name}</b> <i>{ingredient.quantity}</i>
								</div>
							))}
						</div>
						<ol className="recipe-instructions">
							<h3>Instructions</h3>
							{recipe.instructions.map((step, index) => (
								<li
									key={index}
									className="instruction">
									{step}
								</li>
							))}
						</ol>
					</div>
					<Timer />
				</div>
			)}
		</>
	);
}
