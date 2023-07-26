import React, { useContext, useEffect, useRef } from 'react';
import './Tiles.css';
import Search from '../../pages/Search/Search';
import { PageNavContext } from '../../context';
import 'swiper/css/bundle';

const types = [
	{ data: 'breakfast', label: 'Завтрак', src: 'https://images.pexels.com/photos/3850660/pexels-photo-3850660.jpeg', },
	{ data: 'main', label: 'Основное', src: 'https://images.pexels.com/photos/3789885/pexels-photo-3789885.jpeg', },
	{ data: 'garnish', label: 'Гарнир', src: 'https://cdn.pixabay.com/photo/2018/03/31/19/29/schnitzel-3279045_1280.jpg', },
	{ data: 'soup', label: 'Суп', src: 'https://images.pexels.com/photos/688802/pexels-photo-688802.jpeg?auto=compress&cs=tinysrgb&w=600', },
	{ data: 'snack', label: 'Закуска', src: 'https://www.shutterstock.com/image-photo/large-beer-plate-set-snacks-600w-1972933841.jpg', },
	{ data: 'salad', label: 'Салат', src: 'https://www.shutterstock.com/image-photo/salad-chicken-mozzarella-cherry-tomatoes-260nw-331385072.jpg', },
	{ data: 'bakery', label: 'Выпечка', src: 'https://www.shutterstock.com/image-photo/close-hands-taking-out-baking-260nw-1843239742.jpg', },
	{ data: 'dessert', label: 'Десерт', src: 'https://www.shutterstock.com/image-photo/homemade-cheesecake-fresh-berries-mint-260nw-468681005.jpg', },
	{ data: 'drink', label: 'Напиток', src: 'https://www.shutterstock.com/image-photo/summer-refreshing-lemonade-drink-alcoholic-260nw-2122824932.jpg', },
	{ data: 'sauce', label: 'Соус', src: 'https://www.shutterstock.com/image-photo/set-sauces-ketchup-mayonnaise-mustard-260nw-1199643253.jpg', },
	{ data: 'other', label: 'Другое', src: 'https://www.shutterstock.com/image-photo/christmas-charcuterie-table-scene-against-260nw-2219908957.jpg', }
]

const Tiles = () => {
	const { currentPage, setCurrentPage } = useContext(PageNavContext);
	const swiperRef = useRef(null);

	useEffect(() => {
		const params = {
			injectStyles: [`.swiper-horizontal {padding-bottom: 20px}`],
			grid: {
				rows: 2,
				fill: 'row'
			},
			pagination: true,
			breakpoints: {
				320: {
					slidesPerView: 2,
					spaceBetween: 20
				},
				375: {
					slidesPerView: 2,
				},
				425: {
					slidesPerView: 2,
					spaceBetween: 30,
				},
				769: {
					slidesPerView: 3,
					spaceBetween: 30,
					grabCursor: true,
				},
				1024: {
					slidesPerView: 4,
					spaceBetween: 30,
					grabCursor: true
				}
			}
		};
		Object.assign(swiperRef.current, params);
		swiperRef.current.initialize();
	}, [])

	const handleClick = e => {
		setCurrentPage(<Search query={{ type: e.target.getAttribute('data') }} />)
	}

	return (
		<div className="tiles">
			<swiper-container init="false" ref={swiperRef}>
				{types.map((el, index) => {
					return (
						<swiper-slide>
							<div onClick={handleClick} data={el.data} className="tiles-item" key={index}>
								<p className="tiles-label">{el.label}</p>
								<img className='tiles-img' src={el.src} alt={el.label} loading='lazy' />
							</div>
						</swiper-slide>
					)
				})}
			</swiper-container>
		</div>
	);
};

/* <div className='tiles'>	// оболочка карусели
				{types.map((el, index) => {
					return (
						// слайды
						<div onClick={handleClick} data={el.data} className="tiles-item" key={index}>
						<p className="tiles-label">{el.label}</p>
						<img className='tiles-img' src={el.src} alt={el.label} loading='lazy' />
					</div>
					)
				})}
			</div> */

export default Tiles;