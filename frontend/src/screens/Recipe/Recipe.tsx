import "./Recipe.css";
import Timer from "../../components/Timer/Timer";
import useRecipe from "../../hooks/useRecipe";
import { useNavigate } from "react-router-dom";
export default function Recipe() {
  const navigate = useNavigate();
  const { recipe } = useRecipe();
  return (
    <>
      <div>
        <h1>Recipe</h1>
        <h2>Preperation:</h2>

        <div>Timer</div>
        <Timer />
        <h2>Cooking:</h2>
        <p>{recipe?.instructions}</p>
        <h2>Baking:</h2>
        <button onClick={() => {navigate("/")}}>Finished, Go Back to Home Page</button>
      </div>
    </>
  );
}
