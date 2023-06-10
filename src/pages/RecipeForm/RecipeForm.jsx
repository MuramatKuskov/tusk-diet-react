import React, { useCallback, useEffect, useState } from 'react';
import { useTelegram } from '../../hooks/useTelegram';
import './RecipeForm.css';

const backURL = process.env.REACT_APP_backURL;
console.log(backURL);
const RecipeForm = () => {
	const [recipe, setRecipe] = useState({
		// дописать логику добавления картинок
		img: "",
		title: "",
		ingredients: "",
		process: "",
		link: "",
		tags: ""
	});
	const { tg, queryId } = useTelegram();

	const pushRecipe = useCallback(async () => {
		/* fetch('localhost:8080/pushRecipe').then(resp => {
			console.log(resp);
			const reader = resp.body.getReader();
			return reader.read();
		}).then(({ done, value }) => {
			if (done) {
				console.log('gg');
				return;
			}
			const data = new TextDecoder().decode(value);
			console.log(data);
		}); */
		fetch(`${backURL}/pushRecipe`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ queryId, recipe })
		})
			.then(resp => {
				const reader = resp.body.getReader();
				return reader.read();
			}).then(({ done, value }) => {
				if (done) {
					console.log('gg');
					return;
				}
				const data = new TextDecoder().decode(value);
				console.log(data);
			});
	}, []);

	useEffect(() => {
		tg.onEvent('mainButtonClicked', pushRecipe)
		return () => {
			tg.offEvent('mainButtonClicked', pushRecipe)
		}
	}, [pushRecipe]);

	useEffect(() => {
		if (recipe.title.length > 3
			&& recipe.ingredients.length > 0
			&& recipe.process.length > 3
		) {
			tg.MainButton.show();
			tg.MainButton.setParams({
				text: 'Добавить рецепт'
			})
		}
	}, [recipe.title, recipe.ingredients, recipe.process])

	const setTitle = (e) => {
		setRecipe(prev => ({
			...prev,
			title: e.target.value
		}));
	}

	const setIngredients = (e) => {
		setRecipe(prev => ({
			...prev,
			ingredients: e.target.value
		}));
	}

	const setProcess = (e) => {
		setRecipe(prev => ({
			...prev,
			process: e.target.value
		}));
	}

	const setLink = (e) => {
		setRecipe(prev => ({
			...prev,
			link: e.target.value
		}));
	}

	const setTags = (e) => {
		setRecipe(prev => ({
			...prev,
			tags: e.target.value
		}));
	}

	return (
		<div className='page'>
			<h2 className='title'>Добавить рецепт</h2>
			<form className='recipe-form'>
				<div className='recipe-field'>
					<label className='recipe-label' htmlFor="title">Название блюда</label>
					<input onChange={setTitle} className='recipe-input' type="text" name='title' id='title' placeholder='Название' />
				</div>
				<div className='recipe-field'>
					<label className='recipe-label' htmlFor="ingredients">Ингредиенты</label>
					<input onChange={setIngredients} className='recipe-input' type="text" name='ingredients' id='ingredients' placeholder='Ингредиенты' />
				</div>
				<div className='recipe-field'>
					<label className='recipe-label' htmlFor="process">Приготовление</label>
					<textarea onChange={setProcess} className='recipe-input' name='process' id='process' placeholder='Приготовление' rows="6"></textarea>
				</div>
				<div className='recipe-field'>
					<label className='recipe-label' htmlFor="link">Link</label>
					<input onChange={setLink} className='recipe-input' type="url" name='ingredients' id='link' placeholder='Link' />
				</div>
				<div className='recipe-field'>
					<label className='recipe-label' htmlFor="tags">Тэги</label>
					<input onChange={setTags} className='recipe-input' type="text" name='tags' id='tags' placeholder='Тэги' />
				</div>
				<button type='button' onClick={pushRecipe}>Push</button>
			</form>
		</div>
	);
};

export default RecipeForm;