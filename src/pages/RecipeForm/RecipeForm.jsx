import React, { useCallback, useEffect, useState } from 'react';
import { useTelegram } from '../../hooks/useTelegram';
import './RecipeForm.css';
import { useFetching } from '../../hooks/useFetching';
import Loader from '../../UI/Loader/Loader';
import PopUp from '../../UI/PopUp/PopUp';

const backURL = process.env.REACT_APP_backURL;

const RecipeForm = () => {
	// Работает только из Телеграма
	const { tg, queryId } = useTelegram();

	const recipeSchema = {
		img: "#",
		title: "",
		type: [],
		ingredients: [],
		quantities: [],
		units: [],
		cook: "",
		time: 10,
		author: tg.initDataUnsafe?.user?.username || null,
		moderating: true
	}

	const [recipe, setRecipe] = useState(recipeSchema);
	// Должно работать
	console.log(tg.initDataUnsafe.user?.username);

	const [pushResult, setPushResult] = useState('');

	const [pushRecipe, isPushingRecipe, pushingError, setPushingError] = useFetching(async () => {
		await fetch(`http://localhost:8080/pushRecipe`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ queryId, recipe }) // queryID работает только из Телеграма
		})
			.then(res => {
				handleResponse(res);
			});
	});

	useEffect(() => {
		tg.onEvent('mainButtonClicked', pushRecipe)
		return () => {
			tg.offEvent('mainButtonClicked', pushRecipe)
		}
	}, [pushRecipe]);

	useEffect(() => {
		if (recipe.title.length > 3
			&& recipe.ingredients.length > 0
			&& recipe.cook.length > 3
		) {
			tg.MainButton.show();
			tg.MainButton.setParams({
				text: 'Добавить рецепт'
			})
		}
	}, [recipe.title, recipe.ingredients, recipe.cook])

	const setTitle = (e) => {
		setRecipe(prev => ({
			...prev,
			title: e.target.value
		}));
	}

	const setType = e => {
		setRecipe(prev => ({
			...prev,
			type: prev.type.includes(e.target.attributes.value.nodeValue)
				? [...prev.type].filter(el => el != e.target.attributes.value.nodeValue)
				: [...prev.type, e.target.attributes.value.nodeValue]
		}));
	}

	const setIngredients = (e, i) => {
		const { ingredients } = recipe;
		ingredients[i] = e.target.value;
		setRecipe(prev => ({
			...prev,
			ingredients,
		}));
	}

	const setQuantities = (e, i) => {
		const { quantities } = recipe;
		quantities[i] = +e.target.value;
		console.log(quantities);
		setRecipe(prev => ({
			...prev,
			quantities,
		}))
	}

	const setUnits = (e, i) => {
		const { units } = recipe;
		units[i] = e.target.value;
		setRecipe(prev => ({
			...prev,
			units,
		}))
	}

	const setCook = (e) => {
		setRecipe(prev => ({
			...prev,
			cook: e.target.value
		}));
	}

	const setTime = e => {
		setRecipe(prev => ({
			...prev,
			time: +e.target.value
		}));
	}

	const setImage = e => {
		setRecipe(prev => ({
			...prev,
			img: e.target.value
		}))
	}

	const handleSelect = e => {
		e.target.classList.toggle("selected");
		setType(e);
	}

	const handleResponse = res => {
		setPushResult(res.statusText);
		res.statusText === 'OK' && clearInputs();
	}

	const clearInputs = () => {
		setRecipe(recipeSchema);
		document.querySelectorAll(".selected").forEach(el => el.classList.remove('selected'))
	}

	return (
		<div className='page page-form'>
			<h2 className='title'>Добавить рецепт</h2>
			<form className='recipe-form'>
				<div className='recipe-field'>
					<label className='recipe-label' htmlFor="title">Название</label>
					<input onChange={setTitle} className='recipe-input' type="text" name='title' id='title' placeholder='Название' value={recipe.title} />
				</div>
				<div className="recipe-field">
					<label className="recipe-label">Тип блюда</label>
					<ul className="recipe-dropdown recipe-input">
						<li onClick={handleSelect} className="recipe-type" value='breakfast'>Завтрак</li>
						<li onClick={handleSelect} className="recipe-type" value='main'>Основное</li>
						<li onClick={handleSelect} className="recipe-type" value='garnish'>Гарнир</li>
						<li onClick={handleSelect} className="recipe-type" value='soup'>Суп</li>
						<li onClick={handleSelect} className="recipe-type" value='snack'>Закуска</li>
						<li onClick={handleSelect} className="recipe-type" value='salad'>Салат</li>
						<li onClick={handleSelect} className="recipe-type" value='bakery'>Выпечка</li>
						<li onClick={handleSelect} className="recipe-type" value='dessert'>Десерт</li>
						<li onClick={handleSelect} className="recipe-type" value='drink'>Напиток</li>
						<li onClick={handleSelect} className="recipe-type" value='sauce'>Соус</li>
						<li onClick={handleSelect} className="recipe-type" value='other'>Другое</li>
					</ul>
				</div>
				<div className='recipe-field'>
					<label className='recipe-label' htmlFor="ingredients">Ингредиенты</label>
					{[...Array(recipe.ingredients.length + 1)].map((el, i) => {
						return (<>
							<input onChange={e => setIngredients(e, i)} className='recipe-input recipe-input-short' name='ingredients' id={`ingredients-${i}`} placeholder='Ингредиенты' /* value={recipe.ingredients} */ type='text' />
							<input onChange={e => setQuantities(e, i)} className='recipe-input  recipe-input-short' name='quantities' id={`quantities-${i}`} /* value={recipe.quantities} */ type="number" />
							<select onChange={e => setUnits(e, i)} className='recipe-input  recipe-input-short' name="units" id={`units-${i}`}>
								<option className='recipe-input recipe-input-short' value="" selected disabled>Единицы</option>
								<option className='recipe-input recipe-input-short' value="g">г</option>
								<option className='recipe-input recipe-input-short' value="ml">мл</option>
								<option className='recipe-input recipe-input-short' value="pcs">шт</option>
								<option className='recipe-input recipe-input-short' value="tablespoons">ст.л.</option>
								<option className='recipe-input recipe-input-short' value="teaspoons">ч.л.</option>
								<option className='recipe-input recipe-input-short' value="cups">стаканы</option>
							</select>
						</>)
					})}
				</div>
				<div className='recipe-field'>
					<label className='recipe-label' htmlFor="cook">Приготовление</label>
					<textarea onChange={setCook} className='recipe-input' name='cook' id='cook' placeholder='Приготовление' rows="6" value={recipe.cook}></textarea>
				</div>
				<div className='recipe-field'>
					<label className='recipe-label' htmlFor="time">
						Время приготовления:
						<input type='number' className='recipe-input recipe-input-inline' value={recipe.time} onChange={setTime} />
						минут(ы)
					</label>
					<input type='range' onChange={setTime} className='recipe-input' name='time' min="10" max="120" value={recipe.time} />
				</div>
				<div className='recipe-field'>
					<label className='recipe-label' htmlFor="img">Прикрепить изображение</label>
					<input onChange={setImage} className='recipe-input' type="file" name='img' id='img' value='' />
				</div>
				<button type='button' onClick={pushRecipe}>Push</button>
			</form>
			{pushResult && <PopUp text={pushResult} callback={() => { setPushResult('') }} />}
			{pushingError && <PopUp text={pushingError} callback={() => { setPushingError('') }} />}
			{isPushingRecipe && <Loader />}
		</div>
	);
};

export default RecipeForm;
