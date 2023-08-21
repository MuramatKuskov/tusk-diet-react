import React from 'react';
import './Roadmap.css';

const Roadmap = () => {
	const features = [
		{ id: "roadmap", title: "Создать дорожную карту", description: "Определить функционал, который необходимо разработать, и примерную очередность его реализации", isDone: true },
		{ id: "core-chat", title: "Основной чат-функционал", description: "Поиск, добавление и прочие манипуляции с рецептами и приложением через чат с ботом", isDone: false },
		{ id: "web-app", title: "Веб-приложение", description: "Веб-интерфейс с расширенными возможностями для более комфортного пользования приложением", isDone: true },
		{ id: "advanced-chat", title: "Расширенный чат-функционал", description: "Возможность пользоваться приложением в любом месте благодаря поддержке inline режима", isDone: false },
		{ id: "advanced-search", title: "Расширенные возможности поиска", description: "Исключение из выдачи рецептов, содержащих указанные продукты; поиск по дополнительным критериям, сортировки", isDone: false },
		{ id: "more-info", title: "Больше сведений о рецептах", description: "Узнайте, к какой кухне мира принадлежит рецепт; подсчет КБЖУ; сложность блюда", isDone: false },
		{ id: "cart", title: "Список покупок", description: "Добавляйте недостающие продукты в список покупок прямо во время просмотра рецепта", isDone: false },
		{ id: "social", title: "Повышение взаимодействия с пользователями", description: "Подписки и профили пользователей; комментарии и рейтинги рецептов", isDone: false },
	]
	return (
		<div className='page page-roadmap'>
			{features.map((element, index) => {
				return <section className={element.isDone ? "roadmap-feature roadmap-feature-done" : "roadmap-feature"} key={index}>
					<div className="roadmap-info">
						<h2 className="roadmap-title">{element.title}</h2>
						<p className="roadmap-description">{element.description}</p>
					</div>
					<div className='roadmap-image-container'><div className="roadmap-image" id={element.id}></div></div>
				</section>
			})}
		</div>
	);
};

export default Roadmap;