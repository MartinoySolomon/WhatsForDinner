import React, { useState, useEffect, useRef } from "react";
import "./Timer.css";

interface TimePickerProps {
	label: string;
	value: number;
	max: number;
	onChange: (newValue: number) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({
	label,
	value,
	max,
	onChange,
}) => {
	const scrollRef = useRef<HTMLDivElement>(null);
	const itemHeight = 30; // Height of each time item

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = value * itemHeight;
		}
	}, [value]);

	const handleScroll = () => {
		if (scrollRef.current) {
			const { scrollTop } = scrollRef.current;
			const newValue = Math.round(scrollTop / itemHeight);
			if (newValue !== value) {
				onChange(newValue);
			}
		}
	};

	return (
		<div className="time-picker-container">
			<div
				className="time-picker"
				ref={scrollRef}
				onScroll={handleScroll}>
				{[...Array(max + 1).keys()].map((num) => (
					<div
						key={num}
						className={`time-item ${num === value ? "active" : ""}`}>
						{String(num).padStart(2, "0")}
					</div>
				))}
			</div>
			<span className="time-label">{label}</span>
		</div>
	);
};

interface TimerProps {
	initialHours?: number;
	initialMinutes?: number;
	initialSeconds?: number;
}

const Timer: React.FC<TimerProps> = ({
	initialHours = 0,
	initialMinutes = 0,
	initialSeconds = 0,
}) => {
	const [hours, setHours] = useState<number>(initialHours);
	const [minutes, setMinutes] = useState<number>(initialMinutes);
	const [seconds, setSeconds] = useState<number>(initialSeconds);
	const [isRunning, setIsRunning] = useState<boolean>(false);
	const [isFinished, setIsFinished] = useState<boolean>(false);
	const [totalSeconds, setTotalSeconds] = useState<number>(0);

	// Update all timer values when initial props change
	useEffect(() => {
		setHours(initialHours);
		setMinutes(initialMinutes);
		setSeconds(initialSeconds);
		if (initialHours > 0 || initialMinutes > 0 || initialSeconds > 0) {
			setTotalSeconds(
				initialHours * 3600 + initialMinutes * 60 + initialSeconds
			);
		}
	}, [initialHours, initialMinutes, initialSeconds]);

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;
		if (isRunning && totalSeconds > 0) {
			interval = setInterval(() => {
				setTotalSeconds((prevTotalSeconds) => prevTotalSeconds - 1);
			}, 1000);
		} else if (totalSeconds === 0 && isRunning) {
			setIsRunning(false);
			setIsFinished(true);
			if (interval) clearInterval(interval);
		}
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isRunning, totalSeconds]);

	useEffect(() => {
		const h = Math.floor(totalSeconds / 3600);
		const m = Math.floor((totalSeconds % 3600) / 60);
		const s = totalSeconds % 60;
		setHours(h);
		setMinutes(m);
		setSeconds(s);
	}, [totalSeconds]);

	const handleStart = () => {
		if (hours === 0 && minutes === 0 && seconds === 0) return;
		setTotalSeconds(hours * 3600 + minutes * 60 + seconds);
		setIsRunning(true);
		setIsFinished(false);
	};

	const handleReset = () => {
		setIsRunning(false);
		setIsFinished(false);
		setHours(0);
		setMinutes(0);
		setSeconds(0);
		setTotalSeconds(0);
	};

	return (
		<div className="timer">
			<div className="timer-display">
				{isRunning || isFinished ? (
					<div className="countdown">
						<span className="countdown-item">
							{String(hours).padStart(2, "0")}:
						</span>
						<span className="countdown-item">
							{String(minutes).padStart(2, "0")}:
						</span>
						<span className="countdown-item">
							{String(seconds).padStart(2, "0")}
						</span>
					</div>
				) : (
					<div className="time-pickers">
						<TimePicker
							label="Hours"
							value={hours}
							max={23}
							onChange={setHours}
						/>
						<span className="colon">:</span>
						<TimePicker
							label="Minutes"
							value={minutes}
							max={59}
							onChange={setMinutes}
						/>
						<span className="colon">:</span>
						<TimePicker
							label="Seconds"
							value={seconds}
							max={59}
							onChange={setSeconds}
						/>
					</div>
				)}
			</div>
			<div className="controls">
				<button
					className="button"
					onClick={isRunning ? () => setIsRunning(false) : handleStart}>
					{isRunning ? "Pause" : "Start"}
				</button>
				<button
					className="button"
					onClick={handleReset}>
					Reset
				</button>
			</div>
			{isFinished && <div className="finished-message">Time's up!</div>}
		</div>
	);

};

export default Timer;
