import React from "react";
import { dateFormatter, writeInJournal } from "../../scripts/cloud";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import firestore from "../../scripts/cloud";
import ButtonWords from "../ButtonWords";

const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	],
	dateHeader = (date) =>
		`${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

function Lines({
	phrases,
	SpreadSize,
	view,
	userID,
	cardNames,
	cardLinkHandler,
	wordLinkHandler,
	DrawingStatus,
}) {
	async function journalHandler(e, pair) {
		const docRef = doc(
				firestore,
				"User Spreads",
				userID,
				"Journal",
				dateFormatter(new Date())
			),
			docSnap = await getDoc(docRef),
			add = e.target.innerHTML + ` (${pair.join(", ")})`;
		if (docSnap.exists()) {
			console.log("Journal Day Exists");
			const updates = {
					...docSnap.data().spreads,
				},
				key = cardNames.join(", ");
			updates[key] = updates[key]
				? [...new Set([...updates[key], add])]
				: [add];
			// update saved phrases:
			await updateDoc(docRef, {
				spreads: updates,
			});
		} else {
			// doc.data() will be undefined in this case
			console.log("No such journal day!");
			const addSpread = {};
			addSpread[cardNames.join(", ")] = [add];
			writeInJournal({
				userID: userID,
				date: new Date(),
				spreads: addSpread,
			});
		}
	}

	return (
		<div id="lines">
			<div id="header">
				{view === "custom-spread" ? (
					<>
						<SpreadSize {...{ phrases }} />
						<DrawingStatus />
					</>
				) : (
					<h2 className="custom-header">
						Your Daily Spread For {dateHeader(new Date())}
					</h2>
				)}
			</div>
			{phrases.map((cardPair) => {
				const key = cardPair.cards.join(" - ");
				return (
					<div key={key} className="lines-item">
						{cardPair.cards.map((card) => (
							<div
								key={`${key} ${card} header`}
								className="card-name custom-header dark"
								onClick={() => cardLinkHandler(card)}
							>
								{card}
							</div>
						))}
						<div className="phrases">
							{cardPair.funcs.map((func, i) => (
								<p key={`${key} phrases ${func.key} ${i}`}>
									<b>Phrase Function:</b>{" "}
									<button
										onClick={(e) =>
											journalHandler(e, cardPair.cards)
										}
									>
										{func.key}
									</button>
									<br />
									<b>Adjectives:</b>{" "}
									<ButtonWords
										{...{
											words: func.pos.Adj,
											wordLinkHandler,
										}}
									/>
									<br />
									<b>Nouns:</b>{" "}
									<ButtonWords
										{...{
											words: func.pos.Noun,
											wordLinkHandler,
										}}
									/>
									<br />
									<b>People:</b> {func.people.join(", ")}
									<br />
								</p>
							))}
						</div>
					</div>
				);
			})}
			<div id="footer">
				<h1 className="custom-header">Spread Data</h1>
			</div>
		</div>
	);
}

export default Lines;
