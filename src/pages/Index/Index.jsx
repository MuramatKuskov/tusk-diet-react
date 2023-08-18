import React from 'react';
import './Index.css';
import SearchBar from '../../components/SearchBar/SearchBar';
import Tiles from '../../components/Tiles/Tiles';

const Index = (props) => {
	return (
		<div className='page page-main'>
			<SearchBar placeholder='Найти рецепт...' />
			<Tiles setCurrentPage={props.setCurrentPage} />
		</div>
	);
};

export default Index;