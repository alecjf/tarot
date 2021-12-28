import "../css/daily-stats.css";
import cards from "./data/cards";
import { nounify } from "./misc";
import { collection, getDocs } from "firebase/firestore";
import firestore from "./cloud";

async function processDailyReadings(userID) {
	const dailyReadings = await getAllDailyReadings(userID),
		cardFreq = {},
		wordFreq = {};

	let totalCards = 0,
		totalWords = 0;

	cards.forEach((card) => (cardFreq[card.name] = 0));

	[...new Set(cards.map((card) => card.words).flat())].forEach(
		(word) => (wordFreq[word] = 0)
	);

	dailyReadings
		// no duplicates within same spread; use Set:
		.map((spread) => [...new Set(spread.map((pair) => pair.cards).flat())])
		.flat()
		.forEach((cardName) => {
			cardFreq[cardName]++;
			totalCards++;
		});

	dailyReadings
		.map((spread) => spread.map((pair) => pair.funcs).flat())
		.flat()
		.map((func) => Object.values(func.pos).flat())
		.flat()
		.forEach((word) =>
			nounify(word).forEach((noun) => {
				wordFreq[noun]++;
				totalWords++;
			})
		);

	return { cardFreq, wordFreq, totalCards, totalWords };
}

async function getAllDailyReadings(userID) {
	const querySnapshot = await getDocs(
		collection(firestore, "User Spreads", userID, "Daily Spreads")
	);
	const result = [];
	// .map() doesn't work, but .forEach() does, so push onto result array:
	querySnapshot.forEach((doc) => {
		// doc.data() is never undefined for query doc snapshots
		result.push(doc.data().spread);
	});
	return result;
}

export default processDailyReadings;
