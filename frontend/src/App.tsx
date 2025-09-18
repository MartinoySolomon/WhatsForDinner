import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import Home from "./screens/Home/Home";
import Result from "./screens/Result/Result";
import Recipe from "./screens/Recipe/Recipe";

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={<Home />}
					/>
					<Route
						path="/result"
						element={<Result />}
					/>
					<Route
						path="/recipe"
						element={<Recipe />}
					/>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
