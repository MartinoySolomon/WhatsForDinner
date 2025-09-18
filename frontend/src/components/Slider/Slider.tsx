import "./Slider.css";

export default function Slider({
	min,
	max,
	step,
	value,
    setValue,
	valueOptions,
}: {
	min: number;
	max: number;
	step: number;
	value: number;
    setValue: (value:number) => void;
	valueOptions: string[];
}) {
	return (
		<>
			<div className="slider-container">
				<div className="slider-input">
					<input
						type="range"
						min={min}
						max={max}
						step={step}
						value={value}
						onChange={(e) => setValue(Number(e.target.value))}
					/>
				</div>
				{valueOptions && (
					<div className="slider-labels">
						{valueOptions.map((option, index) => (
							<span key={valueOptions[index]}>{option}</span>
						))}
					</div>
				)}
			</div>
		</>
	);
}
