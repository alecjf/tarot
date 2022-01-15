const paths = {
	"1-2": {
		luria: "heh",
		gra: "heh",
		kircher: "aleph",
	},
	"1-3": {
		luria: "vav",
		gra: "vav",
		kircher: "beth",
	},
	"1-6": {
		luria: "daleth",
		gra: "beth",
		kircher: "gimmel",
	},
	"2-3": {
		luria: "shin",
		gra: "shin",
		kircher: "daleth",
	},
	"2-4": {
		luria: "beth",
		gra: "gimmel",
		kircher: "vav",
	},
	"2-5": {
		luria: "zain",
	},
	"2-6": {
		luria: "teth",
		gra: "zain",
		kircher: "heh",
	},
	"3-4": {
		luria: "qof",
	},
	"3-5": {
		luria: "gimmel",
		gra: "daleth",
		kircher: "chet",
	},
	"3-6": {
		luria: "ayin",
		gra: "chet",
		kircher: "zain",
	},
	"4-5": {
		luria: "aleph",
		gra: "aleph",
		kircher: "teth",
	},
	"4-6": {
		luria: "chet",
		gra: "teth",
		kircher: "yod",
	},
	"4-7": {
		luria: "kaph",
		gra: "kaph",
		kircher: "kaph",
	},
	"5-6": {
		luria: "tzaddi",
		gra: "yod",
		kircher: "lamed",
	},
	"5-8": {
		luria: "peh",
		gra: "peh",
		kircher: "mem",
	},
	"6-7": {
		luria: "yod",
		kircher: "nun",
	},
	"6-8": {
		luria: "samekh",
		kircher: "ayin",
	},
	"6-9": {
		luria: "resh",
		gra: "resh",
		kircher: "samekh",
	},
	"7-8": {
		luria: "mem",
		gra: "mem",
		kircher: "peh",
	},
	"7-9": {
		luria: "nun",
		gra: "samekh",
		kircher: "tzaddi",
	},
	"8-9": {
		luria: "lamed",
		gra: "ayin",
		kircher: "resh",
	},
	"9-10": {
		luria: "tav",
		gra: "tav",
		kircher: "tav",
	},
	"4-9": {
		gra: "lamed",
	},
	"5-9": {
		gra: "nun",
	},
	"7-10": {
		gra: "tzaddi",
		kircher: "qof",
	},
	"8-10": {
		gra: "qof",
		kircher: "shin",
	},
};

const majors = {
	Fool: "aleph",
	Magician: "beth",
	"High Priestess": "gimmel",
	Empress: "daleth",
	Emperor: "heh",
	Hierophant: "vav",
	Lovers: "zain",
	Chariot: "chet",
	Strength: "teth",
	Hermit: "yod",
	"Wheel of Fortune": "kaph",
	Justice: "lamed",
	"Hanged Man": "mem",
	Death: "nun",
	Temperance: "samekh",
	Devil: "ayin",
	Tower: "peh",
	Star: "tzaddi",
	Moon: "qof",
	Sun: "resh",
	Judgement: "shin",
	World: "tav",
};

function spreadPaths(spread) {
	const result = {};
	for (const spreadPaths of [majorPaths(spread), minorPaths(spread)]) {
		for (const [path, cards] of Object.entries(spreadPaths)) {
			if (!paths[path]) {
				continue;
			}
			!result[path]
				? (result[path] = {
						trees: paths[path],
						cards,
				  })
				: (result[path].cards = [...result[path].cards, ...cards]);
		}
	}
	highlightPaths(result, spread.length === 1 && spread[0]);
	return result;
}

const majorCards = Object.keys(majors),
	minorsOnly = (spread) =>
		spread.filter((card) => !majorCards.includes(card)),
	majorsOnly = (spread) => spread.filter((card) => majorCards.includes(card));

function majorPaths(spread) {
	const result = {};
	majorsOnly(spread).forEach((major) => {
		majorPathsHelper(major).forEach(([path, trees]) => {
			const appliesTo = Object.entries(trees)
				.filter(([tree, letter]) => letter === majors[major])
				.map(([tree]) => tree);
			!result[path] && (result[path] = []);
			result[path] = [
				...result[path],
				[
					`${major}${
						appliesTo.length < 3
							? ` ("${
									majors[major]
							  }" applies only to ${appliesTo.join(", ")})`
							: ""
					}`,
				],
			];
		});
	});
	return result;
}

const majorPathsHelper = (major) =>
	Object.entries(paths).filter(([_, trees]) =>
		Object.values(trees).includes(majors[major])
	);

function minorPaths(spread) {
	const result = {};
	minorsOnly(spread)
		.map((minor, _, a) =>
			a
				.filter((m) => m !== minor)
				.forEach((m) => {
					const pair = [m, minor].sort(
							(a, b) => getMinorSef(a) - getMinorSef(b)
						),
						path = minorPath(pair);
					if (!path) {
						return;
					} else {
						!result[path] && (result[path] = []);
					}
					if (
						result[path]
							.map((p) => p.join(" - "))
							.includes(pair.join(" - "))
					) {
						return;
					}
					result[path] = [...result[path], pair];
				})
		)
		.flat();
	return result;
}

// must be sorted - see allMinorPairs() and the sort function
function minorPath(minorPair) {
	const pair = [...new Set(minorPair.map((minor) => getMinorSef(minor)))];
	return pair.length === 1
		? null
		: minorPair.map((minor) => getMinorSef(minor)).join("-");
}

function getMinorSef(minor) {
	const rank = minor.split(" ")[0];
	switch (rank) {
		case "Ace":
			return 1;
		case "Page":
			return 10;
		case "Knight":
			return 6;
		case "Queen":
			return 3;
		case "King":
			return 2;
		default:
			return +rank;
	}
}

function highlightPaths(pathsData, singleMajor) {
	["luria", "gra", "kircher"].forEach((tree) =>
		[...document.getElementsByClassName(tree)].forEach((t) =>
			singleMajor
				? [...t.getElementsByClassName(majors[singleMajor])].forEach(
						(elem) => (elem.style.opacity = 1)
				  )
				: Object.entries(pathsData).forEach(([path, value]) =>
						[
							...t.getElementsByClassName(paths[path][tree]),
						].forEach((elem) => {
							// don't highlight majors on trees that don't apply:
							const majorsNotOnTree = value.cards
									.flat()
									.filter((card) => card.includes(" ("))
									.map((card) =>
										card
											.split(" (")[0]
											.replace(" reversed", "")
									)
									.map((major) =>
										majors[major] === paths[path][tree]
											? 0
											: 1
									)
									.reduce((c, v) => c + v, 0),
								opacityIncrease =
									value.cards.length - majorsNotOnTree;
							opacityIncrease > 0 &&
								(elem.style.opacity =
									0.3 + +`0.${opacityIncrease}`);
						})
				  )
		)
	);
}

const rgba2hex = (rgba) =>
	`#${rgba
		.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/)
		.slice(1)
		.map((n, i) =>
			(i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n))
				.toString(16)
				.padStart(2, "0")
				.replace("NaN", "")
		)
		.join("")}`;

const pathColors = (cn) => {
	const highlightColor = "#FFFF00",
		defaultNotHighlight = "#FFFFFF",
		notHighlightColor =
			[...document.getElementsByClassName(cn)]
				.map(
					(elem) =>
						elem &&
						rgba2hex(
							getComputedStyle(elem).getPropertyValue(
								"background-color"
							)
						).toUpperCase()
				)
				.find((hex) => hex !== highlightColor) || defaultNotHighlight;
	return { highlightColor, notHighlightColor };
};

const resetColors = (cn) => {
	const { notHighlightColor } = pathColors(cn);
	[...document.getElementsByClassName(cn)].forEach(
		(elem) => (elem.style.backgroundColor = notHighlightColor)
	);
};

function resetAllColors() {
	["path", "sefira", "interact", "sef-info-row"].forEach((cn) =>
		resetColors(cn)
	);
}

function updatePathClassNames() {
	Object.entries(paths).forEach(([path, v]) =>
		Object.entries(v).forEach(([tree, letter]) =>
			[...document.getElementsByClassName(tree)].forEach((t) =>
				[...t.getElementsByClassName(letter)].forEach(
					(p) =>
						!p.className.includes(path) &&
						(p.className += " " + path)
				)
			)
		)
	);
}

export default spreadPaths;
export { pathColors, resetColors, resetAllColors, updatePathClassNames };
