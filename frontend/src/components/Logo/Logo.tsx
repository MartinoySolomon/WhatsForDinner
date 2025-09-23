import "./Logo.css";
import logo from "../../assets/logo3.png";
import { useNavigate } from "react-router-dom";

export default function Logo() {
	const navigate = useNavigate();
	return (
		<img
			src={logo}
			alt="Logo"
			className="logo"
			onClick={() => {
				navigate("/");
			}}
		/>
	);
}
