import React from 'react';
import './Button.css';

const Button = ({ type, callback, children }) => {
	let className = "button";
	if (type === "light") className = className + " button-light";
	return <button className={className} type='button' onClick={callback}>{children}</button>
};

export default Button;