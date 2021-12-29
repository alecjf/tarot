function ButtonWords({ words, wordLinkHandler }) {
	const result = words
		.map((word) => [
			<button
				key={`word-button-${word}`}
				className="word-button"
				onClick={() => wordLinkHandler(word)}
			>
				{word}
			</button>,
			", ",
		])
		.flat();
	result.pop();
	return result;
}

export default ButtonWords;
