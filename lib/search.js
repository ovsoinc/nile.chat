module.exports = {
	chunkify(text) {
		text = text
			.trim()
			.toLowerCase();

		const chunks = [];

		for(let i = 0; i <= text.length - 3; i++) {
			chunks.push(text.slice(i, i + 3));
		}

		return chunks;
	}
};
