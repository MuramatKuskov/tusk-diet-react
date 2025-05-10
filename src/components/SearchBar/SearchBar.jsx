import React, { forwardRef, useContext, useEffect, useState } from 'react';
import './SearchBar.css';
import { useFetching } from '../../hooks/useFetching';
import { PageNavContext } from '../../context';
import Recipe from '../../pages/Recipe/Recipe';

const SearchBar = forwardRef(({ setTitle, placeholder, value }, ref) => {
	const [searchQuery, setSearchQuery] = useState({ title: '' });
	const [foundRecipes, setFoundRecipes] = useState([]);
	const { currentPage, setCurrentPage } = useContext(PageNavContext);

	const [getRecipe, isGettingRecipe, getError] = useFetching(async signal => {
		const url = new URL(process.env.REACT_APP_API_URL + "recipes/getRecipesByQuery");
		url.search = new URLSearchParams(searchQuery);
		let data = await fetch(url.toString(), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			signal,
		});
		data = await data.json();
		return data;
	});

	// debounce search
	useEffect(() => {
		if (setTitle) setTitle(searchQuery.title);
		if (searchQuery?.title?.length < 1) return;
		let timer;
		const abortController = new AbortController();

		async function fetchRecipes() {
			try {
				const data = await getRecipe(abortController.signal);
				if (!data) return;
				if (typeof data === 'object') return setFoundRecipes(data);
				console.log('Server response (need recipes arr): %s', data);
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
			timer = setTimeout(fetchRecipes, 500);
		}
		debounceFetch();

		return () => {
			clearTimeout(timer);
			abortController.abort();
		};
	}, [searchQuery]);

	/* useEffect(() => {
		if (searchQuery._id) {
			setCurrentPage(<Recipe recipe={foundRecipes[0]} />);
		}
	}, [foundRecipes]) */

	function handleInput(e) {
		setSearchQuery({ title: e.target.value.toLowerCase() });
	}

	function handleClick(e) {
		const target = foundRecipes.find(el => el._id === e.target.id);
		//setSearchQuery({ _id: target._id });
		setCurrentPage(<Recipe recipe={target} />);
	}

	function toggleFocus(e) {
		if (e.target.classList.contains('inFocus')) {
			return setTimeout(() => {
				e.target.classList.remove('inFocus');
			}, 50);
		}
		e.target.classList.add('inFocus');
	}

	function showHints() {
		return <ul className="hints">
			{foundRecipes.length ?
				foundRecipes.map((el, index) => {
					return <li className="hints-item" key={index} id={el._id} onClick={handleClick}>{el.title.charAt(0).toUpperCase() + el.title.slice(1)}</li>
				})
				: <li className="hints-item">{'Ничего не найдено...'}</li>}
		</ul>
	}

	return (
		<>
			<input className='searchbar' type="search" name="src" id="src" onInput={handleInput} onFocus={toggleFocus} onBlur={toggleFocus} placeholder={placeholder} value={value} ref={ref} />
			{searchQuery?.title?.length > 1 && showHints()}
		</>
	);
});

export default SearchBar;