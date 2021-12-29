function ButtonCards({ cardNames, cardLinkHandler, delim }) {
	const result = cardNames
		.map((cardName) => [
			<button
				className="card-button custom-header"
				key={`card-button-${cardName}`}
				onClick={() => cardLinkHandler(cardName)}
			>
				{cardName}
			</button>,
			delim,
		])
		.flat();
	result.pop();
	return result;
}

export default ButtonCards;
