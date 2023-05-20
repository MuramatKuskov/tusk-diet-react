exports.handler = async (req, res) => {
	try {
		console.log(req.body);
		return {
			statusCode: 200,
			body: JSON.stringify({ mes: 'Hello, World!' })
		}
	} catch (error) {
		console.log(error);
		return {
			statusCode: 500,
			body: JSON.stringify({ mes: error })
		}
	}
}