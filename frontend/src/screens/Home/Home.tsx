import "./Home.css";
import logo from "../../assets/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRecipe } from "../../api/recipeApi";
import { fetchImage } from "../../api/imageApi";
import useRecipe from "../../hooks/useRecipe";
import Slider from "../../components/Slider/Slider";
import Loader from "../../components/Loader/Loader";
import {
	SKILL_LEVELS,
	FLAVOR_PREFERENCES,
	CUISINES,
} from "../../utils/constants";
import ClockTimePicker from "../../components/ClockTimePicker/ClockTimePicker";
import CuisineWorldMap from "../../components/CuisineWorldMap/CuisineWorldMap";

export default function Home() {
	const [skillLevel, setSkillLevel] = useState(SKILL_LEVELS[0].id);
	const [flavorPreference, setFlavorPreference] = useState(
		FLAVOR_PREFERENCES[0].id
	);
	const [cuisine, setCuisine] = useState(CUISINES[0]);
	const [time, setTime] = useState(10);
	const { setRecipe, setUserInput, isLoading, setIsLoading, error, setError } =
		useRecipe();
	const navigate = useNavigate();

	const getRecipe = async () => {
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
					<div className="home-container">
						<div className="btn">
							<img
								src={logo}
								alt="Logo"
								onClick={getRecipe}
							/>
						</div>
						<div className="skill-level-input">
							<h3 className="input-header">Set Skill Level</h3>
							<Slider
								min={1}
								max={SKILL_LEVELS.length}
								value={skillLevel}
								setValue={setSkillLevel}
								step={1}
								valueOptions={SKILL_LEVELS.map((level) => level.name)}
							/>
						</div>
						<div className="flavor-input">
							<h3 className="input-header">Set Flavor Preference</h3>
							<Slider
								min={1}
								max={FLAVOR_PREFERENCES.length}
								value={flavorPreference}
								setValue={setFlavorPreference}
								step={1}
								valueOptions={FLAVOR_PREFERENCES.map((flavor) => flavor.name)}
							/>
						</div>
						<div className="cuisine-input">
							<h3 className="input-header">Set Cuisine</h3>
							<select
								value={cuisine}
								onChange={(e) => setCuisine(e.target.value)}>
								{CUISINES.map((cuisine) => (
									<option
										key={cuisine}
										value={cuisine}>
										{cuisine}
									</option>
								))}
							</select>
							<CuisineWorldMap onSelectCuisine={setCuisine} />
						</div>
						<div className="time-input">
							<h3 className="input-header">Set Preparation Time</h3>
							<ClockTimePicker setTime={setTime} />
						</div>
					</div>
				</>
			)}
		</>
	);
}
