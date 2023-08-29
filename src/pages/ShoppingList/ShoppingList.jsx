import React, { useContext, useEffect, useState } from 'react';
import './ShoppingList.css';
import { ShoppingListContext } from '../../context';
import Button from '../../UI/Button/Button';
import { useTelegram } from '../../hooks/useTelegram';

const ShoppingList = () => {
	const { shoppingList, setShoppingList } = useContext(ShoppingListContext);
	const [strikethroughIndexes, setStrikethroughIndexes] = useState([]);
	const { tg } = useTelegram();

	useEffect(() => {
		if (sessionStorage.getItem("strikethrough") != null && sessionStorage.getItem("strikethrough") != "undefined" && sessionStorage.getItem("strikethrough") !== "") {
			setStrikethroughIndexes(sessionStorage.getItem("strikethrough").split(","))
		}
	}, [])

	useEffect(() => {
		sessionStorage.setItem("strikethrough", strikethroughIndexes);
	}, [strikethroughIndexes])

	function removeFromList(e) {
		const index = e.target.dataset.index;
		setShoppingList(prev => [
			...prev.filter(el => el.name != shoppingList[index].name)
		]);
	}

	function handleStrikethrough(e) {
		e.target.parentNode.parentNode.classList.toggle("strikethrough");
		setStrikethroughIndexes(prev =>
			[...prev].includes(e.target.dataset.index) ?
				[...prev].filter(el => el != e.target.dataset.index)
				:
				[...prev, e.target.dataset.index].sort((a, b) => a - b)
		)
	}

	return (
		<div className='page page-shopping shopping'>
			<h2 className="shopping-title title">Список покупок</h2>
			<mark className="shopping-attention">Список покупок хранится только во время текущей сессии.
				Кнопка ниже отправит список в чат с ботом.</mark>
			<ol className="shopping-list">
				{shoppingList.map((el, i) => {
					return (
						<li className={`shopping-item ${strikethroughIndexes.includes(i.toString()) ? "strikethrough" : ""}`} key={i}>
							<p className="shopping-info">{`${el.name} ${el.quantity || ""} ${el.unit || ""}`}</p>
							<div className="shopping-actions">
								<img className="action action-turned" onClick={e => removeFromList(e)} data-index={i} src="assets/plus-ico.svg" alt="добавить в список покупок" />
								<img className="action" onClick={e => handleStrikethrough(e)} data-index={i} src="assets/check-ico.svg" alt="зачеркнуть" />
							</div>
						</li>
					)
				})}
			</ol>
			<Button callback={() => tg.sendData(shoppingList)}>Сохранить список в чат</Button>
		</div>
	);
};

export default ShoppingList;