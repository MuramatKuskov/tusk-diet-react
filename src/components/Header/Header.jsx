import React, { useContext } from 'react';
import './Header.css';
import RecipeForm from '../../pages/RecipeForm/RecipeForm';
import Index from '../../pages/Index/Index';
import Search from '../../pages/Search/Search';
import User from '../../pages/Profile/User';
import ShoppingList from '../../pages/ShoppingList/ShoppingList';
import { PageNavContext } from '../../context';


const Header = () => {
	const { currentPage, setCurrentPage } = useContext(PageNavContext);

	return (
		<>
			<header className='header'>
				<div className="header-row">
					<h1 className='covering'>Рацион Бивня</h1>
					<div className="header-user">
						<img onClick={() => setCurrentPage(<ShoppingList />)} src="assets/shopping-cart.svg" alt="список покупок" className="ico-btn" />
						{/* <img onClick={() => setCurrentPage(<User />)} src="assets/person.svg" alt="профиль" className="ico-btn" /> */}
					</div>
					{/* <img onClick={() => setCurrentPage(<User />)} src="assets/person.svg" alt="профиль" className="ico-btn" /> */}
				</div>
			</header>
			<nav className="navbar">
				<div className="navbar-item" onClick={() => setCurrentPage(<Index />)}>Главная</div>
				<div className="navbar-item" onClick={() => setCurrentPage(<Search />)}>Найти рецепт</div>
				<div className="navbar-item" onClick={() => setCurrentPage(<RecipeForm />)}>Добавить рецепт</div>
			</nav>
		</>
	);
};

export default Header;