import React, { useState, useEffect, useContext, useRef } from 'react';
import { PageNavContext } from '../../context';
import { useFetching } from '../../hooks/useFetching';
import Recipe from '../../pages/Recipe/Recipe';
import Loader from '../../UI/Loader/Loader';
import Toolbar from '../../UI/Toolbar/Toolbar';
import './SuggestedRecipes.css';

const tg = window.Telegram.WebApp;

const defaultQuery = { type: "all", limit: 9, mode: "discovery" };

const SuggestedRecipes = (props) => {
	const [products, setProducts] = useState({ storage: [], cart: [] });
	const [skip, setSkip] = useState(0);
	const [query, setQuery] = useState(defaultQuery);
	const [recipes, setRecipes] = useState([]);
	const [moreDataOnServer, setMoreDataOnServer] = useState(true);
	const { currentPage, setCurrentPage } = useContext(PageNavContext);
	const lastElement = useRef();
	const lastElementObserver = useRef();

	const [fetchRecipes, isFetching, fetchError, setFetchError] = useFetching(async signal => {
		const url = new URL(process.env.REACT_APP_backURL + "/getRecipes");
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

		// reassign recipes list or add to it
		skip === 0 ? setRecipes(data) : setRecipes(prev => [...prev, ...data]);
		setSkip(prev => prev + 9);
	});

	// fetch product lists & set initial query on mounting
	useEffect(() => {
		tg.CloudStorage.getItems(['myProducts', 'shoppingList'/* , 'favouriteProducts' */], (err, data) => {
			if (err) {
				console.log(err);
				return;
			}

			const result = { ...products };
			Object.values(data).forEach((list, index) => {
				if (!list) return;
				list = JSON.parse(list);
				// if recieved object with quantities and units, convert it to array of names
				if (!Array.isArray(list[0])) list = list.map(item => item.name);
				result[Object.keys(result)[index]] = list;
			});

			setProducts(result);
			if (result.storage) setQuery(prev => ({ ...prev, ingredients: result.storage }));
		});
	}, []);

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

	// fetch recipes on query change
	useEffect(() => {
		fetchRecipes();
	}, [query]);

	function updateQuery(value) {
		setMoreDataOnServer(true);
		setSkip(0);
		setQuery(prev => ({ ...prev, ...value }));
	}

	function handleProductList(listNames) {
		if (!listNames.length) return;
		let result = [];
		listNames.forEach(name => {
			if (!Object.keys(products).includes(name) || !products[name].length) return;
			result.push(...products[name]);
		});

		updateQuery({ ingredients: result });
	}

	return (
		<div className="suggestions">
			<h2 className='title'>Suggestions</h2>
			<Toolbar query={query} updateQuery={updateQuery} handleProductList={handleProductList} />
			<div className='recipes'>
				{!recipes.length && !isFetching && <h3 className='no-results'>Рецепты не найдены</h3>}
				{recipes.map((recipe, i) => (
					// ласт элементу прикручиваем ref
					i == recipes.length - 1 ?
						<div className='recipe-item' onClick={() => { setCurrentPage(<Recipe recipe={recipes[i]} />) }} key={i} ref={lastElement}>
							<div className='recipe-item-img'>
								<img src={recipe.img} alt='изображение' loading='lazy' />
							</div>
							<p className="recipe-item-title">{recipe.title.charAt(0).toUpperCase() + recipe.title.slice(1)}</p>
						</div>
						:
						<div className='recipe-item' onClick={() => { setCurrentPage(<Recipe recipe={recipes[i]} />) }} key={i}>
							<div className='recipe-item-img'>
								<img src={recipe.img} alt='изображение' loading='lazy' />
							</div>
							<p className="recipe-item-title">{recipe.title.charAt(0).toUpperCase() + recipe.title.slice(1)}</p>
						</div>
				))}
				{(isFetching /* && Object.values(props.query).some(value => value.length) */ && !recipes.length) && <Loader />}
			</div>
		</div>
	);
};

export default SuggestedRecipes;