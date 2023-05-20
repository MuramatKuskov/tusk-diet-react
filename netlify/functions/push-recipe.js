exports.handler = async (req, res) => {
	try {
		console.log(req.body); // {"recipe":{"title":"","ingredients":"","process":"","link":"","tags":""}}
		return {
			statusCode: 200,
			body: 'msg'
		}
	} catch (error) {
		console.log(error);
		return {
			statusCode: 500,
			body: JSON.stringify({ mes: error })
		}
	}
}