import React, { useEffect } from 'react';
import './Index.css';
import { useTelegram } from '../../hooks/useTelegram';
import SearchBar from '../../components/SearchBar/SearchBar';
import Tiles from '../../components/Tiles/Tiles';

const Index = (props) => {
	const { tg, queryId } = useTelegram();

	useEffect(() => {
		tg.ready();
	}, []);

	return (
		<div className='page page-main'>
			<SearchBar />
			<Tiles setCurrentPage={props.setCurrentPage} />
		</div>
	);
};

export default Index;