import React, { useContext, useDeferredValue, useEffect, useState } from 'react';
import './SearchBar.css';
import { useFetching } from '../../hooks/useFetching';
import { PageNavContext } from '../../context';
import Recipe from '../../pages/Recipe/Recipe';

const SearchBar = (props) => {
	const { setTitle } = props;
	const [searchQuery, setSearchQuery] = useState({ title: '' });
	const [foundRecipes, setFoundRecipes] = useState([]);
	const { currentPage, setCurrentPage } = useContext(PageNavContext);

	const [getRecipe, isGettingRecipe, getError] = useFetching(async signal => {
		const url = new URL("http://localhost:8080/getRecipes");
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

	useEffect(() => {
		if (searchQuery?.title?.length < 1) return;
		if (setTitle) setTitle(searchQuery.title);
		let timer;
		const abortController = new AbortController()

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
			//await getRecipe().then(res => setFoundRecipes(res));
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

	useEffect(() => {
		if (searchQuery._id) {
			setCurrentPage(<Recipe recipe={foundRecipes[0]} />);
		}
	}, [foundRecipes])

	function handleInput(e) {
		setSearchQuery({ title: e.target.value });
	}

	function handleClick(e) {
		const target = foundRecipes.find(el => el._id === e.target.id);
		setSearchQuery({ _id: target._id });
	}

	function showHints() {
		return (
			<ul className="hints">
				{foundRecipes.length ?
					foundRecipes.map((el, index) => {
						return <li className="hints-item" key={index} id={el._id} onClick={handleClick}>{el.title}</li>
					})
					: <li className="hints-item">{'Ничего не найдено...'}</li>}
			</ul>
		)
	}

	return (
		<div className="search">
			<input className='searchbar' type="search" name="src" id="src" onInput={handleInput} placeholder='Найти рецепт...' />
			{searchQuery?.title?.length >= 3 && showHints()}
		</div>
	);
};

export default SearchBar;