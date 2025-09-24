import { createContext } from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";
const WindowContext = createContext<boolean | undefined>(undefined);
export default WindowContext;
export function WindowProvider({ children }: { children: React.ReactNode }) {
	const { width } = useWindowDimensions();
	const isDesktop = width >= 768;

	return (
		<WindowContext.Provider value={isDesktop}>
			{children}
		</WindowContext.Provider>
	);
}
