const tg = window.Telegram.WebApp;

export function useTelegram() {
	const onToggleButton = () => {
		if (tg.MainButton.isVisible) {
			tg.MainButton.hide();
		} else {
			tg.MainButton.show();
		}
	}

	return {
		tg,
		onToggleButton
	}
}