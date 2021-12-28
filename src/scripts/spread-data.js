import cards from "./data/cards";
import { flipUpright } from "./data/opposites";

function cardSorter(a, b) {
	const [aRankIndex, aSuitIndex] = getRankAndSuitIndexes(a),
		[bRankIndex, bSuitIndex] = getRankAndSuitIndexes(b);
	return aRankIndex === bRankIndex
		? aSuitIndex - bSuitIndex
		: aRankIndex - bRankIndex;
}

function getRankAndSuitIndexes(cardName) {
	cardName = cardName.replace(" reversed", "");
	return majors.includes(cardName)
		? [majors.indexOf(cardName) - majors.length]
		: cardName
				.split(" of ")
				.map((part, i) => (i ? suits : ranks).indexOf(part));
}

function histogram(cardNames) {
	const result = {
			arcana: {
				majors: 0,
			},
			position: {
				reversed: 0,
			},
			people: {
				courts: 0,
			},
		},
		size = cardNames.length;
	cardNames.forEach((name) => {
		majors.includes(flipUpright(name)) && result.arcana.majors++;
		name.includes(" reversed") && result.position.reversed++;
		courts.includes(name.split(" ")[0]) && result.people.courts++;
	});
	result.arcana.minors = size - result.arcana.majors;
	result.position.upright = size - result.position.reversed;
	result.people.others = size - result.people.courts;
	return result;
}

function sortCountedEntries(cardNames, isRanks) {
	const counts = counter(cardNames, isRanks);
	return Object.entries(counts).sort((a, b) => {
		const [aKey] = a,
			[bKey] = b,
			arr = isRanks ? ranks : suits;
		return arr.indexOf(aKey) - arr.indexOf(bKey);
	});
}

function counter(cardNames, isRanks) {
	const result = {},
		arr = isRanks ? ranks : suits;
	arr.forEach((item) => (result[item] = 0));
	cardNames
		.filter((name) => !majors.includes(flipUpright(name)))
		.map((name) => flipUpright(name).split(" of ")[isRanks ? 0 : 1])
		.filter((firstPart) => arr.includes(firstPart))
		.forEach((firstPart) => {
			result[firstPart]++;
		});
	return result;
}

function commonWords(isRanks) {
	const result = {};
	(isRanks ? ranks : suits).forEach(
		(item) => (result[item] = commonWordsHelper(item, isRanks))
	);
	return result;
}

function commonWordsHelper(item, isRanks) {
	const common = cards
			.filter(
				(card) =>
					card.name.includes(item) && !card.name.includes(" reversed")
			)
			.map((card) => card.words)
			.flat(),
		result = {};
	common.forEach((word) =>
		result[word] ? result[word]++ : (result[word] = 1)
	);
	return Object.entries(result)
		.filter(([key, value]) => value === 4)
		.map(([key, value]) => key);
}

const courts = ["Page", "Knight", "Queen", "King"],
	ranks = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", ...courts],
	suits = ["Wands", "Cups", "Swords", "Pentacles"],
	rankWords = commonWords(true),
	suitWords = commonWords(false),
	majors = [
		"Fool",
		"Magician",
		"High Priestess",
		"Empress",
		"Emperor",
		"Hierophant",
		"Lovers",
		"Chariot",
		"Strength",
		"Hermit",
		"Wheel of Fortune",
		"Justice",
		"Hanged Man",
		"Death",
		"Temperance",
		"Devil",
		"Tower",
		"Star",
		"Moon",
		"Sun",
		"Judgement",
		"World",
	];

export {
	cardSorter,
	histogram,
	sortCountedEntries,
	courts,
	majors,
	ranks,
	rankWords,
	suits,
	suitWords,
};
