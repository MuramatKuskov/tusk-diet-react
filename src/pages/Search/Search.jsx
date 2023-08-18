import React, { useContext, useEffect, useRef, useState } from 'react';
import './Search.css';
import { useFetching } from '../../hooks/useFetching';
import Loader from '../../UI/Loader/Loader';
import PopUp from '../../UI/PopUp/PopUp';
import { PageNavContext } from '../../context';
import Recipe from '../Recipe/Recipe';
import SearchBar from '../../components/SearchBar/SearchBar';
import Button from '../../UI/Button/Button';

const Search = (props) => {
	const [recipes, setRecipes] = useState([]);
	const defaultQuery = { skip: 0, limit: 9, type: props?.query?.type || "all" }
	const [query, setQuery] = useState(props.query || {});
	// отдельный стейт нужен, потому что он будет изменяться после fetch
	// а fetch зависим от query
	const [skip, setSkip] = useState(0);
	const { currentPage, setCurrentPage } = useContext(PageNavContext);
	const scrollObserver = useRef();
	const scrollAnchor = useRef();
	const scrollBtn = useRef();
	const titleInput = useRef();
	const ingredientsInput = useRef();
	const typeInput = useRef();
	const lastElement = useRef();
	const lastElementObserver = useRef();

	const [fetchRecipes, isFetching, fetchError, setFetchError] = useFetching(async signal => {
		const url = new URL("http://localhost:8080/getRecipes");
		query.skip = skip;
		query.limit = 9;
		url.search = new URLSearchParams(query);
		let data = await fetch(url.toString(), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			signal,
		});
		data = await data.json();
		setRecipes([...recipes, ...data]);
		setSkip(skip + 9);
	});

	useEffect(() => {
		if (props.query.type) {
			typeInput.current.value = props.query.type;
		}
	}, [])

	useEffect(() => {
		let ignore = false;
		let timer;
		const abortController = new AbortController();

		async function startFetching() {
			try {
				if (ignore) return;
				fetchRecipes();
			} catch (error) {
				if (error.name === 'AbortError') {
					console.log('AbortError');
					// Запрос был отменен, не обрабатываем результат
					return;
				}
			}
		}
		function debounceFetch() {
			clearTimeout(timer);
			timer = setTimeout(startFetching, 10)
		}
		debounceFetch();

		return () => {
			ignore = true;
			clearTimeout(timer);
			abortController.abort();
		}
	}, []);

	useEffect(() => {
		if (isFetching) return;
		if (lastElementObserver.current) lastElementObserver.current.disconnect();
		let callback = function (entries, observer) {
			if (entries[0].isIntersecting) {
				fetchRecipes();
			}
		}

		lastElementObserver.current = new IntersectionObserver(callback);
		if (lastElement.current) {
			lastElementObserver.current.observe(lastElement.current);
		}
		return () => lastElementObserver.current.disconnect();
	}, [isFetching]);

	useEffect(() => {
		scrollObserver.current = new IntersectionObserver(entries => {
			if (!entries[0].isIntersecting) {
				scrollBtn.current.classList.add('visible');
			} else {
				scrollBtn.current.classList.remove('visible');
			}
		})
		console.log(scrollAnchor.current);
		scrollObserver.current.observe(scrollAnchor.current);
		return () => scrollObserver.current.disconnect();
	}, [])

	useEffect(() => {
		fetchRecipes()
	}, [query]);

	const setTitle = newTitle => {
		setQuery(prev => {
			if (!newTitle) {
				const { title, ...rest } = prev;
				return rest;
			}
			return {
				...prev,
				title: newTitle
			}
		});
	}

	const setType = newType => {
		if (!newType.length) return
		setQuery(prev => ({
			...prev,
			type: newType//e.target.selectedOptions[0].value
		}));
	}

	const setIngredients = newValue => {
		setQuery(prev => {
			if (!newValue.length) {
				const { ingredients, ...rest } = prev;
				return rest;
			}
			return {
				...prev,
				ingredients: newValue.split(',').map(el => {
					return el.trim(); //.toLowerCase()
				})
			}
		})
	}

	const appendFilters = () => {
		// выполинть, если хотя бы 1 из полей не инициализировано, или
		// значение состояния отличается от значения инпута
		if (
			(!query.title || query.title != titleInput.current.value)
			||
			(!query.ingredients || query.ingredients != ingredientsInput.current.value)
			||
			(!query.type || query.type != typeInput.current.value)
		) {
			setSkip(0);
			setRecipes([]);
			if (query.title != titleInput.current.value) setTitle(titleInput.current.value.toLowerCase());
			if (query.ingredients != ingredientsInput.current.value) setIngredients(ingredientsInput.current.value.toLowerCase());
			if (query.type != typeInput.current.value && typeInput.current.value != 'Тип') setType(typeInput.current.value);
		}
	}

	return (
		<div className='page page-search'>
			<div className="filters" ref={scrollAnchor}>
				<SearchBar ref={titleInput} /* setTitle={setTitle} */ placeholder="Название" />
				<input className='filters-input' ref={ingredientsInput} /* onChange={setIngredients} */ type="text" name="ingredients" id="ingredients" placeholder='Ингредиенты' />
				<select className='filters-input' ref={typeInput} /* onChange={setType} */ name="type" id="type-select" /* value={query.type} */>
					<option className='filters-option' selected disabled>Тип</option>
					<option className='filters-option' value="all">Все</option>
					<option className='filters-option' value="breakfast">Завтраки</option>
					<option className='filters-option' value="main">Основные блюда</option>
					<option className='filters-option' value="garnish">Гарниры</option>
					<option className='filters-option' value="soup">Супы</option>
					<option className='filters-option' value="snack">Закуски</option>
					<option className='filters-option' value="salad">Салаты</option>
					<option className='filters-option' value="bakery">Выпечка</option>
					<option className='filters-option' value="dessert">Дессерты</option>
					<option className='filters-option' value="drink">Напитки</option>
					<option className='filters-option' value="sauce">Соусы</option>
					<option className='filters-option' value="other">Другое</option>
				</select>
				<Button callback={appendFilters}>Применить</Button>
			</div>
			<div className='recipes'>
				<button className="recipes-scroll button button-ghost" type='button' onClick={() => scrollAnchor.current.scrollIntoView({ behavior: "smooth" })} ref={scrollBtn}>Наверх</button>
				{recipes.map((recipe, i) => (
					// ласт элементу прикручиваем ref
					i == recipes.length - 1 ?
						<div onClick={() => { setCurrentPage(<Recipe recipe={recipes[i]} />) }} key={i} className='recipe-item' ref={lastElement}>
							<img className='recipe-item-img' src={recipe.img} alt='изображение' loading='lazy' />
							<p className="recipe-item-title">{recipe.title.charAt(0).toUpperCase() + recipe.title.slice(1)}</p>
						</div>
						:
						<div onClick={() => { setCurrentPage(<Recipe recipe={recipes[i]} />) }} key={i} className='recipe-item'>
							<img className='recipe-item-img' src={recipe.img} alt='изображение' loading='lazy' />
							<p className="recipe-item-title">{recipe.title.charAt(0).toUpperCase() + recipe.title.slice(1)}</p>
						</div>
				))}
			</div>
			{fetchError && <PopUp text={fetchError} callback={() => setFetchError('')} />}
			{(isFetching && !recipes.length) && <Loader />}
		</div >
	);
};

export default Search;