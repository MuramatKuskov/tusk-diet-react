import React from 'react';
import * as Toolbar from "@radix-ui/react-toolbar";
import * as Select from "@radix-ui/react-select";
import * as Tooltip from "@radix-ui/react-tooltip";
import './Toolbar.css';

const TypeSelect = ({ selectedType, updateQuery }) => {
	const handleSelect = (value) => {
		if (selectedType === value) return;
		return updateQuery({ type: value });
	}

	return (
		<Select.Root defaultValue="all" onValueChange={handleSelect}>
			<Select.Trigger className="SelectTrigger" aria-label="Type">
				<Select.Value placeholder="Type" />
			</Select.Trigger>
			<Select.Portal>
				<Select.Content className="SelectContent" position="popper">
					<Select.ScrollUpButton className="SelectScrollButton" />
					<Select.Viewport className="SelectViewport">
						<Select.Group>
							<Select.Item value="all" className="SelectItem">
								<Select.ItemText>Все</Select.ItemText>
								<Select.ItemIndicator className="SelectItemIndicator">
									<img src="assets/check-ico.svg" alt="icon" />
								</Select.ItemIndicator>
							</Select.Item>
							<Select.Item value="main" className="SelectItem">Основные блюда</Select.Item>
							<Select.Item value="garnish" className="SelectItem">
								<Select.ItemText>Гарниры</Select.ItemText>
								<Select.ItemIndicator className="SelectItemIndicator">
									<img src="assets/check-ico.svg" alt="icon" />
								</Select.ItemIndicator>
							</Select.Item>
							<Select.Item value="soup" className="SelectItem">
								<Select.ItemText>Супы</Select.ItemText>
								<Select.ItemIndicator className="SelectItemIndicator">
									<img src="assets/check-ico.svg" alt="icon" />
								</Select.ItemIndicator>
							</Select.Item>
							<Select.Item value="snack" className="SelectItem">
								<Select.ItemText>Закуски</Select.ItemText>
								<Select.ItemIndicator className="SelectItemIndicator">
									<img src="assets/check-ico.svg" alt="icon" />
								</Select.ItemIndicator>
							</Select.Item>
							<Select.Item value="salad" className="SelectItem">
								<Select.ItemText>Салаты</Select.ItemText>
								<Select.ItemIndicator className="SelectItemIndicator">
									<img src="assets/check-ico.svg" alt="icon" />
								</Select.ItemIndicator>
							</Select.Item>
							<Select.Item value="bakery" className="SelectItem">
								<Select.ItemText>Выпечка</Select.ItemText>
								<Select.ItemIndicator className="SelectItemIndicator">
									<img src="assets/check-ico.svg" alt="icon" />
								</Select.ItemIndicator>
							</Select.Item>
							<Select.Item value="dessert" className="SelectItem">
								<Select.ItemText>Десерты</Select.ItemText>
								<Select.ItemIndicator className="SelectItemIndicator">
									<img src="assets/check-ico.svg" alt="icon" />
								</Select.ItemIndicator>
							</Select.Item>
							<Select.Item value="drink" className="SelectItem">
								<Select.ItemText>Напитки</Select.ItemText>
								<Select.ItemIndicator className="SelectItemIndicator">
									<img src="assets/check-ico.svg" alt="icon" />
								</Select.ItemIndicator>
							</Select.Item>
							<Select.Item value="sauce" className="SelectItem">
								<Select.ItemText>Соусы</Select.ItemText>
								<Select.ItemIndicator className="SelectItemIndicator">
									<img src="assets/check-ico.svg" alt="icon" />
								</Select.ItemIndicator>
							</Select.Item>
							<Select.Item value="other" className="SelectItem">
								<Select.ItemText>Другое</Select.ItemText>
								<Select.ItemIndicator className="SelectItemIndicator">
									<img src="assets/check-ico.svg" alt="icon" />
								</Select.ItemIndicator>
							</Select.Item>
						</Select.Group>
					</Select.Viewport>
					<Select.ScrollDownButton className="SelectScrollButton" />
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	);
}

const ListSelector = ({ handleProductList }) => {
	return (
		<Toolbar.ToggleGroup type="multiple" defaultValue={["storage"]} onValueChange={handleProductList} aria-label="Products source">

			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger asChild>
						<Toolbar.ToggleItem className="ToolbarToggleItem" value="storage" aria-label="Storage">
							<img src="assets/storage.svg" alt="icon" />
						</Toolbar.ToggleItem>
					</Tooltip.Trigger>
					<Tooltip.Portal>
						<Tooltip.Content className="TooltipContent" sideOffset={5}>
							Мои продукты
							<Tooltip.Arrow className="TooltipArrow" />
						</Tooltip.Content>
					</Tooltip.Portal>
				</Tooltip.Root>
			</Tooltip.Provider>

			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger asChild>
						<Toolbar.ToggleItem className="ToolbarToggleItem" value="cart" aria-label="Shopping Cart">
							<img src="assets/shopping-cart.svg" alt="icon" style={{ width: "15px" }} />
						</Toolbar.ToggleItem>
					</Tooltip.Trigger>
					<Tooltip.Portal>
						<Tooltip.Content className="TooltipContent" sideOffset={5}>
							Список покупок
							<Tooltip.Arrow className="TooltipArrow" />
						</Tooltip.Content>
					</Tooltip.Portal>
				</Tooltip.Root>
			</Tooltip.Provider>

			{/* <Toolbar.ToggleItem className="ToolbarToggleItem" value="favourite" aria-label="Favourite"></Toolbar.ToggleItem> */}
		</Toolbar.ToggleGroup>
	)
}

const ToolbarComponent = ({ query, updateQuery, handleProductList }) => {
	function setSearchMode(mode) {
		if (!mode) return;
		updateQuery({ mode: mode });
	}

	return (
		<Toolbar.Root className="ToolbarRoot" aria-label="Recommendation parameters">
			{!handleProductList ||
				<>
					<ListSelector handleProductList={handleProductList} />
					<Toolbar.Separator className="ToolbarSeparator" />
				</>}
			<Toolbar.ToggleGroup type="single" aria-label="Search mode" defaultValue="discovery" onValueChange={setSearchMode}>

				<Tooltip.Provider>
					<Tooltip.Root>
						<Tooltip.Trigger asChild>
							<Toolbar.ToggleItem className="ToolbarToggleItem" value="discovery" aria-label="Discovery">
								<img src="assets/globe.svg" alt="icon" />
							</Toolbar.ToggleItem>
						</Tooltip.Trigger>
						<Tooltip.Portal>
							<Tooltip.Content className="TooltipContent" sideOffset={5}>
								Открытия
								<Tooltip.Arrow className="TooltipArrow" />
							</Tooltip.Content>
						</Tooltip.Portal>
					</Tooltip.Root>
				</Tooltip.Provider>

				<Tooltip.Provider>
					<Tooltip.Root>
						<Tooltip.Trigger asChild>
							<Toolbar.ToggleItem className="ToolbarToggleItem" value="accessible" aria-label="Accessible">
								<img src="assets/rocket.svg" alt="icon" />
							</Toolbar.ToggleItem>
						</Tooltip.Trigger>
						<Tooltip.Portal>
							<Tooltip.Content className="TooltipContent" sideOffset={5}>
								Доступные
								<Tooltip.Arrow className="TooltipArrow" />
							</Tooltip.Content>
						</Tooltip.Portal>
					</Tooltip.Root>
				</Tooltip.Provider>

				<Tooltip.Provider>
					<Tooltip.Root>
						<Tooltip.Trigger asChild>
							<Toolbar.ToggleItem className="ToolbarToggleItem" value="precise" aria-label="Precise">
								<img src="assets/mag-glass.svg" alt="icon" />
							</Toolbar.ToggleItem>
						</Tooltip.Trigger>
						<Tooltip.Portal>
							<Tooltip.Content className="TooltipContent" sideOffset={5}>
								Точное совпадение
								<Tooltip.Arrow className="TooltipArrow" />
							</Tooltip.Content>
						</Tooltip.Portal>
					</Tooltip.Root>
				</Tooltip.Provider>

				<Tooltip.Provider>
					<Tooltip.Root>
						<Tooltip.Trigger asChild>
							<Toolbar.ToggleItem className="ToolbarToggleItem" value="backboned" aria-label="Backboned">
								<img src="assets/cube.svg" alt="icon" />
							</Toolbar.ToggleItem>
						</Tooltip.Trigger>
						<Tooltip.Portal>
							<Tooltip.Content className="TooltipContent" sideOffset={5}>
								Точное совпадение+
								<Tooltip.Arrow className="TooltipArrow" />
							</Tooltip.Content>
						</Tooltip.Portal>
					</Tooltip.Root>
				</Tooltip.Provider>

			</Toolbar.ToggleGroup>
			<Toolbar.Separator className="ToolbarSeparator" />
			<TypeSelect selectedType={query.type || "all"} updateQuery={updateQuery} />
		</Toolbar.Root>
	);
};

export default ToolbarComponent;