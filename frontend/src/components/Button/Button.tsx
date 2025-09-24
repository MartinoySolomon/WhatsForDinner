import "./Button.css";
import { useNavigate } from "react-router-dom";
export default function Button({ path }: { path: string }) {
	const navigate = useNavigate();
	return (
		<>
			<div
				className="back-btn"
				onClick={() => navigate(path)}>
				<h1>&larr;</h1>
			</div>
		</>
	);
}
