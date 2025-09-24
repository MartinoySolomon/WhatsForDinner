import "./Result.css";
import useRecipe from "../../hooks/useRecipe";
import { useNavigate } from "react-router-dom";
import start from "../../assets/start-btn.png";
import { SKILL_LEVELS } from "../../utils/constants";
import { FLAVOR_PREFERENCES } from "../../utils/constants";
import Logo from "../../components/Logo/Logo";
export default function Result() {
	const navigate = useNavigate();

	const { recipe, error } = useRecipe();
	console.log(recipe);
	return (
		<>
			{error && <div className="error">{error}</div>}
			{recipe && (
				<div className="recipe-card">
				<Logo/>
					<div className="recipe-title">
						<h2>{recipe.name}</h2>
						<p>{recipe.description}</p>
					</div>
					<div className="recipe-card-content">
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
						<div className="recipe-img">
							<img
								src={recipe.imageUrl}
								alt={recipe.name}
							/>
						</div>
					</div>
					<img
						src={start}
						alt="start"
						className="start-btn"
						onClick={() => {
							navigate("/recipe");
						}}
					/>
					<div className="recipe-input">
						<div className="recipe-input-item">
							<h4>Cuisine</h4>
							<h3>{recipe.cuisine}</h3>
						</div>
						<div className="recipe-input-item">
							<h4>Mindset</h4>
							<h3>
								{
									FLAVOR_PREFERENCES.find(
										(item) => item.id === recipe.nutrition
									)?.name
								}
							</h3>
						</div>
						<div className="recipe-input-item">
							<h4>Skill Level</h4>
							<h3>
								{
									SKILL_LEVELS.find((item) => item.id === recipe.skillLevel)
										?.name
								}
							</h3>
						</div>
						<div className="recipe-input-item">
							<h4>Cooking Time</h4>
							<h3>{`${Math.floor((recipe.cookTime + recipe.prepTime) / 60)}h ${
								(recipe.cookTime + recipe.prepTime) % 60
							}min`}</h3>
				
						</div>
					</div>
				</div>
			)}
		</>
	);
}
