import React from "react";
import cards from "../scripts/data/cards";
import { flipUpright } from "../scripts/data/opposites";
import { randomItem } from "../scripts/misc";
import { cardSorter } from "../scripts/spread-data";
import CardButtons from "./CardButtons";
import CardImage from "./CardImage";
import SpreadWords from "./SpreadWords";

function CardLookup({ singleCard, cardLinkHandler }) {
	const card = cards.find((card) => card.name === singleCard),
		reverseCard = (cardName) =>
			cardName.includes(" reversed")
				? flipUpright(cardName)
				: cardName + " reversed";

	function AllCardsSelect() {
		return (
			<select
				key={`all-cards-select-${singleCard}`}
				onChange={(e) => cardLinkHandler(e.target.value)}
				defaultValue={singleCard}
			>
				{cards
					.map((card) => card.name)
					.sort(cardSorter)
					.map((cardName) => (
						<option key={`select-card-${cardName}`}>
							{cardName}
						</option>
					))}
			</select>
		);
	}

	function FlipCardButton() {
		return (
			<button
				className="flip-button"
				onClick={() => cardLinkHandler(reverseCard(singleCard))}
			>
				Flip
			</button>
		);
	}

	function RandomCardButton() {
		return (
			<button
				className="flip-button"
				onClick={() => cardLinkHandler(randomItem(cards).name)}
			>
				Random
			</button>
		);
	}

	return (
		<div id="card-lookup">
			<AllCardsSelect />
			<br />
			<br />
			<CardImage {...{ cardName: singleCard, cardLinkHandler }} />
			<br />
			<br />
			<FlipCardButton /> <RandomCardButton />
			<hr />
			{card.words.length ? (
				<SpreadWords
					{...{
						cardNames: [singleCard],
						cardLinkHandler,
					}}
				/>
			) : (
				<div id="no-words">
					<h3>
						No distinct words. Energy opposes{" "}
						<CardButtons
							{...{
								cardNames: [reverseCard(singleCard)],
								cardLinkHandler,
							}}
						/>
					</h3>
				</div>
			)}
		</div>
	);
}

export default CardLookup;
