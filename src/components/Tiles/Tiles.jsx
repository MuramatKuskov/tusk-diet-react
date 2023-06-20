import React, { useContext } from 'react';
import './Tiles.css';
import Search from '../../pages/Search/Search';
import { PageNavContext } from '../../context';

const Tiles = () => {
	const { currentPage, setCurrentPage } = useContext(PageNavContext);

	const handleClick = e => {
		setCurrentPage(<Search query={`type=${e.target.getAttribute('data')}`} />)
	}

	return (
		<div className='tiles'>
			<div onClick={handleClick} data='breakfast' className="tiles-item">
				<p className="tiles-label">Завтраки</p>
				<img className='tiles-img' src='https://images.pexels.com/photos/3850660/pexels-photo-3850660.jpeg' alt='Завтраки' />
			</div>
			<div onClick={handleClick} data='main' className="tiles-item">
				<p className="tiles-label">Основные блюда</p>
				<img className='tiles-img' src='https://images.pexels.com/photos/3789885/pexels-photo-3789885.jpeg' alt='Основные блюда' />
			</div>
			<div onClick={handleClick} data='garnish' className="tiles-item">
				<p className="tiles-label">Гарниры</p>
				<img className='tiles-img' src='https://cdn.pixabay.com/photo/2018/03/31/19/29/schnitzel-3279045_1280.jpg' alt='Гарниры' />
			</div>
			<div onClick={handleClick} data='soup' className="tiles-item">
				<p className="tiles-label">Супы</p>
				<img className='tiles-img' src='https://images.pexels.com/photos/688802/pexels-photo-688802.jpeg?auto=compress&cs=tinysrgb&w=600' alt='Супы' />
			</div>
			<div onClick={handleClick} data='snack' className="tiles-item">
				<p className="tiles-label">Закуски</p>
				<img className='tiles-img' src='' alt='Закуски' />
			</div>
			<div onClick={handleClick} data='salad' className="tiles-item">
				<p className="tiles-label">Салаты</p>
				<img className='tiles-img' src='' alt='Салаты' />
			</div>
			<div onClick={handleClick} data='bakery' className="tiles-item">
				<p className="tiles-label">Выпечка</p>
				<img className='tiles-img' src='' alt='Выпечка' />
			</div>
			<div onClick={handleClick} data='dessert' className="tiles-item">
				<p className="tiles-label">Десерт</p>
				<img className='tiles-img' src='' alt='Десерт' />
			</div>
			<div onClick={handleClick} data='drink' className="tiles-item">
				<p className="tiles-label">Напиток</p>
				<img className='tiles-img' src='' alt='Напиток' />
			</div>
			<div onClick={handleClick} data='sauce' className="tiles-item">
				<p className="tiles-label">Соус</p>
				<img className='tiles-img' src='' alt='Соус' />
			</div>
			<div onClick={handleClick} data='other' className="tiles-item">
				<p className="tiles-label">Другое</p>
				<img className='tiles-img' src='' alt='Другое' />
			</div>
		</div>
	);
};

export default Tiles;