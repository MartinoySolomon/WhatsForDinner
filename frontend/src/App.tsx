import "./App.css";
import logo from "./assets/logo.png";
import useRecipe from "./hooks/useRecipe";
import { fetchRecipe } from "./api/recipeApi";
import { fetchImage } from "./api/imageApi";
import { useEffect } from "react";

function App() {
	// const { recipe, setRecipe, userInput, setUserInput } = useRecipe();
	// useEffect(() => {
	// 	setUserInput({ skill: 3, taste: 7, cuisine: "Italian", time: 30 });
	// 	if (!userInput) return;
	// 	const fetchData = async () => {
	// 		const data = await fetchRecipe(userInput);
	// 		setRecipe(data);
	// 	};
	// 	fetchData();
	// 	const fetchImageData = async () => {
  //     const imageData = await fetchImage("Spaghetti Carbonara");
  //     if (imageData && imageData.imageUrl) {
  //         console.log(imageData.imageUrl);
  //     }
			// if (recipe) {
			// 	const imageData = await fetchImage(recipe.name);
      //   if (imageData && imageData.imageUrl) {
      //     console.log(imageData.imageUrl);
      //     setRecipe({ ...recipe, imageUrl: imageData.imageUrl });
      //   }
			// }
		// };
	// 	fetchImageData();
	// }, []);
	// console.log({ recipe });

	return (
		<>
			<p></p>
			<img
				src={logo}
				alt="Logo"
			/>
		</>
	);
}

export default App;
