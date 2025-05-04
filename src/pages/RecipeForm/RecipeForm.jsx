import React, { useContext, useEffect, useState } from 'react';
import './RecipeForm.css';
import { UserContext } from '../../context';
import { useFetching } from '../../hooks/useFetching';
import Button from "../../UI/Button/Button";
import Loader from '../../UI/Loader/Loader';
import PopUp from '../../UI/PopUp/PopUp';
import SearchBar from '../../components/SearchBar/SearchBar';

const backURL = process.env.REACT_APP_backURL;
const tg = window.Telegram.WebApp;

const RecipeForm = () => {
	const { user } = useContext(UserContext);
	const recipeSchema = {
		img: "/assets/DishPlaceholder.png",
		title: "",
		origin: "",
		type: [],
		ingredients: [],
		quantities: [],
		units: [],
		cook: "",
		difficulty: "",
		time: 10,
		rating: null,
		ratingIterator: 0,
		link: "",
		author: user._id,
		anonymously: false,
		moderating: true
	}
	const [recipe, setRecipe] = useState(recipeSchema);
	const [pushResult, setPushResult] = useState('');

	const [pushRecipe, isPushingRecipe, pushingError, setPushingError] = useFetching(async () => {
		await fetch(backURL + "/pushRecipe", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ queryId: tg.initDataUnsafe.queryId, recipe, _id: user._id })
		})
			.then(res => {
				handleResponse(res);
			});
	});

	// tg MainButton event handler
	useEffect(() => {
		tg.onEvent('mainButtonClicked', pushRecipe)
		return () => {
			tg.offEvent('mainButtonClicked', pushRecipe)
		}
	}, [pushRecipe]);

	// tg MainButton appearance
	useEffect(() => {
		if (recipe.title.length > 2
			&& recipe.type.length > 0
			&& recipe.ingredients.length > 0
			&& recipe.cook.length > 3
		) {
			tg.MainButton.show();
			tg.MainButton.setParams({
				text: 'Добавить рецепт'
			})
		}
		return () => tg.MainButton.hide();
	}, [recipe.title, recipe.type, recipe.ingredients, recipe.cook]);

	const setTitle = newTitle => {
		setRecipe(prev => ({
			...prev,
			title: newTitle
		}))
	}

	const setType = e => {
		setRecipe(prev => ({
			...prev,
			type: prev.type.includes(e.target.attributes.value.nodeValue)
				? [...prev.type].filter(el => el != e.target.attributes.value.nodeValue)
				: [...prev.type, e.target.attributes.value.nodeValue]
		}))
	}

	const setDifficulty = e => {
		setRecipe(prev => ({
			...prev,
			difficulty: e.target.textContent.toLowerCase()
		}))
	}

	const setIngredients = (e, i) => {
		const { ingredients } = recipe;

		// remove input if it's empty
		if (e.target.value === "") {
			ingredients.splice(i, 1);
			recipe.quantities.splice(i, 1);
			recipe.units.splice(i, 1);
		} else {
			ingredients[i] = e.target.value.toLowerCase();
		}

		setRecipe(prev => ({
			...prev,
			ingredients,
		}))
	}

	const setQuantities = (e, i) => {
		const { quantities } = recipe;
		quantities[i] = +e.target.value;
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
		}))
	}

	const setTime = e => {
		setRecipe(prev => ({
			...prev,
			time: +e.target.value
		}))
	}

	const setOrigin = e => {
		setRecipe(prev => ({
			...prev,
			origin: e.target.value
		}))
	}

	const setLink = e => {
		setRecipe(prev => ({
			...prev,
			link: e.target.value
		}))
	}

	const setImage = e => {
		setRecipe(prev => ({
			...prev,
			img: e.target.value
		}))
	}

	const setAnonymity = () => {
		setRecipe(prev => ({
			...prev,
			anonymously: !prev.anonymously
		}))
	}

	// select dish type from dropdown
	const handleSelect = e => {
		e.target.classList.toggle("selected");
		setType(e);
	}

	const handleResponse = res => {
		setPushResult(res.statusText);
		res.status === 200 && clearInputs();
	}

	const clearInputs = () => {
		setRecipe(recipeSchema);
		// useRef
		document.querySelectorAll(".selected").forEach(el => el.classList.remove('selected'))
		document.querySelector("#ingredients-0").value = "";
		document.querySelector("#quantities-0").value = "";
	}

	return (
		<div className='page page-form'>
			<h2 className='title'>Добавить рецепт</h2>
			<form className='recipe-form'>
				<div className='recipe-field'>
					<label className='recipe-label' htmlFor="title">Название</label>
					<SearchBar setTitle={setTitle} placeholder="Название" value={recipe.title} />
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
					<label className='recipe-label' htmlFor="difficulty">Сложность</label>
					<div className='recipe-row'>
						<Button type="light" callback={setDifficulty} text="Легко" />
						<Button type="light" callback={setDifficulty} text="Средне" />
						<Button type="light" callback={setDifficulty} text="Сложно" />
					</div>
				</div>
				<div className='recipe-field'>
					<label className='recipe-label' htmlFor="ingredients">Ингредиенты</label>
					{[...Array(recipe.ingredients.length + 1)].map((el, i) => {
						return (<div className='recipe-input-wrapper' key={i}>
							<input onChange={e => setIngredients(e, i)} className='recipe-input recipe-input-short' name='ingredients' id={`ingredients-${i}`} value={recipe.ingredients[i] ?? ""} placeholder='Ингредиенты' type='text' />
							<input onChange={e => setQuantities(e, i)} className='recipe-input  recipe-input-short' name='quantities' id={`quantities-${i}`} value={recipe.quantities[i] ?? ""} type="number" />
							<select onChange={e => setUnits(e, i)} className='recipe-input  recipe-input-short' name="units" value={recipe.units[i] ?? "Единицы"} id={`units-${i}`}>
								<option className='recipe-input recipe-option' disabled>Единицы</option>
								<option className='recipe-input recipe-option' value="кг">кг</option>
								<option className='recipe-input recipe-option' value="л">л</option>
								<option className='recipe-input recipe-option' value="г">г</option>
								<option className='recipe-input recipe-option' value="мл">мл</option>
								<option className='recipe-input recipe-option' value="шт">шт</option>
								<option className='recipe-input recipe-option' value="ст.л.">ст.л.</option>
								<option className='recipe-input recipe-option' value="ч.л.">ч.л.</option>
								<option className='recipe-input recipe-option' value="стаканы">стаканы</option>
							</select>
						</div>)
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
				<div className="recipe-field">
					<label htmlFor="origin" className="recipe-label">Страна/регион происхождения</label>
					<input className='recipe-input' onChange={setOrigin} type="text" name='origin' id='origin' value={recipe.origin} placeholder='Происхождение' />
				</div>
				<div className="recipe-field">
					<label htmlFor="link" className="recipe-label">Ссылка на источник</label>
					<input className='recipe-input' onChange={setLink} type="text" name='link' id='link' value={recipe.link} placeholder='Ссылка' />
				</div>
				<div className='recipe-field'>
					<label className='recipe-label' htmlFor="img">Прикрепить изображение</label>
					<input onChange={setImage} className='recipe-input' type="file" name='img' id='img' value='' />
				</div>
				<input onChange={setAnonymity} type="checkbox" id="authorship" name="authorship" />
				<label htmlFor="authorship">Скрыть мой Username на странице рецепта</label>
				<button type='button' className='dev' onClick={pushRecipe}>Push</button>
			</form>
			{pushResult && <PopUp text={pushResult} callback={() => { setPushResult('') }} />}
			{pushingError && <PopUp text={pushingError} callback={() => { setPushingError('') }} />}
			{isPushingRecipe && <Loader />}
		</div>
	);
};

export default RecipeForm;
