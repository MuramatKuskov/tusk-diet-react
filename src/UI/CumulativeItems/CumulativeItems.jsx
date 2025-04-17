import React, { useEffect, useState } from 'react';
import './CumulativeItems.css';


const Item = ({ text, index, actions }) => {
	const requestInput = event => {
		const addBtn = event.target.parentNode;
		const item = addBtn.parentNode;
		const input = item.querySelector('.cumulative-input');
		const removeBtn = item.querySelector('.cumulative-remove');

		addBtn.style.display = "none";
		removeBtn.style.display = "block";
		input.style.width = "2em";
		input.focus();
	};

	const handleInput = event => {
		event.preventDefault();
		event.target.style.width = `${event.target.value.length}ch`;
	}

	const handleInputBlur = event => {
		event.preventDefault();
		if (event.target.value.length < 3) return rejectInput(event);
		applyInput(event);
	}

	const handleDecline = (event, text, index) => {
		if (!text) return rejectInput(event);
		actions.removeItem(index);
	}

	const applyInput = event => {
		actions.addItem(event.target.value);
		// reset input
		rejectInput(event);
	};

	const rejectInput = event => {
		const item = event.target.parentNode;
		const button = item.querySelector('.cumulative-add');
		const input = item.querySelector('.cumulative-input');
		const removeBtn = item.querySelector('.cumulative-remove');

		button.style.display = "block";
		removeBtn.style.display = "none";
		input.value = "";
		input.style.width = "0";
	}

	return (
		<div className='cumulative-item'>
			<div className='cumulative-add' style={text?.length ? { display: "none" } : { display: "block" }}>
				<img src='/assets/plus.svg' onClick={requestInput} alt='add' />
			</div>

			<input
				className='cumulative-input'
				defaultValue={text}
				type='text'
				name='itemValue'
				onChange={handleInput}
				onBlur={handleInputBlur}
				style={text?.length ? { width: `${text.length}ch` } : { width: "0" }}
				disabled={text?.length ? true : false}
			/>

			<div className='cumulative-remove' onClick={event => handleDecline(event, text, index)} style={text?.length ? { display: "block" } : { display: "none" }}>
				<img src="/assets/cross.svg" alt="remove" />
			</div>
		</div>
	);
}

const CumulativeItems = (props) => {
	const { items, actions } = props;

	return (
		<div className='cumulative-items'>
			{!items?.length || items.map((item, index) => {
				return <Item text={item} index={index} actions={actions} key={index} />
			})}
			<Item text="" actions={actions} />
		</div>
	);
};

export default CumulativeItems;