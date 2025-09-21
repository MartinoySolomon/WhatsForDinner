// import React from "react";
import { WorldMap } from "react-svg-worldmap";
import { CUISINE_COUNTRY_CODES } from "../../utils/cuisineCountryCodes";

// Prepare data for react-svg-worldmap
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
		<div style={{ maxWidth: 600, margin: "0 auto" }}>
			<WorldMap
				color="#dfb475ff"
				valueSuffix=""
				size="responsive"
				data={data}
				onClickFunction={handleCountryClick}
				styleFunction={({ countryCode }) => ({
					fill: allowedCountries.has(countryCode) ? "#b39b77ff" : "#323da0ff",
					cursor: allowedCountries.has(countryCode) ? "pointer" : "not-allowed",
					opacity: allowedCountries.has(countryCode) ? 1 : 0.3,
				})}
				tooltipTextFunction={({ countryCode }) => {
					const cuisineObj = CUISINE_COUNTRY_CODES.find(
						(c) => c.country === countryCode
					);
					return cuisineObj ? cuisineObj.cuisine : "";
				}}
			/>
		</div>
	);
}
