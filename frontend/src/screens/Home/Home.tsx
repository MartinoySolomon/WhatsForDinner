import "./Home.css";
import logo from "../../assets/logo.png";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRecipe } from "../../api/recipeApi";
import { fetchImage } from "../../api/imageApi";
import useRecipe from "../../hooks/useRecipe";
import Slider from "../../components/Slider/Slider";
import Loader from "../../components/Loader/Loader";
import baker from "../../assets/baker.png";
import egg from "../../assets/fried-egg.png";
import knife from "../../assets/french-knife.png";
import salad from "../../assets/salad.png";
import pizza from "../../assets/pizza.png";
import meal from "../../assets/meal.png";
import logoMobile from "../../assets/logo-mobile.png";
import {
	SKILL_LEVELS,
	FLAVOR_PREFERENCES,
	CUISINES,
} from "../../utils/constants";
import ClockTimePicker from "../../components/ClockTimePicker/ClockTimePicker";
import CuisineWorldMap from "../../components/CuisineWorldMap/CuisineWorldMap";
import WindowContext from "../../context/WindowContext";

export default function Home() {
	const isDesktop = useContext(WindowContext);
	const [skillLevel, setSkillLevel] = useState(SKILL_LEVELS[0].id);
	const [flavorPreference, setFlavorPreference] = useState(
		FLAVOR_PREFERENCES[0].id
	);
	const [cuisine, setCuisine] = useState(CUISINES[0]);
	const [time, setTime] = useState(10);
	const {
		setRecipe,
		setUserInput,
		isLoading,
		setIsLoading,
		error,
		setError,
		clearRecipeData,
	} = useRecipe();
	const navigate = useNavigate();

	const getRecipe = async () => {
		clearRecipeData();
		setIsLoading(true);
		const input = {
			skill: skillLevel,
			taste: flavorPreference,
			cuisine: cuisine,
			time: time,
		};
		setUserInput(input);
		try {
			const newRecipe = await fetchRecipe(input);
			if (!newRecipe) {
				setError("No recipe found");
				throw new Error("No recipe found");
			}
			const newImage = await fetchImage(newRecipe.name);
			if (!newImage) {
				setError("No image found");
				throw new Error("No image found");
			}
			setRecipe({ ...newRecipe, imageUrl: newImage.imageUrl });
		} catch (error) {
			console.error("Error in handleClick:", error);
		} finally {
			navigate("/result");
			setIsLoading(false);
		}
	};

	return (
		<>
			{isLoading && <Loader />}
			{error && <p className="error">{error}</p>}
			{!isLoading && (
				<>
					{isDesktop && (
						<div className="btn">
							<img
								src={logo}
								alt="Logo"
								onClick={getRecipe}
							/>
						</div>
					)}
					<div className="home-container">
						<div className="input-item time">
							<h3 className="input-header">
								How much time do you have?
								<span className="subtext">{`${Math.floor(time / 60)}h ${
									time % 60
								}min`}</span>
							</h3>
							<ClockTimePicker setTime={setTime} />
						</div>
						<div className="input-item cuisine">
							<h3 className="input-header">{cuisine} Cuisine</h3>

							<CuisineWorldMap onSelectCuisine={setCuisine} />
						</div>
							{!isDesktop && (
								<div className="btn">
									<img
										src={logoMobile}
										alt="Logo"
										onClick={getRecipe}
									/>
								</div>
							)}
						<div className="input-item skill">
							<h3 className="input-header">What's Your Skill Level?</h3>
							<Slider
								min={1}
								max={SKILL_LEVELS.length}
								value={skillLevel}
								setValue={setSkillLevel}
								step={1}
								valueOptions={SKILL_LEVELS.map((level) => level.name)}
							/>
							<div className="icon-bar">
								<img
									src={egg}
									alt="egg"
								/>
								<img
									src={knife}
									alt="knife"
								/>
								<img
									src={baker}
									alt="chef"
								/>
							</div>
						</div>
						<div className="input-item flavor">
							<h3 className="input-header">Feeling healthy or indulgent?</h3>
							<Slider
								min={1}
								max={FLAVOR_PREFERENCES.length}
								value={flavorPreference}
								setValue={setFlavorPreference}
								step={1}
								valueOptions={FLAVOR_PREFERENCES.map((flavor) => flavor.name)}
							/>
							<div className="icon-bar">
								<img
									src={salad}
									alt="salad"
								/>
								<img
									src={meal}
									alt="meal"
								/>
								<img
									src={pizza}
									alt="pizza"
								/>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
}
