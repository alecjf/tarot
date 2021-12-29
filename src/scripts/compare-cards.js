import cards from "./data/cards";
import { reverseWord, flipUpright } from "./data/opposites";
import { randomItem, randomize, randomizeSpeech } from "./misc";

function compareCards(spreadSize) {
	const spread = spreadRecursive(spreadSize),
		result = [];
	spread.forEach((cardPair, i) => {
		const prev = spread[i - 1];
		return (
			i % 2 &&
			result.push({
				cards: cardPair.cards,
				matching: [
					...randomizeSpeech(prev.matching),
					...randomizeSpeech(cardPair.matching),
				],
				opposites: [
					...prev.opposites.map((pair) => randomizeSpeech(pair)),
					...cardPair.opposites.map((pair) => randomizeSpeech(pair)),
				],
				others: [
					randomizeSpeech(prev.others),
					randomizeSpeech(cardPair.others),
				],
			})
		);
	});
	return result;
}

function spreadRecursive(spreadSize, cardsArr = cards, selected = []) {
	const selectedHelper = (key) => selected.map((sel) => sel[key]).flat(),
		selectedCards = [
			...new Set(
				selectedHelper("cards")
					.map((card) => [
						flipUpright(card.name),
						flipUpright(card.name) + " reversed",
					])
					.flat()
			),
		],
		selectedWords = [
			...selectedHelper("matching"),
			...selectedHelper("opposites").flat(),
			...selectedHelper("others").flat(),
		];

	// filter out existing words from all remaining cards
	cardsArr = [...cardsArr]
		.filter((card) => !selectedCards.includes(card.name))
		.map((card) => ({
			...card,
			words: card.words.filter((word) => !selectedWords.includes(word)),
		}))
		.filter((card) => card.words.length);

	if (selected.length && !cardsArr.length) {
		return spreadRecursive(spreadSize);
	}

	const { lastCard, nextCard } = lastAndNextCard(cardsArr, selected);

	const matching = matchingWords(lastCard, nextCard, selectedWords)
			.sort(randomize)
			.slice(0, 1),
		oppos = oppositeWords(lastCard, nextCard, [
			...selectedWords,
			...matching,
		])
			.sort(randomize)
			.slice(0, 1),
		compatible = twoCompatibleCards(lastCard, nextCard, [
			...selectedWords,
			...matching,
			...oppos.flat(),
		]);

	if (matching.length + oppos.length + compatible.length === 0) {
		return spreadRecursive(spreadSize);
	}

	selected.push({
		cards: [lastCard, nextCard],
		matching,
		opposites: oppos,
		others: compatible,
	});

	if (selected.length < (spreadSize - 1) * 2) {
		return spreadRecursive(spreadSize, cardsArr, selected);
	}

	return selected;
}

function lastAndNextCard(cardsArr, selected) {
	if (selected.length % 2) {
		const [lastCard, nextCard] = selected[selected.length - 1].cards;
		return { lastCard, nextCard };
	}
	const lastCard = selected.length
			? selected[selected.length - 1].cards[1]
			: randomItem(cardsArr),
		nextCard = selected.length
			? randomItem(cardsArr)
			: randomItem(
					cardsArr.filter((card) => card.name !== lastCard.name)
			  );
	return { lastCard, nextCard };
}

function matchingWords(card1, card2, selectedWords) {
	return card1.words
		.filter((word) => !selectedWords.includes(word))
		.filter((word) => card2.words.includes(word));
}

function oppositeWords(card1, card2, selectedWords) {
	const card1Words = card1.words.filter(
			(word) => !selectedWords.includes(word)
		),
		card2Words = card2.words.filter(
			(word) => !selectedWords.includes(word)
		);
	return card1Words
		.map((word) =>
			reverseWord(word)
				.filter((rev) => card2Words.includes(rev))
				.map((rev) => [word, rev])
		)
		.flat();
}

function twoCompatibleCards(card1, card2, selectedWords) {
	let result,
		randomHelper = (card) =>
			card.words
				.filter((word) => !selectedWords.includes(word))
				.sort(randomize),
		random1 = randomHelper(card1),
		random2 = randomHelper(card2);
	random1.find((w1) =>
		random2.find(
			(w2) => areCompatible(w1, w2, selectedWords) && (result = [w1, w2])
		)
	);
	return result || [];
}

const areCompatible = (word1, word2, selectedWords) =>
	word1 !== word2 && !selectedWords.includes(word2);

export default compareCards;
