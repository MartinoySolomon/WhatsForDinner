import "./Error.css";
import errorIcon from "../../assets/error.png";

export default function ErrorComponent() {
	return (
		<>
			<div className="error">
				<h2>Oooops!</h2>
				<p>
					An unexpected error occurred.
					<br />
					Please try again.
				</p>
				<img
					src={errorIcon}
					alt="error"
				/>
			</div>
		</>
	);
}
