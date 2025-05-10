import React, { useEffect, useState } from 'react';
import './ShoppingList.css';
import { useFetching } from '../../hooks/useFetching';
import Loader from '../../UI/Loader/Loader';
import Button from '../../UI/Button/Button';

const tg = window.Telegram.WebApp;

const IngredientInput = ({ ingredient = '', initialQuantity = 0, initialUnit = '', addToList, removeFromList, moveToStorage, removeFromStorage, deferredUpdateTimeout, setDeferredUpdateTimeout, pushUpdates }) => {
	const [name, setName] = useState(ingredient);
	const [quantity, setQuantity] = useState(initialQuantity);
	const [unit, setUnit] = useState(initialUnit);
	const [debounceTimer, setDebounceTimer] = useState(null);

	function handleInput(setOwnState, event) {
		setOwnState(event.target.value);

		// abort pushing updates on input
		// push updates after 15 sec of inactivity
		if (deferredUpdateTimeout) {
			clearTimeout(deferredUpdateTimeout);
			setDeferredUpdateTimeout(setTimeout(pushUpdates, 15000));
		}

		let name, quantity, unit;

		if (event.target.classList.contains('shopping-name')) {
			name = event.target.value;
			quantity = event.target.parentNode.querySelector('.shopping-quantity').value;
			unit = event.target.parentNode.querySelector('.shopping-unit').value;
		} else if (event.target.classList.contains('shopping-quantity')) {
			name = event.target.parentNode.parentNode.querySelector('.shopping-name').value;
			quantity = event.target.value;
			unit = event.target.parentNode.querySelector('.shopping-unit').value;
		} else if (event.target.classList.contains('shopping-unit')) {
			name = event.target.parentNode.parentNode.querySelector('.shopping-name').value;
			quantity = event.target.parentNode.querySelector('.shopping-quantity').value;
			unit = event.target.value;
		}

		quantity = parseFloat(quantity);

		if (name.length < 3 || !quantity || !unit) return;

		// normalize name
		name = name.trim().toLowerCase();

		if (debounceTimer) clearTimeout(debounceTimer);

		// add to list after lil debounce
		const debounceAdding = () => {
			addToList({ name, quantity, unit });
			clearInput();
		}
		setDebounceTimer(setTimeout(debounceAdding, 700));
	}

	function clearInput() {
		setName('');
		setQuantity(0);
		setUnit('');
	}

	return (
		<li className='shopping-item' id='shopping-new'>
			<div className="shopping-info">
				{/* <input className="shopping-name" type="text" placeholder="Добавить продукт" value={name} onChange={e => setName(e.target.value)} /> */}
				<input className="shopping-name" type="text" placeholder="Добавить продукт" value={name} onChange={e => handleInput(setName, e)} />
				<div className="shopping-measures">
					{/* <input className="shopping-quantity" type="number" min="0" max="1000" step="0.5" name="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} /> */}
					<input className="shopping-quantity" type="number" min="0" max="1000" step="0.5" name="quantity" value={quantity} onChange={e => handleInput(setQuantity, e)} />
					{/* <select className="shopping-unit" name="unit" value={unit} onChange={e => setUnit(e.target.value)}> */}
					<select className="shopping-unit" name="unit" value={unit} onChange={e => handleInput(setUnit, e)}>
						<option value="" disabled>ед</option>
						<option value="шт">шт</option>
						<option value="кг">кг</option>
						<option value="г">г</option>
						<option value="л">л</option>
						<option value="мл">мл</option>
					</select>
				</div>
			</div>
			{/* optional contols by location/props? */}
			<div className="shopping-controls">
				<img className="control control-turned" onClick={clearInput} src="assets/plus-ico.svg" alt="очистить поле для ввода" />

				{!removeFromList ||
					<img className="control control-turned" onClick={() => removeFromList(i)} src="assets/plus-ico.svg" alt="убрать из списка" />
				}
				{!moveToStorage ||
					<img className="control" onClick={() => moveToStorage(i)} src="assets/check-ico.svg" alt="сохранить в мои продукты" />
				}
				{!removeFromStorage ||
					<img className="control" onClick={() => removeFromStorage(i)} src="assets/check-ico.svg" alt="убрать из списка" />
				}
			</div>
		</li>
	)
}

const ShoppingList = () => {
	const [shoppingList, setShoppingList] = useState([]);
	const [deferredUpdates, setDeferredUpdates] = useState([]);
	const [myProducts, setMyProducts] = useState([]);
	const [updateTimeout, setUpdateTimeout] = useState(null);

	const [sendListMessage, isSendingListMessage, sendingError] = useFetching(async () => {
		await fetch(process.env.REACT_APP_API_URL + "chat/sendList", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ query_id: tg.initDataUnsafe.query_id, shoppingList })
		})
			.then(res => {
				if (res.status !== 200) {
					tg.showAlert(res.status + ": " + res.message);
				}
			});
	});

	// fetch shopping list & myProducts on page mount
	useEffect(() => {
		tg.CloudStorage.getItem('shoppingList', (err, data) => {
			if (err) {
				console.log(err);
				return;
			}

			const parsedData = JSON.parse(data);
			setShoppingList(parsedData);
		});

		tg.CloudStorage.getItem('myProducts', (err, data) => {
			if (err) {
				console.log(err);
				return;
			}

			const parsedData = JSON.parse(data);
			setMyProducts(parsedData);
		});
	}, []);

	// push deferred updates after 5 sec since last upd or on dismount
	useEffect(() => {
		if (updateTimeout) clearTimeout(updateTimeout);
		setUpdateTimeout(setTimeout(pushUpdates, 5000));

		return () => {
			pushUpdates();
		};
	}, [deferredUpdates]);

	// handle tg main button appearance
	useEffect(() => {
		if (shoppingList.length) {
			tg.MainButton.setParams({
				text: 'Отправить покупки в чат с ботом'
			});
			tg.MainButton.show();
		}
		return () => tg.MainButton.hide();
	}, [shoppingList])

	// handle tg main button click
	useEffect(() => {
		tg.onEvent('mainButtonClicked', sendListMessage)
		return () => {
			tg.offEvent('mainButtonClicked', sendListMessage)
		}
	}, [sendListMessage]);

	// handle tg popup button click (clear shopping list)
	useEffect(() => {
		tg.onEvent('popupClosed', (e) => {
			if (e.button_id === "clear") {
				clearShoppingList();
			}
		});
		return () => {
			tg.offEvent('popupClosed', clearShoppingList);
		};
	}, []);

	// write deferred updates to CloudStorage & clear updates array
	function pushUpdates() {
		if (!deferredUpdates.length) return;
		console.warn("Update fired", deferredUpdates);
		deferredUpdates.forEach(({ key, value }) => {
			tg.CloudStorage.setItem(key, JSON.stringify(value), (err, result) => {
				if (err) {
					console.error(err);
					tg.showPopup({ title: "Something went wrong", message: err });
					return;
				}
			});
		});
		setDeferredUpdates([]);
	}

	function addToList(newItem, listKey, listState, setList) {
		// vars for "onBlur" implementation
		// deprecated because of focus loss on measures input
		// const quantityInput = e.target.nextElementSibling;
		// const unitInput = e.target.nextElementSibling;
		// const { value } = e.target;

		/* // vars for "onBtnClick" implementation
		const btnContainer = e.target.parentNode;
		const itemElement = btnContainer.parentNode;
		// named destructuring
		const { value: name } = itemElement.querySelector('.shopping-name');
		const { value: quantity } = itemElement.querySelector('.shopping-quantity');
		const { value: unit } = itemElement.querySelector('.shopping-unit');

		// all fields must be filled
		if (!name || !quantity || !unit) return;

		// const newItem = { name: value, quantity: quantityInput.value, unit: unitInput.value };
		const newItem = { name, quantity, unit }; */

		let updated = false;
		const tmpList = listState.map(item => {
			if (item.name === newItem.name) {
				item.quantity += newItem.quantity;
				updated = true;
				return item;
			}
			return item;
		});

		if (!updated) {
			tmpList.push(newItem);
		}

		setList(tmpList);
		// async way of saving changes
		setDeferredUpdates(prevUpdates => {
			let updated = false;
			const tmp = prevUpdates.map(({ key: prevKey, velue: prevValue }) => {
				if (prevKey === listKey) {
					return { key: prevKey, value: tmpList };
				}
				return { key: prevKey, value: prevValue };
			});

			if (!updated || !tmp.length) {
				tmp.push({ key: listKey, value: tmpList });
			}

			console.warn("Deferred updates: ", tmp);

			return tmp;
		});
	}

	function removeFromList(list, listName, index, setter) {
		const filteredList = list.toSpliced(index, 1);

		// sync way of saving changes
		/* tg.CloudStorage.setItem('shoppingList', JSON.stringify(filteredList), (err, result) => {
			if (err) {
				console.log(err);
				return;
			}

			setShoppingList(filteredList);
		}); */

		// async way of saving changes
		setDeferredUpdates(prev => {
			let updated = false;
			const tmp = prev.map(({ key, value }) => {
				if (key === listName) {
					updated = true;
					// override entire array since that's how it's stored in CloudStorage
					return { key, value: filteredList };
				}
				return { key, value };
			});

			if (!updated || !tmp.length) {
				tmp.push({ key: listName, value: filteredList });
			}

			return tmp;
		});
		setter(filteredList);
	}

	function requestClearList() {
		tg.showPopup({
			title: "Подтверждение",
			message: "Очистить список?",
			buttons: [
				{ text: "Да", id: "clear", type: "destructive" },
				{ text: "Нет" }
			]
		});
	}

	function clearShoppingList() {
		tg.CloudStorage.setItem("shoppingList", '[]', (err, result) => {
			if (err) {
				tg.showPopup({ title: "Something went wrong", message: err });
				return;
			}

			setShoppingList([]);

			const updates = Object.keys(deferredUpdates);
			if (updates.includes("shoppingList") && updates.length > 1) {
				setDeferredUpdates(prev => {
					const { shoppingList, ...rest } = prev;
					return rest;
				});
			}
		});
	}

	function moveToStorage(index) {
		const item = shoppingList[index];

		// get myProducts from storage first
		// than update
		// tg.CloudStorage.getItem('myProducts', (err, data) => {
		// 	if (err) {
		// 		console.log(err);
		// 		return;
		// 	}

		// 	// parse data and add new item
		// 	const parsedData = JSON.parse(data);
		// 	const updatedList = [...parsedData, item];

		// 	// save updated list to storage
		// 	tg.CloudStorage.setItem('myProducts', JSON.stringify(updatedList), (err, result) => {
		// 		if (err) {
		// 			console.log(err);
		// 			return;
		// 		}

		// 		// remove added item from shopping list
		// 		const filteredList = shoppingList.toSpliced(index, 1);

		// 		// save updated shopping list to storage
		// 		tg.CloudStorage.setItem('shoppingList', JSON.stringify(filteredList), (err, result) => {
		// 			if (err) {
		// 				console.log(err);
		// 				return;
		// 			}

		// 			setShoppingList(filteredList);
		// 		});
		// 	});
		// });

		let foundEntry = false;
		const updatedProducts = myProducts.map(myProduct => {
			if (myProduct.name === item.name) {
				myProduct.quantity += item.quantity;
				foundEntry = true;
				return myProduct;
			}
			return myProduct;
		});

		// if no products in myProducts or no match found, add new item
		if (!foundEntry || !updatedProducts.length) {
			updatedProducts.push({ name: item.name, quantity: item.quantity, unit: item.unit });
		}

		setDeferredUpdates(prev => {
			let foundEntry = false;
			const tmp = prev.map(({ key, value }) => {
				if (key === 'myProducts') {
					foundEntry = true;
					// override entire array since that's how it's stored in CloudStorage
					return { key, value: updatedProducts };
				}
				return { key, value };
			});

			if (!foundEntry || !tmp.length) {
				tmp.push({ key: 'myProducts', value: updatedProducts });
			}

			return tmp;
		});
		setMyProducts(updatedProducts);
		removeFromList(shoppingList, "shoppingList", index, setShoppingList);
	}

	function moveListToStorage() {
		const resultingList = [...myProducts];
		shoppingList.forEach(item => {
			let correspondingItem = resultingList.find(product => product.name === item.name);
			if (correspondingItem) {
				correspondingItem.quantity += item.quantity;
			} else {
				resultingList.push({ name: item.name, quantity: item.quantity, unit: item.unit });
			}
		});
		setDeferredUpdates(prev => {
			let foundEntry = false;
			let indexToRemove = -1;
			const tmp = prev.map(({ key, value }, index) => {
				if (key === 'myProducts') {
					foundEntry = true;
					// override entire array since that's how it's stored in CloudStorage
					return { key, value: resultingList };
				} else if (key === 'shoppingList') {
					indexToRemove = index;
					return value;
				}
				return { key, value };
			});

			// remove shoppingList entry from deferred updates
			if (indexToRemove !== -1) {
				tmp.splice(indexToRemove, 1);
			}

			if (!foundEntry || !tmp.length) {
				tmp.push({ key: 'myProducts', value: resultingList });
			}

			return tmp;
		});
		setMyProducts(resultingList);
		clearShoppingList("shoppingList", setShoppingList);
	}

	const setQuantity = (event, index, list, listName, setter) => {
		if (!list.length || index >= list.length) return;

		const value = parseFloat(event.target.value);

		const updatedList = list.map((el, i) => {
			if (i === index) {
				return { ...el, quantity: value };
			}
			return el;
		});

		// sync way of saving changes
		// tg.CloudStorage.setItem('shoppingList', JSON.stringify(updatedList), (err, result) => {
		// 	if (err) {
		// 		console.log(err);
		// 		return;
		// 	}

		// 	setShoppingList(updatedList);
		// });

		// async way of saving changes
		setDeferredUpdates(prevUpdates => {
			let updated = false;
			const tmp = prevUpdates.map(({ key: updKey, value: updValue }) => {
				if (updKey === listName) {
					updated = true;
					// override entire array since that's how it's stored in CloudStorage
					return { key: updKey, value: updatedList };
				}
				return { key: updKey, value: updValue };
			});

			if (!updated || !tmp.length) {
				tmp.push({ key: listName, value: updatedList });
			}

			return tmp;
		});

		setter(updatedList);
	}

	return (
		<div className='page page-shopping shopping'>
			<h2 className="shopping-title title">Список покупок</h2>
			<ol className="shopping-list">
				{shoppingList.map((el, i) => {
					return (
						<li className="shopping-item" key={i}>
							<div className="shopping-info">
								<span className="shopping-name">{el.name.charAt(0).toUpperCase() + el.name.slice(1)}</span>
								<div className="shopping-measures">
									<input className="shopping-quantity" type="number" min="0" max="0" step="0.5" value={el.quantity} onChange={e => setQuantity(e, i, shoppingList, "shoppingList", setShoppingList)} name="quantity" />
									<span className="shopping-unit">{el.unit || ""}</span>
								</div>
							</div>
							<div className="shopping-controls">
								<img className="control" onClick={() => moveToStorage(i)} src="assets/check-ico.svg" alt="сохранить в мои продукты" />
								<img className="control control-turned" onClick={() => removeFromList(shoppingList, "shoppingList", i, setShoppingList)} src="assets/plus-ico.svg" alt="убрать из списка" />
							</div>
						</li>
					)
				})}

				<IngredientInput
					addToList={(newItem) => addToList(newItem, "shoppingList", shoppingList, setShoppingList)}
					deferredUpdateTimeout={updateTimeout} setDeferredUpdateTimeout={setUpdateTimeout}
					pushUpdates={pushUpdates}
				/>
			</ol>
			{!shoppingList.length || <div className="shopping-actions">
				<Button text="Очистить" callback={() => requestClearList("shoppingList", setShoppingList)} />
				<Button text="Сохранить в мои продукты" callback={moveListToStorage} />
			</div>}

			<div className="shopping-my_products" style={{ marginTop: "3em" }}>
				<h2 className="shopping-title title">Мои продукты</h2>
				<ol className="shopping-list">
					{!myProducts.length || myProducts.map((el, i) => {
						return (
							<li className="shopping-item" key={i}>
								<div className="shopping-info">
									<span className="shopping-name">{el.name.charAt(0).toUpperCase() + el.name.slice(1)}</span>
									<div className="shopping-measures">
										<input className="shopping-quantity" type="number" min="0" max="0" step="0.5" value={el.quantity} onChange={e => setQuantity(e, i, myProducts, "myProducts", setMyProducts)} name="quantity"></input>
										<span className="shopping-unit">{el.unit || ""}</span>
									</div>
								</div>
								<div className="shopping-controls">
									<img className="control control-turned" onClick={() => removeFromList(myProducts, "myProducts", i, setMyProducts)} src="assets/plus-ico.svg" alt="убрать из списка" />
								</div>
							</li>
						)
					})}
					<IngredientInput
						addToList={(newItem) => addToList(newItem, "myProducts", myProducts, setMyProducts)}
						deferredUpdateTimeout={updateTimeout} setDeferredUpdateTimeout={setUpdateTimeout}
						pushUpdates={pushUpdates}
					/>
				</ol>
			</div>
			{isSendingListMessage && <Loader />}
			{sendingError && tg.showPopup({ title: "Ошибка", message: sendingError })}
		</div>
	);
};

export default ShoppingList;