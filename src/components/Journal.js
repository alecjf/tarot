import "../css/journal.css";
import { useEffect, useState } from "react/cjs/react.development";
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	updateDoc,
} from "firebase/firestore";
import firestore from "../scripts/cloud";
import CardButtons from "./CardButtons";

function Journal({ userID, cardLinkHandler }) {
	const [journal, setJournal] = useState(undefined);

	useEffect(() => {
		readJournal();
	}, []);

	async function readJournal() {
		const querySnapshot = await getDocs(
			collection(firestore, "User Spreads", userID, "Journal")
		);
		const result = [];
		// .map() doesn't work, but .forEach() does, so push onto result array:
		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			result.push([doc.id, doc.data()]);
		});
		result.length ? setJournal(result) : setJournal(undefined);
	}

	async function deletePhrase(date, cardNames, datePhrase) {
		const docRef = doc(firestore, "User Spreads", userID, "Journal", date),
			docSnap = await getDoc(docRef);
		console.log(`Deleting '${datePhrase}' from '${date}: ${cardNames}'`);
		const updates = {
			...docSnap.data().spreads,
		};
		updates[cardNames] = updates[cardNames].filter(
			(phrase) => phrase !== datePhrase
		);
		if (!updates[cardNames].length) {
			delete updates[cardNames];
		}
		if (Object.entries(updates).length) {
			// update saved phrases:
			await updateDoc(docRef, {
				spreads: updates,
			});
		} else {
			await deleteDoc(docRef);
		}
		readJournal();
	}

	const parseDateKey = (dateKey) =>
			+dateKey
				.split("-")
				.map((part) => part.padStart(2, "0"))
				.join(""),
		dateKeySorter = (a, b) => parseDateKey(b) - parseDateKey(a);

	return (
		<div id="journal">
			{journal ? (
				journal
					.sort((a, b) => {
						const [aKey] = a,
							[bKey] = b;
						return dateKeySorter(aKey, bKey);
					})
					.map(([date, dateSpreads]) => (
						<details
							key={`journal-entry-${date}`}
							className="journal-entry"
						>
							<summary className="journal-date custom-header">
								{date}
							</summary>
							<div className="date-spreads">
								{Object.entries(dateSpreads.spreads)
									.sort((a, b) => {
										const [aCardNames] = a,
											[bCardNames] = b;
										return aCardNames.localeCompare(
											bCardNames
										);
									})
									.map(([cardNames, datePhrases]) => (
										<details
											key={`${date}-date-spread-${cardNames}`}
											className="date-spread"
										>
											<summary className="journal-card-names">
												{cardNames}
											</summary>
											{datePhrases.map((datePhrase) => {
												let [line, pairNames] =
													datePhrase.split("(");
												pairNames = pairNames
													.replace(")", "")
													.split(", ");
												return (
													<p
														key={`${date}-date-spread-${cardNames}-${datePhrase}`}
													>
														{line} —{" "}
														<CardButtons
															{...{
																cardNames:
																	pairNames,
																cardLinkHandler,
																delim: ", ",
															}}
														/>
														<button
															className="remove-line-button"
															onClick={() =>
																deletePhrase(
																	date,
																	cardNames,
																	datePhrase
																)
															}
														>
															remove
														</button>
													</p>
												);
											})}
										</details>
									))}
							</div>
						</details>
					))
			) : (
				<>No journal entries.</>
			)}
		</div>
	);
}

export default Journal;
