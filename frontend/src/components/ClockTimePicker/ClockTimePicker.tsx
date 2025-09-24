import { useState, useEffect, useContext } from "react";
import "./ClockTimePicker.css";
import WindowContext from "../../context/WindowContext";
export default function ClockTimePicker({
	setTime,
}: {
	setTime: (time: number) => void;
}) {
	const isDesktop = useContext(WindowContext);
	const [angle, setAngle] = useState(0);
	const radius = isDesktop ? 100 : 50;
	const center = { x: 65, y: 65 };

	const handleDrag = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left - center.x;
		const y = e.clientY - rect.top - center.y;
		const theta = Math.atan2(y, x);
		let deg = (theta * 180) / Math.PI;
		deg = (deg + 450) % 360; // normalize angle (0 at top)
		setAngle(deg);
	};

	// Map angle to time (12 hours)
	const totalMinutes = Math.round((angle / 360) * 12 * 60);
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	useEffect(() => {
		setTime(hours * 60 + minutes);
	}, [hours, minutes]);
	// Calculate hand position
	const handLength = radius - 20;
	const rad = (angle * Math.PI) / 180;
	const handX = center.x + handLength * Math.sin(rad);
	const handY = center.y - handLength * Math.cos(rad);

	return (
		<div className="clock-time-picker">
			<svg
				onMouseMove={(e) => e.buttons === 1 && handleDrag(e)}
				onMouseDown={handleDrag}>
				{/* Clock face */}
				<circle
					cx={center.x}
					cy={center.y}
					r={radius}
					stroke="var(--grey-color)"
					strokeWidth={isDesktop ? 5 : 2}
					fill="var(--secondary-color)"
				/>

				{/* Hour markers */}
				{[...Array(12)].map((_, i) => {
					const angle = (i / 12) * 2 * Math.PI;
					const x1 = center.x + (radius - 10) * Math.sin(angle);
					const y1 = center.y - (radius - 10) * Math.cos(angle);
					const x2 = center.x + radius * Math.sin(angle);
					const y2 = center.y - radius * Math.cos(angle);
					return (
						<line
							key={i}
							x1={x1}
							y1={y1}
							x2={x2}
							y2={y2}
							stroke="black"
							strokeWidth={isDesktop ? 4 : 1}
						/>
					);
				})}

				{/* Clock hand */}
				<line
					x1={center.x}
					y1={center.y}
					x2={handX}
					y2={handY}
					stroke="var(--text-color)"
					strokeWidth={isDesktop ? 10 : 5}
					strokeLinecap="round"
				/>

				{/* Center dot */}
				<circle
					cx={center.x}
					cy={center.y}
					r={isDesktop ? 8 : 4}
					fill="black"
				/>
			</svg>
		</div>
	);
}
