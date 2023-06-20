import React, { useContext, useState } from 'react';
import './Header.css';
import RecipeForm from '../../pages/RecipeForm/RecipeForm';
import Landing from '../../pages/Landing/Landing';
import Index from '../../pages/Index/Index';
import Search from '../../pages/Search/Search';
import ShoppingList from '../../pages/ShoppingList/ShoppingList';
import { PageNavContext } from '../../context';

const Header = () => {
	const [sideBarStatus, setSideBarStatus] = useState(false);
	const { currentPage, setCurrentPage } = useContext(PageNavContext);

	function toggleSideBar() {
		setSideBarStatus(sideBarStatus => sideBarStatus = !sideBarStatus);
	}

	function handleNav(e) {
		switch (e.target.value) {
			case 0:
				setCurrentPage(<Index />);
				break;
			case 1:
				setCurrentPage(<Search query="" />);
				break;
			case 2:
				setCurrentPage(<RecipeForm />);
				break;
			case 3:
				setCurrentPage(<ShoppingList />);
				break;
			case 4:
				setCurrentPage(<Landing />);
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