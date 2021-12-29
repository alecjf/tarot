import { nounify } from "../misc";

let opposites = [
	["yin", "yang"],
	["active", "passive"],
	["active", "yin"],
	["passive", "yang"],
	// no "departure" in cards:
	// ["arrival", "departure"],
	// no "attack" in cards:
	// ["attack", "defense"],
	["balance", "chaos"],
	["beginning", "ending"],
	["bravery", "fear"],
	["chaos", "serenity"],
	["cold", "warmth"],
	["conscious mind", "unconscious mind"],
	["control", "loss of control"],
	["decision", "indecision"],
	["drama", "peace"],
	["dream", "nightmare"],
	["enlightenment", "ignorance"],
	["expansion", "restriction"],
	["experience", "inexperience"],
	["failure", "success"],
	["faith", "loss of faith"],
	["gain", "loss"],
	["generosity", "selfishness"],
	["hope", "hopelessness"],
	["irrationality", "rationality"],
	["irresponsibility", "responsibility"],
	["joy", "dissatisfaction"],
	["justice", "unfairness"],
	["fairness", "unfairness"],
	["laziness", "work"],
	["masculinity", "femininity"],
	["maternal", "paternal"],
	["negative", "positive"],
	["physical conquest", "nonphysical conquest"],
	["optimism", "pessimism"],
	["pain", "pleasure"],
	["sleep", "sleeplessness"],
	["solitude", "relationship"],
	["strength", "weakness"],
	["struggle", "serenity"],
	["thrift", "waste"],
	["victory", "defeat"],
	["peace", "chaos"],
	["peace", "struggle"],
	["belief", "loss of faith"],
	["happiness", "sadness"],
	["accomplishment", "failure"],
	["action", "complacent"],
	["healthy", "weak"],
];

function updateOpposites(opposites) {
	return opposites
		.map((pair) => {
			const oppo1Nouns = nounify(pair[0]),
				oppo2Nouns = nounify(pair[1]);
			return oppo1Nouns
				.map((oppo1) => oppo2Nouns.map((oppo2) => [oppo1, oppo2]))
				.flat();
		})
		.flat();
}

opposites = updateOpposites(opposites);

const reverseWord = (word) =>
	opposites
		.filter((pair) => pair.includes(word))
		.map((pair) => (pair[0] === word ? pair[1] : pair[0]));

const reverseWords = (words) =>
	words
		.map((word) => nounify(word))
		.flat()
		.map((word) => reverseWord(word))
		.flat();

const flipUpright = (cardName) => cardName.replace(" reversed", "");

const reverseCard = (cardName) =>
	cardName.includes(" reversed")
		? flipUpright(cardName)
		: cardName + " reversed";

export default opposites;
export { flipUpright, reverseCard, reverseWord, reverseWords };
