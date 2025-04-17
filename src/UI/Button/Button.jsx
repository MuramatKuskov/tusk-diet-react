import React from 'react';
import './Button.css';

const Button = ({ callback, text, type }) => {
	let className = "button";
	if (type === "light") className = className + " button-light";
	return <button className={className} type='button' onClick={callback}>{text}</button>
};

export default Button;