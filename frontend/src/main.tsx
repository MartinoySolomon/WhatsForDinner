import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { RecipeProvider } from "./context/RecipeContext.tsx";
import { WindowProvider } from "./context/WindowContext.tsx";

createRoot(document.getElementById("root")!).render(
	<WindowProvider>
		<RecipeProvider>
			<App />
		</RecipeProvider>
	</WindowProvider>
);
