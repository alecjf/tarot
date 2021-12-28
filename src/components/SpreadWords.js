import "../css/spread-words.css";
import React from "react";
import cards from "../scripts/data/cards";
import spreadWords from "../scripts/spread-words";
import CardButtons from "./CardButtons";

function SpreadWords({ cardNames, cardLinkHandler }) {
	const cardsInSpread = (cardNames) =>
			cards.filter((card) => cardNames.includes(card.name)),
		{ wordsInSpread, uniqueToCard, shared } = spreadWords(
			cardsInSpread(cardNames)
		);

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
									{word}
								</td>
								<td colSpan={2}>
									<CardButtons
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
									<td>{opposite.word}</td>
									<td>
										<CardButtons
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
			{!(shared.noOpposites.length + shared.withOpposites.length) ? (
				<>
					<p>No available comparisons.</p>
					<br />
				</>
			) : (
				<>
					{cardNames.length === 1 && !!uniqueToCard.length && (
						<>
							<h3 className="custom-header">
								Words Unique to Card
							</h3>
							<Words keys={uniqueToCard} />
						</>
					)}
					{!!shared.noOpposites.length && (
						<>
							<h3 className="custom-header">Shared Words</h3>
							<Words keys={shared.noOpposites} />
						</>
					)}
					{!!shared.withOpposites.length && (
						<>
							<h3 className="custom-header">Opposites</h3>
							<Words keys={shared.withOpposites} />
						</>
					)}
				</>
			)}
		</div>
	);
}

export default SpreadWords;
