import CardImage from "../CardImage";

function Cards({ cardNames, cardLinkHandler }) {
	return (
		<div id="cards">
			{cardNames.map((name) => (
				<div
					key={`card-image-${name}`}
					className="card-image-container"
				>
					<CardImage {...{ cardName: name, cardLinkHandler }} />
				</div>
			))}
		</div>
	);
}

export default Cards;
