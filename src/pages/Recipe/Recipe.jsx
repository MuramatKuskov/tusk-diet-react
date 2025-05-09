import React, { useEffect, useState } from 'react';
import './Recipe.css';
import { useFetching } from '../../hooks/useFetching';

const tg = window.Telegram.WebApp;

const Recipe = (props) => {
	const [shoppingList, setShoppingList] = useState([]);
	const [recipe, setRecipe] = useState(props.recipe);

	const [fetchRecipe, isFetching, fetchError, setFetchError] = useFetching(async signal => {
		const url = new URL(process.env.REACT_APP_API_URL + "recipes/getRecipeByID?id=" + props.recipe._id);
		let data = await fetch(url.toString(), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			signal,
		});
		data = await data.json();

		if (!data) {
			setFetchError("Рецепт не найден");
			return;
		} else {
			setRecipe(prev => ({ ...prev, ...data[0] }));
		}
	});

	const [sendToChat, isSending, sendingError] = useFetching(async () => {
		await fetch(process.env.REACT_APP_API_URL + "chat/sendRecipe", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ query_id: tg.initDataUnsafe.query_id, recipe })
		})
			.then(res => {
				if (res.status !== 200) {
					tg.showAlert(res.status + ": " + res.message);
				}
			});
	});

	// handle tg main button appearance
	useEffect(() => {
		if (recipe.cook) {
			tg.MainButton.setParams({
				text: 'Сохранить рецепт в чате с ботом'
			});
			tg.MainButton.show();
		}
		return () => tg.MainButton.hide();
	}, [recipe])

	// handle tg main button click
	useEffect(() => {
		tg.onEvent('mainButtonClicked', sendToChat)
		return () => {
			tg.offEvent('mainButtonClicked', sendToChat)
		}
	}, [sendToChat]);

	useEffect(() => {
		fetchRecipe();
		tg.CloudStorage.getItem('shoppingList', (err, data) => {
			if (err) {
				console.log(err);
				return;
			}

			const parsedData = JSON.parse(data);
			setShoppingList(parsedData);
		});
	}, []);

	function handleList(e) {
		const index = e.target.dataset.index;
		const isAdded = e.target.classList.toggle("added");
		if (isAdded) return addToList(index)
		return removeFromList(index)
	}

	function addToList(i) {
		const updatedList = [...shoppingList, {
			name: props.recipe.ingredients[i],
			quantity: props.recipe.quantities[i],
			unit: props.recipe.units[i]
		}];

		tg.CloudStorage.setItem('shoppingList', JSON.stringify(updatedList), (err, result) => {
			if (err) {
				console.log(err);
				return;
			}
			setShoppingList(updatedList);
		});
	}

	function removeFromList(i) {
		const filteredList = shoppingList.filter(el => el.name != props.recipe.ingredients[i]);

		tg.CloudStorage.setItem('shoppingList', JSON.stringify(filteredList), (err, result) => {
			if (err) {
				console.log(err);
				return;
			}

			setShoppingList(filteredList);
		});
	}

	return (
		<div className='page page-recipe'>
			<div className="recipe">
				<h2 className="recipe-title">{recipe.title.charAt(0).toUpperCase() + recipe.title.slice(1)}</h2>
				<div className="recipe-img">
					<img src={recipe.img} />
				</div>
				<div className="recipe-info">
					<div className="recipe-info-item">{recipe.type.join(', ')}</div>
					<div className="recipe-info-item">
						<img src="assets/clock.svg" className="recipe-info-img" />
						{recipe.time} минут
					</div>
					<div className="recipe-info-item">
						<img src="assets/person.svg" className="recipe-info-img" />
						<span className="recipe-author">{recipe.author}</span>
					</div>
				</div>
				<h3 className="recipe-subtitle">Ингредиенты:</h3>
				<ul className="recipe-ingredients">
					{recipe.ingredients.map((el, i) => {
						return (
							<li className="recipe-ingredient" key={i}>
								<p className="ingredient-info">
									{`${el.charAt(0).toUpperCase()}${el.slice(1)} ${recipe.quantities?.[i] || ""} ${recipe.units?.[i] || ""}`}
								</p>
								<div className="ingredient-controls">
									<img className={`control ${shoppingList.find(li => li.name === el) ? "added" : ""}`} onClick={e => handleList(e)} data-index={i} src="assets/plus-ico.svg" alt="добавить в список покупок" />
								</div>
							</li>
						)
					})}
				</ul>
				<h3 className="recipe-subtitle">Приготовление:</h3>
				{recipe.cook?.split('\n').map((el, i) => {
					return <p className='recipe-cook' key={i}>{el}</p>
				})}
				{recipe.link &&
					<div className='recipe-link'>
						<h3 className="recipe-subtitle">Ссылка на рецепт:</h3>
						<a href={recipe.link} target='_blank' className='recipe-link'>{recipe.link}</a>
					</div>
				}
			</div>
		</div>
	);
};

export default Recipe;