import React from 'react';
import './PopUp.css';

const PopUp = (props) => {
	return (
		<div className='popup-wrapper'>
			<div className="popup-body" onClick={props.callback}>
				<p className="popup-text">{props.text}</p>
			</div>
		</div>
	);
};

export default PopUp;