import words from "./data/parts-of-speech";

const getWordPart = (word, index) => {
	try {
		return words
			.filter((pair) => pair.includes(word))
			.map((pair) => pair[index])
			.filter(Boolean);
	} catch (err) {
		console.log(err, "'" + word + "' does not exist in any adj/noun pair!");
	}
};

const getAdjs = (word) => getWordPart(word, 0);

const getNouns = (word) => getWordPart(word, 1);

const nounify = (word) => [
	...new Set(
		words
			.filter((pair) => pair.includes(word))
			.map((pair) => pair[1] || word)
	),
];

const randomItem = (arr) => arr[~~(Math.random() * arr.length)];

const randomize = (a, b) => Math.random() - 0.5;

const randomizeSpeech = (arr) => arr.map((word) => randomPartOfSpeech(word));

function randomPartOfSpeech(word) {
	return (
		(~~(Math.random() * 2)
			? getAdjs(word).sort(randomize)[0]
			: getNouns(word).sort(randomize)[0]) || word
	);
}

export { nounify, randomItem, randomize, randomizeSpeech };
