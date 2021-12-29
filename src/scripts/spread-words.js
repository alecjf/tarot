import cards from "./data/cards";
import { cardSorter } from "./spread-data";
import { reverseWord } from "./data/opposites";

function spreadWordsData(spread) {
	const wordsInSpread = processSpread(spread);
	condenseSpread(wordsInSpread);
	return organizeSpread(wordsInSpread);
}

function processSpread(spread) {
	let wordsInSpread = {};
	spread.forEach(
		(card) =>
			(wordsInSpread = {
				...wordsInSpread,
				...processCard(card, spread.length === 1 ? cards : spread),
			})
	);
	return wordsInSpread;
}

function processCard(card, spread) {
	return processWords(card.words, spread);
}

function processWords(words, spread) {
	const result = {};
	words.forEach((word) => {
		const [addCards, addOpposites] = cardsAndOpposites(word, spread);
		result[word] = {
			cards: addCards,
			opposites: condenseOpposites(addOpposites),
		};
	});
	return condenseCard(result);
}

function cardsAndOpposites(word, spread) {
	const addCards = cardsWithWord(word, spread),
		addOpposites = reverseWord(word)
			.map((opposite) => ({
				word: opposite,
				cards: cardsWithWord(opposite, spread),
			}))
			.filter((info) => info.cards.length);
	return [addCards, addOpposites];
}

function cardsWithWord(word, spread) {
	return spread
		.filter((card) => card.words.includes(word))
		.map((card) => card.name)
		.sort(cardSorter);
}

function condenseOpposites(addOpposites) {
	const condensed = {};
	addOpposites.forEach((oppo1) => {
		const key = addOpposites
			.filter(
				(oppo2) =>
					JSON.stringify(oppo1.cards) === JSON.stringify(oppo2.cards)
			)
			.map((oppo2) => oppo2.word)
			.sort()
			.join(", ");
		condensed[key] = { word: key, cards: oppo1.cards };
	});
	return Object.values(condensed).sort((a, b) =>
		a.word.localeCompare(b.word)
	);
}

function condenseCard(result) {
	const condensed = {};
	Object.entries(result).forEach(([_, outerVal]) => {
		const key = Object.entries(result)
			.filter(
				([_, innerVal]) =>
					JSON.stringify(outerVal) === JSON.stringify(innerVal)
			)
			.map(([word]) => word)
			.sort()
			.join(", ");
		condensed[key] = outerVal;
	});
	return condensed;
}

function condenseSpread(wordsInSpread) {
	Object.entries(wordsInSpread).forEach(([word, val]) =>
		val.opposites.forEach(
			(oppo) => wordsInSpread[word] && delete wordsInSpread[oppo.word]
		)
	);
}

function organizeSpread(wordsInSpread) {
	const uniqueToCard = Object.entries(wordsInSpread)
			.filter(
				([_, value]) =>
					value.cards.length === 1 && !value.opposites.length
			)
			.map(([word]) => word),
		shared = Object.keys(wordsInSpread).filter(
			(word) => !uniqueToCard.includes(word)
		);
	return {
		wordsInSpread,
		uniqueToCard,
		shared: {
			withOpposites: shared.filter(
				(word) => wordsInSpread[word].opposites.length
			),
			noOpposites: shared.filter(
				(word) => !wordsInSpread[word].opposites.length
			),
		},
	};
}

function lookupWordData(word) {
	const result = processWords([word], cards);
	return organizeSpread(result);
}

export default spreadWordsData;
export { lookupWordData };
