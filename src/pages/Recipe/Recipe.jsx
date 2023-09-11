import React, { useContext } from 'react';
import { ShoppingListContext } from '../../context';
import './Recipe.css';

const Recipe = (props) => {
	const { shoppingList, setShoppingList } = useContext(ShoppingListContext);
	const { recipe } = props;

	function handleList(e) {
		const index = e.target.dataset.index;
		const isAdded = e.target.classList.toggle("added");
		if (isAdded) return addToList(index)
		return removeFromList(index)
	}

	function addToList(i) {
		setShoppingList(prev => [
			...prev,
			{
				name: recipe.ingredients[i],
				quantity: recipe.quantities[i],
				unit: recipe.units[i]
			}
		]);
	}

	function removeFromList(i) {
		setShoppingList(prev => [
			...prev.filter(el => el.name != recipe.ingredients[i])
		]);
	}

	return (
		<div className='page page-recipe'>
			<div className="recipe">
				<h2 className="recipe-title">{recipe.title.charAt(0).toUpperCase() + recipe.title.slice(1)}</h2>
				<img className='recipe-img' src={recipe.img} />
				<div className="recipe-info">
					<div className="recipe-info-item">{recipe.type.join(', ')}</div>
					<div className="recipe-info-item">
						<img src="assets/clock.svg" className="recipe-info-img" />
						{recipe.time} минут
					</div>
					<div className="recipe-info-item">
						<img src="assets/user.svg" className="recipe-info-img" />
						{recipe.anonymously ? "Anon" : recipe.author}
					</div>
				</div>
				<h3 className="recipe-subtitle">Ингредиенты:</h3>
				<ul className="recipe-ingredients">
					{recipe.ingredients.map((el, i) => {
						return (
							<li className="recipe-ingredient" key={i}>
								<p className="ingredient-info">
									{`${el.charAt(0).toUpperCase()}${el.slice(1)} ${recipe.quantities[i] || ""} ${recipe.units[i] || ""}`}
								</p>
								<div className="ingredient-actions">
									<img className={`action ${shoppingList.find(li => li.name === el) ? "added" : ""}`} onClick={e => handleList(e)} data-index={i} src="assets/plus-ico.svg" alt="добавить в список покупок" />
								</div>
							</li>
						)
					})}
				</ul>
				<h3 className="recipe-subtitle">Приготовление:</h3>
				{recipe.cook.split('\n').map((el, i) => {
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