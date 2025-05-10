import React, { useContext, useEffect, useRef, useState } from 'react';
import * as Select from "@radix-ui/react-select";
import './Search.css';
import { useFetching } from '../../hooks/useFetching';
import Loader from '../../UI/Loader/Loader';
import PopUp from '../../UI/PopUp/PopUp';
import { PageNavContext } from '../../context';
import Recipe from '../Recipe/Recipe';
import SearchBar from '../../components/SearchBar/SearchBar';
import CumulativeItems from '../../UI/CumulativeItems/CumulativeItems';
import Toolbar from '../../UI/Toolbar/Toolbar';

const Search = (props) => {
	const { currentPage, setCurrentPage } = useContext(PageNavContext);
	const [recipes, setRecipes] = useState([]);
	const [skip, setSkip] = useState(0);
	const defaultQuery = { mode: "discovery", type: props?.query?.type || "all", skip: 0, limit: 9, }
	const [query, setQuery] = useState(defaultQuery);
	const [moreDataOnServer, setMoreDataOnServer] = useState(true);
	const scrollObserver = useRef();
	const scrollAnchor = useRef();
	const scrollBtn = useRef();
	const titleInput = useRef();
	const lastElement = useRef();
	const lastElementObserver = useRef();

	const [fetchRecipes, isFetching, fetchError, setFetchError] = useFetching(async signal => {
		const url = new URL(process.env.REACT_APP_API_URL + "recipes/getRecipesByQuery");
		url.search = new URLSearchParams({ ...query, skip });
		let data = await fetch(url.toString(), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			signal,
		});
		data = await data.json();

		if (!data.length || data.length < 9) setMoreDataOnServer(false);

		skip === 0 ? setRecipes(data) : setRecipes(prev => [...prev, ...data]);
		setSkip(prev => prev + 9);
	});

	// scrollObserver init
	useEffect(() => {
		scrollObserver.current = new IntersectionObserver(entries => {
			if (!entries[0].isIntersecting) {
				scrollBtn.current.classList.add('visible');
			} else {
				scrollBtn.current.classList.remove('visible');
			}
		})
		scrollObserver.current.observe(scrollAnchor.current);
		return () => scrollObserver.current.disconnect();
	}, [])

	// fetch recipes on page load
	useEffect(() => {
		let ignore = false;
		let timer;
		const abortController = new AbortController();

		async function startFetching() {
			try {
				if (ignore) return;
				fetchRecipes(abortController.signal);
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

	// fetch recipes on query change
	useEffect(() => {
		fetchRecipes();
	}, [query]);

	// observe last element
	useEffect(() => {
		if (isFetching) return;
		if (lastElementObserver.current) lastElementObserver.current.disconnect();
		let callback = function (entries, observer) {
			if (entries[0].isIntersecting && moreDataOnServer && !isFetching) {
				fetchRecipes();
			}
		}

		lastElementObserver.current = new IntersectionObserver(callback);
		if (lastElement.current) {
			lastElementObserver.current.observe(lastElement.current);
		}
		return () => lastElementObserver.current.disconnect();
	}, [isFetching]);

	function updateQuery(update) {
		setSkip(0);
		setMoreDataOnServer(true);
		setQuery(prev => ({
			...prev,
			...update
		}));
	}

	const setTitle = title => {
		setSkip(0);
		setMoreDataOnServer(true);
		setQuery(prev => {
			// clear param if empty
			if (!title) {
				const { title, ...rest } = prev;
				return rest;
			}
			// set param
			return {
				...prev,
				title: title
			}
		});
	}

	const addIngredient = ingredient => {
		setSkip(0);
		setMoreDataOnServer(true);
		setQuery(prev => ({
			...prev,
			ingredients: prev.ingredients ? [...prev.ingredients, ingredient.toLowerCase()] : [ingredient.toLowerCase()]
		}));
	}

	const removeIngredient = index => {
		setSkip(0);
		setMoreDataOnServer(true);
		setQuery(prev => ({
			...prev,
			ingredients: prev.ingredients.toSpliced(index, 1)
		}));
	}

	return (
		<div className='page page-search'>
			<div className="filters" ref={scrollAnchor}>
				<SearchBar ref={titleInput} setTitle={setTitle} placeholder="Название" />
				<Toolbar updateQuery={updateQuery} query={query} />
				<div className="filters-ingredients">
					<h3 className="filters-title title">Ingredients</h3>
					<CumulativeItems items={query.ingredients} actions={{ addItem: addIngredient, removeItem: removeIngredient }} />
				</div>
			</div>
			<div className='recipes'>
				{!recipes.length && !isFetching && <h3 className='no-results'>Рецепты не найдены</h3>}
				<button className="recipes-scroll button button-ghost" type='button' onClick={() => scrollAnchor.current.scrollIntoView({ behavior: "smooth" })} ref={scrollBtn}>Наверх</button>
				{recipes.map((recipe, i) => (
					// ласт элементу прикручиваем ref
					i == recipes.length - 1 ?
						<div onClick={() => { setCurrentPage(<Recipe recipe={recipes[i]} />) }} key={i} className='recipe-item' ref={lastElement}>
							<div className='recipe-item-img'>
								<img src={recipe.img} alt='изображение' loading='lazy' />
							</div>
							<p className="recipe-item-title">{recipe.title.charAt(0).toUpperCase() + recipe.title.slice(1)}</p>
						</div>
						:
						<div onClick={() => { setCurrentPage(<Recipe recipe={recipes[i]} />) }} key={i} className='recipe-item'>
							<div className='recipe-item-img'>
								<img src={recipe.img} alt='изображение' loading='lazy' />
							</div>
							<p className="recipe-item-title">{recipe.title.charAt(0).toUpperCase() + recipe.title.slice(1)}</p>
						</div>
				))}
				{(isFetching /* && Object.values(props.query).some(value => value.length) */ && !recipes.length) && <Loader />}
			</div>
			{fetchError && <PopUp text={fetchError} callback={() => setFetchError('')} />}
			{/* show loader only when params specified && !recipes on page */}
		</div >
	);
};

export default Search;