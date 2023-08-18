import React from 'react';
import './Button.css';

const Button = ({ callback, children }) => {
	return <button className='button' type='button' onClick={callback}>{children}</button>
};

export default Button;