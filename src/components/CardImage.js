import { flipUpright } from "../scripts/data/opposites";

function CardImage({ cardName, cardLinkHandler }) {
	return (
		<img
			src={`https://fern.haus/images/tarot/${flipUpright(cardName)}.jpg`}
			alt={cardName}
			className={cardName.includes(" reversed") ? "reversed" : ""}
			onClick={() => cardLinkHandler(cardName)}
		/>
	);
}

export default CardImage;
