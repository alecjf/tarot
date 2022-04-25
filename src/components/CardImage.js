import { flipUpright } from "../scripts/data/opposites";

function CardImage({ cardName, cardLinkHandler }) {
    return (
        <img
            src={`https://fern.haus/images/tarot/${
                cardName
                    ? (cardName.includes(" reversed")
                          ? "reversed/"
                          : "upright/") + flipUpright(cardName)
                    : "blank"
            }.jpg`}
            alt={cardName || "blank card"}
            onClick={() => cardName && cardLinkHandler(cardName)}
        />
    );
}

export default CardImage;
