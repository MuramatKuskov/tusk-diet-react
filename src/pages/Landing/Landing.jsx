import React, { useContext } from 'react';
import './Landing.css';
import Index from '../Index/Index';
import { PageNavContext } from '../../context';
import Button from '../../UI/Button/Button';

const Landing = (props) => {
	const { currentPage, setCurrentPage } = useContext(PageNavContext);

	function handleClick() {
		setCurrentPage(<Index />);
	}

	return (
		<div className='page page-landing'>
			<article className="intro">
				<h2 className="greeting">Добро пожаловать в "Рацион Бивня", бродяга!</h2>
				<p className="description">Тут мы встречаемся с рецептами, как братья на
					дороге. Если ты хочешь быстро найти рецепты, добавить новые или выяснить,
					что можно сварганить из имеющихся ингредиентов, бот быстро накидает тебе
					пару вариантов.</p>
				<p className="description">И не думай, что функционал бота на этом
					закончился. У него есть еще дополнительные фишки, типа подсчета калорий.
					Будешь знать, сколько калорий в твоем хрючеве, чтобы не загнулся со спорта.</p>
				<p className="description">И помни, Брат, "Рацион Бивня" составит для
					тебя список покупок, чтобы ты мог гордо взять свою корзину и собрать все
					нужное в магазе, не потеряв по дороге что-нибудь важное для своего
					протеинового коктейля (или бананового смузи). Будь настоящим хозяином
					своей кухни и владыкой своего рациона!</p>
			</article>
			<Button callback={handleClick}>Понятно</Button>
		</div>
	);
};

export default Landing;