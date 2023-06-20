import React, { useEffect, useState } from 'react';
import './SearchBar.css';

const SearcBar = (props) => {
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		// doSmth
	}, [searchQuery])

	function handleInput(e) {
		setSearchQuery(e.target.value);
	}

	return (
		<input className='searchbar' type="search" name="src" id="src" onInput={handleInput} placeholder='Найти рецепт...' />
	);
};

export default SearcBar;