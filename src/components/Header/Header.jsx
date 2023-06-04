import React, { useEffect, useState } from 'react';
import './Header.css';
import RecipeForm from '../../pages/RecipeForm/RecipeForm';
import Landing from '../../pages/Landing/Landing';
import Index from '../../pages/Index/Index';
import Search from '../../pages/Search/Search';
import ShoppingList from '../../pages/ShoppingList/ShoppingList';

const Header = (props) => {
	const [sideBarStatus, setSideBarStatus] = useState(false);

	function toggleSideBar() {
		setSideBarStatus(sideBarStatus => sideBarStatus = !sideBarStatus);
	}

	function handleNav(e) {
		switch (e.target.value) {
			case 0:
				props.setCurrentPage(<Index />);
				break;
			case 1:
				props.setCurrentPage(<Search />);
				break;
			case 2:
				props.setCurrentPage(<RecipeForm />);
				break;
			case 3:
				props.setCurrentPage(<ShoppingList />);
				break;
			case 4:
				props.setCurrentPage(<Landing />);
				break;
		}
		toggleSideBar();
	}

	return (
		<header className='header'>
			<h1 className='covering'>Рацион Бивня</h1>
			<div className='burger' onClick={toggleSideBar}>
				<div className="burger-line"></div>
				<div className="burger-line"></div>
				<div className="burger-line"></div>
			</div>
			<div className={['sidebar', sideBarStatus === true ? 'sidebar-active' : ''].join(' ')}>
				<div className="sidebar-close" onClick={toggleSideBar}>
					<div className="sidebar-close-line"></div>
					<div className="sidebar-close-line"></div>
				</div>
				<ol className="sidebar-list">
					<li className="sidebar-link" onClick={handleNav} value={0}>Главная</li>
					<li className="sidebar-link" onClick={handleNav} value={1}>Поиск рецептов</li>
					<li className="sidebar-link" onClick={handleNav} value={2}>Добавить рецепт</li>
					<li className="sidebar-link" onClick={handleNav} value={3}>Список покупок</li>
					<li className="sidebar-link" onClick={handleNav} value={4}>Описание</li>
				</ol>
			</div>
		</header>
	);
};

export default Header;