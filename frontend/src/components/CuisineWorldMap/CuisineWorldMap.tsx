import { WorldMap } from "react-svg-worldmap";
import { CUISINE_COUNTRY_CODES } from "../../utils/cuisineCountryCodes";
import "./CuisineWorldMap.css";
import { useContext } from "react";
import WindowContext from "../../context/WindowContext";
const data = CUISINE_COUNTRY_CODES.map(({ country, cuisine }) => ({
	country,
	value: 1,
	cuisine,
}));

export default function CuisineWorldMap({
	onSelectCuisine,
}: {
	onSelectCuisine?: (cuisine: string) => void;
}) {
	// Only allow selection for countries in our list
	const allowedCountries = new Set(CUISINE_COUNTRY_CODES.map((c) => c.country));
	const isDesktop = useContext(WindowContext);
	function handleCountryClick(event: { countryCode: string }) {
		const countryCode = event.countryCode;
		const cuisineObj = CUISINE_COUNTRY_CODES.find(
			(c) => c.country === countryCode
		);
		if (cuisineObj && onSelectCuisine) {
			onSelectCuisine(cuisineObj.cuisine);
		}
	}

	return (
		<>
			<WorldMap
				size={isDesktop ? "lg" : "sm"}
				data={data}
				onClickFunction={handleCountryClick}
				styleFunction={({ countryCode }) => ({
					fill: allowedCountries.has(countryCode)
						? "var(--primary-color)"
						: "var(--primary-color)",
					cursor: allowedCountries.has(countryCode) ? "pointer" : "not-allowed",
					opacity: allowedCountries.has(countryCode) ? 1 : 0.3,
				})}
				tooltipTextFunction={() => ""}
			/>
		</>
	);
}
