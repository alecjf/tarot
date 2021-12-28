import words from "./data/parts-of-speech";
import compareCards from "./compare-cards";
import { courts } from "./spread-data";

function phrasesData(spreadSize) {
	return compareCards(spreadSize).map((comparison) =>
		phrasesDataSingle(comparison)
	);
}

function phrasesDataSingle(comparison) {
	const { cards, matching, opposites, others } = comparison,
		cardNames = cards.map((card) => card.name),
		people = peopleHelper(cardNames),
		single = (key, words) =>
			words.length &&
			phrasesDataSingleHelper(
				key,
				people,
				detectPartsOfSpeech([words[0]].flat())
			),
		singleMatch = single("matching", matching),
		singleOpposite = single("opposites", opposites),
		singleOther = single("others", others);
	let result = [];
	if (matching.length >= 2 && !opposites.length) {
		result = getPhrasesForArr(matching, "matching", people);
	} else if (opposites.length >= 2 && !matching.length) {
		result = getPhrasesForArr(opposites, "opposites", people);
	} else if (!matching.length && !opposites.length) {
		result = getPhrasesForArr(others, "others", people);
	} else if (matching.length && opposites.length) {
		result = [singleMatch, singleOpposite];
	} else if (matching.length || opposites.length) {
		result = [
			matching.length ? singleMatch : singleOpposite,
			singleOther,
		].filter(Boolean);
	}
	return { cards: cardNames, funcs: result };
}

function phrasesDataSingleHelper(key, people, pos) {
	return {
		key:
			key +
			people.length +
			"People" +
			Object.entries(pos)
				.map(([key, value]) => value.map((val) => key))
				.flat()
				.join(""),
		pos,
		people,
	};
}

function detectPartsOfSpeech(words) {
	const result = { Adj: [], Noun: [] };
	words.forEach((word) => result[isAdj(word) ? "Adj" : "Noun"].push(word));
	return result;
}

const isAdj = (word) => words.find((pair) => pair.includes(word))?.[0] === word;

function peopleHelper(cardNames) {
	const people = cardNames
		.map((name) => name.split(" ")[0])
		.filter((part) => courts.includes(part))
		.map((court) => {
			switch (court) {
				case courts[0]:
					return "young soul";
				case courts[1]:
					return "energetic spirit";
				case courts[2]:
					return "strong spirit";
				case courts[3]:
					return "wise soul";
				default:
					return false;
			}
		})
		.filter(Boolean);
	return people;
}

const getPhrasesForArr = (arr, key, people) =>
	arr.map((item) =>
		phrasesDataSingleHelper(key, people, detectPartsOfSpeech([item].flat()))
	);

export default phrasesData;
