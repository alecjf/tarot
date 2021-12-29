import { flipUpright } from "../scripts/data/opposites";

function CardImage({ cardName, cardLinkHandler }) {
	return (
		<img
			src={`https://fern.haus/images/tarot/${
				cardName ? flipUpright(cardName) : "blank"
			}.jpg`}
			alt={cardName || "blank card"}
			className={cardName?.includes(" reversed") ? "reversed" : ""}
			onClick={() => cardName && cardLinkHandler(cardName)}
		/>
	);
}

export default CardImage;
