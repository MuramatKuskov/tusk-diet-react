import React, { useContext, useEffect, useState } from 'react';
import './Search.css';
import { useFetching } from '../../hooks/useFetching';
import Loader from '../../UI/Loader/Loader';
import PopUp from '../../UI/PopUp/PopUp';
import { PageNavContext } from '../../context';
import Recipe from '../Recipe/Recipe';
import SearchBar from '../../components/SearchBar/SearchBar';

const Search = (props) => {
	const [recipes, setRecipes] = useState([]);
	const [query, setQuery] = useState(props.query);
	const { currentPage, setCurrentPage } = useContext(PageNavContext);

	const [fetchRecipes, isFetching, fetchError, setFetchError] = useFetching(async () => {
		const url = new URL("http://localhost:8080/getRecipes");
		url.search = new URLSearchParams(query);
		let data = await fetch(url.toString(), {
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
			if (typeof data === 'object') return setRecipes(data);
			console.log('Server response (need recipes arr): %s', data);
		}
		startFetching(query);

		return () => ignore = true;
	}, []);

	const setTitle = e => {
		setQuery(prev => {
			if (!e) {
				const { title, ...rest } = prev;
				return rest;
			}
			return {
				...prev,
				title: e
			}
		});
	}

	const setType = e => {
		setQuery(prev => ({
			...prev,
			type: e.target.selectedOptions[0].value
		}));
	}

	const setIngredients = e => {
		setQuery(prev => {
			if (!e.target.value) {
				const { ingredients, ...rest } = prev;
				return rest;
			}
			return {
				...prev,
				ingredients: e.target.value.split(',')
			}
		})
	}

	const appendFilters = async () => {
		const data = await fetchRecipes(query);
		if (typeof data === 'object') return setRecipes(data);
		console.log('Server response (need recipes arr): %s', data);
	}

	return (
		<div className='page page-search'>
			<div className="filters">
				<SearchBar setTitle={setTitle} />
				<input onChange={setIngredients} type="text" name="ingredients" id="ingredients" placeholder='Ингредиенты' />
				<select onChange={setType} name="type" id="type-select" value={query.type}>
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
				<button onClick={appendFilters} type='button' className="filters-submit">Применить</button>
			</div>
			<div className='recipes'>
				{recipes?.length ? recipes.map((recipe, i) => (
					<div onClick={() => { setCurrentPage(<Recipe recipe={recipes[i]} />) }} key={i} className='recipe-item'>
						<img className='recipe-item-img' src={recipe.img} alt='изображение' loading='lazy' />
						<p className="recipe-item-title">{recipe.title}</p>
					</div>
				)) : "Здесь пока ничего нет..."}
			</div>
			{fetchError && <PopUp text={fetchError} callback={() => setFetchError('')} />}
			{isFetching && <Loader />}
		</div>
	);
};

export default Search;