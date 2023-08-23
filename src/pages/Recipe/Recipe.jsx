import React, { useEffect } from 'react';
import './Recipe.css';

const Recipe = (props) => {
	const { recipe } = props;

	return (
		<div className='page page-recipe'>
			<div className="recipe">
				<h2 className="recipe-title">{recipe.title.charAt(0).toUpperCase() + recipe.title.slice(1)}</h2>
				<img className='recipe-img' src={recipe.img} />
				<div className="recipe-info">
					<p className="recipe-info-item">{recipe.type.join(', ')}</p>
					<p className="recipe-info-item">Время приготовления: {recipe.time} минут</p>
					<p className="recipe-info-item">Автор: {recipe.anonymously ? "Anon" : recipe.author}</p>
				</div>
				<h3 className="recipe-subtitle">Ингредиенты:</h3>
				<ul className="recipe-ingredients">
					{recipe.ingredients.map((el, i) => {
						// если указано только наименование продукта
						if (!recipe.quantities[i]) {
							return <li className="recipe-ingredient" key={i}>{el.charAt(0).toUpperCase() + el.slice(1)}</li>
						}
						// если указано еще кол-во
						return <li className="recipe-ingredient" key={i}>{el.charAt(0).toUpperCase() + el.slice(1) + " — " + recipe.quantities[i] + recipe.units[i] || ""}</li>
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