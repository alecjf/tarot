import React, { useMemo } from "react";
import cards from "../scripts/data/cards";
import { reverseCard } from "../scripts/data/opposites";
import { randomItem } from "../scripts/misc";
import { cardSorter } from "../scripts/spread-data";
import CardButtons from "./ButtonCards";
import CardImage from "./CardImage";
import SpreadWords from "./SpreadWords";

function LookupCard({ lookupCard, cardLinkHandler, wordLinkHandler }) {
	const card = cards.find((card) => card.name === lookupCard);

	function AllCardsSelect() {
		return (
			<select
				key={`all-cards-select-${lookupCard}`}
				onChange={(e) => cardLinkHandler(e.target.value)}
				defaultValue={lookupCard}
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
				onClick={() => cardLinkHandler(reverseCard(lookupCard))}
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

	const selectCard = useMemo(() => <AllCardsSelect />, []);

	return (
		<div id="lookup-card">
			{selectCard}
			<br />
			<br />
			<CardImage {...{ cardName: lookupCard, cardLinkHandler }} />
			<br />
			<br />
			<FlipCardButton /> <RandomCardButton />
			<hr />
			{card.words.length ? (
				<SpreadWords
					{...{
						cardNames: [lookupCard],
						cardLinkHandler,
						wordLinkHandler,
					}}
				/>
			) : (
				<div id="no-words">
					<h3>
						No distinct words. Energy opposes{" "}
						<CardButtons
							{...{
								cardNames: [reverseCard(lookupCard)],
								cardLinkHandler,
							}}
						/>
					</h3>
				</div>
			)}
		</div>
	);
}

export default LookupCard;
