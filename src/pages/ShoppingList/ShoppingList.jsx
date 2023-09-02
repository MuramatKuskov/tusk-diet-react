import React, { useContext, useEffect } from 'react';
import './ShoppingList.css';
import { ShoppingListContext } from '../../context';
import { useTelegram } from '../../hooks/useTelegram';
import { useFetching } from '../../hooks/useFetching';
import Loader from '../../UI/Loader/Loader';

const ShoppingList = () => {
	const { shoppingList, setShoppingList } = useContext(ShoppingListContext);
	const { tg, queryId } = useTelegram();

	const [sendListMessage, isSendingListMessage, sendingError] = useFetching(async () => {
		await fetch(process.env.REACT_APP_backURL + "/sendListMsg", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ queryId, shoppingList }) // queryID работает только из Телеграма
		})
			.then(res => {
				handleResponse(res);
			});
	});

	useEffect(() => {
		if (shoppingList.length) {
			tg.MainButton.show();
			tg.MainButton.setParams({
				text: 'Сохранить в чат с ботом'
			})
		}
		return () => tg.MainButton.hide();
	}, [])

	useEffect(() => {
		tg.onEvent('mainButtonClicked', sendListMessage)
		return () => {
			tg.offEvent('mainButtonClicked', sendListMessage)
		}
	}, [sendListMessage]);

	function removeFromList(e) {
		const index = e.target.dataset.index;
		setShoppingList(prev => [
			...prev.filter(el => el.name != shoppingList[index].name)
		]);
	}

	function handleResponse(res) {
		if (res.status === 200) {
			tg.showPopup({ title: "Успех", message: "Список покупок сохранен" })
		} else {
			tg.showPopup({ title: "Ошибка", message: res.status + ": " + res.message })
		}
	}

	return (
		<div className='page page-shopping shopping'>
			<h2 className="shopping-title title">Список покупок</h2>
			<ol className="shopping-list">
				{shoppingList.map((el, i) => {
					return (
						<li className={`shopping-item ${el.strikethrough ? "strikethrough" : ""}`} key={i}>
							<p className="shopping-info">{`${el.name} ${el.quantity || ""} ${el.unit || ""}`}</p>
							<div className="shopping-actions">
								<img className="action action-turned" onClick={e => removeFromList(e)} data-index={i} src="assets/plus-ico.svg" alt="добавить в список покупок" />
								<img className="action" onClick={() => el.strikethrough = !el.strikethrough} src="assets/check-ico.svg" alt="зачеркнуть" />
							</div>
						</li>
					)
				})}
			</ol>
			{isSendingListMessage && <Loader />}
			{sendingError && tg.showPopup({ title: "Ошибка", message: sendingError })}
		</div>
	);
};

export default ShoppingList;