import React, { useEffect, useState } from 'react';
import './Search.css';
import { useFetching } from '../../hooks/useFetching';
import Loader from '../../UI/Loader/Loader';
import PopUp from '../../UI/PopUp/PopUp';

const Search = (props) => {
	const [recipes, setRecipes] = useState([]);
	const [query, setQuery] = useState("?" + props.query);

	const [fetchRecipes, isFetching, fetchError, setFetchError] = useFetching(async () => {
		let data = await fetch(`http://localhost:8080/getRecipes${query}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		data = await data.json();
		return data;
	});

	useEffect(() => {
		let ignore = false;

		async function startFetching(query) {
			if (ignore) return;
			const data = await fetchRecipes(query);
			setRecipes(data);
		}
		startFetching(query);

		return () => ignore = true;
	}, []);

	const setType = e => {
		setQuery(prev => ({
			...prev,
			type: e.target.selectedOptions[0].value
		}));
	}

	return (
		<div className='page'>
			<div className="filters">
				<select onChange={setType} name="type" id="type-select">
					<option value="breakfast">Завтраки</option>
					<option value="main">Основные блюда</option>
					<option value="garnish">Гарниры</option>
					<option value="soup">Супы</option>
					<option value="snack">Закуски</option>
					<option value="salad">Салаты</option>
					<option value="bakery">Выпечка</option>
					<option value="dessert">Дессерты</option>
					<option value="drink">Напитки</option>
					<option value="sauce">Соусы</option>
					<option value="other">Другое</option>
				</select>
			</div>
			<div className='recipes'>
				{recipes?.length ? recipes.map((recipe, i) => (
					<div key={i} className='recipe'>
						<img className='recipe-img' src={recipe.img} alt='изображение' loading='lazy' />
						<p className="recipe-title">{recipe.title}</p>
					</div>
				)) : "Здесь пока ничего нет..."}
			</div>
			{fetchError && <PopUp text={fetchError} callback={() => setFetchError('')} />}
			{isFetching && <Loader />}
		</div>
	);
};

export default Search;