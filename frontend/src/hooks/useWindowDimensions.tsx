import { useEffect, useState } from "react";

export default function useWindowDimensions() {
	const [windowDimensions, setWindowDimensions] = useState({
		width: window.innerWidth,
	});

	useEffect(() => {
		function handleResize() {
			setWindowDimensions({
				width: window.innerWidth,
			});
		}
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	return windowDimensions;
}
