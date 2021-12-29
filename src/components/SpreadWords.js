import "../css/spread-words.css";
import React from "react";
import spreadWordsData, { lookupWordData } from "../scripts/spread-words";
import cards from "../scripts/data/cards";
import ButtonCards from "./ButtonCards";
import ButtonWords from "./ButtonWords";

function SpreadWords({
	cardNames,
	cardLinkHandler,
	wordLinkHandler,
	lookupWord,
}) {
	const cardsInSpread = (cardNames) =>
			cards.filter((card) => cardNames.includes(card.name)),
		compare = lookupWord
			? lookupWordData(lookupWord)
			: spreadWordsData(cardsInSpread(cardNames)),
		{ wordsInSpread, uniqueToCard, shared } = compare;

	function Words({ keys }) {
		return (
			<table>
				<tbody>
					{keys.sort().map((word) => (
						<React.Fragment key={`word-rows-${word}`}>
							<tr>
								<td
									rowSpan={
										wordsInSpread[word].opposites.length + 1
									}
								>
									<ButtonWords
										{...{
											words: word.split(", "),
											wordLinkHandler,
										}}
									/>
								</td>
								<td colSpan={2}>
									<ButtonCards
										{...{
											cardNames:
												wordsInSpread[word].cards,
											cardLinkHandler,
											delim: " | ",
										}}
									/>
								</td>
							</tr>
							{wordsInSpread[word].opposites.map((opposite) => (
								<tr
									key={`opposite-${word}-${opposite.word}`}
									className="opposite-row"
								>
									<td>
										<ButtonWords
											{...{
												words: opposite.word.split(
													", "
												),
												wordLinkHandler,
											}}
										/>
									</td>
									<td>
										<ButtonCards
											{...{
												cardNames: opposite.cards,
												cardLinkHandler,
											}}
										/>
									</td>
								</tr>
							))}
						</React.Fragment>
					))}
				</tbody>
			</table>
		);
	}

	return (
		<div className="spread-words">
			{!lookupWord &&
			!(shared.noOpposites.length + shared.withOpposites.length) ? (
				<>
					<p>No available comparisons.</p>
					<br />
				</>
			) : (
				<>
					{(lookupWord || cardNames.length === 1) &&
						!!uniqueToCard.length && (
							<>
								{!lookupWord && (
									<h3 className="custom-header">
										Words Unique to Card
									</h3>
								)}
								<Words keys={uniqueToCard} />
							</>
						)}
					{!!shared.noOpposites.length && (
						<>
							{!lookupWord && (
								<h3 className="custom-header">Shared Words</h3>
							)}
							<Words keys={shared.noOpposites} />
						</>
					)}
					{!!shared.withOpposites.length && (
						<>
							{!lookupWord && (
								<h3 className="custom-header">Opposites</h3>
							)}
							<Words keys={shared.withOpposites} />
						</>
					)}
				</>
			)}
		</div>
	);
}

export default SpreadWords;
