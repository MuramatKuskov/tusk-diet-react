import { useEffect, useState } from "react"

export const useFetching = (callback) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const fetching = async () => {
		let data;
		try {
			setIsLoading(true);
			data = await callback();
		} catch (e) {
			setError(e.message);
		} finally {
			setIsLoading(false);
		}
		return data;
	}
	return [fetching, isLoading, error, setError];
}