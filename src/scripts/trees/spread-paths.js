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
	},
	luriaPaths = {
		"1-2": "heh",
		"1-3": "vav",
		"1-6": "daleth",
		"2-3": "shin",
		"2-4": "beth",
		"2-5": "zain",
		"2-6": "teth",
		"3-4": "qof",
		"3-5": "gimmel",
		"3-6": "ayin",
		"4-5": "aleph",
		"4-6": "chet",
		"4-7": "kaph",
		"5-6": "tzaddi",
		"5-8": "peh",
		"6-7": "yod",
		"6-8": "samekh",
		"6-9": "resh",
		"7-8": "mem",
		"7-9": "nun",
		"8-9": "lamed",
		"9-10": "tav",
	},
	graPaths = {
		"1-2": "heh",
		"1-3": "vav",
		"1-6": "beth",
		"2-3": "shin",
		"2-4": "gimmel",
		"2-6": "zain",
		"3-5": "daleth",
		"3-6": "chet",
		"4-5": "aleph",
		"4-6": "teth",
		"4-7": "kaph",
		"4-9": "lamed",
		"5-6": "yod",
		"5-8": "peh",
		"5-9": "nun",
		"6-9": "resh",
		"7-8": "mem",
		"7-9": "samekh",
		"7-10": "tzaddi",
		"8-9": "ayin",
		"8-10": "qof",
		"9-10": "tav",
	},
	kircherPaths = {
		"1-2": "aleph",
		"1-3": "beth",
		"1-6": "gimmel",
		"2-3": "daleth",
		"2-4": "vav",
		"2-6": "heh",
		"3-5": "chet",
		"3-6": "zain",
		"4-5": "teth",
		"4-6": "yod",
		"4-7": "kaph",
		"5-6": "lamed",
		"5-8": "mem",
		"6-7": "nun",
		"6-8": "ayin",
		"6-9": "samekh",
		"7-8": "peh",
		"7-9": "tzaddi",
		"7-10": "qof",
		"8-9": "resh",
		"8-10": "shin",
		"9-10": "tav",
	},
	allPaths = {
		luria: luriaPaths,
		gra: graPaths,
		kircher: kircherPaths,
	};

function spreadPaths(spread) {
	const treeNames = ["luria", "gra", "kircher"],
		separateData = {};
	let allData = {};
	treeNames.forEach((tree) => {
		const data = spreadPathsData(spread, allPaths[tree]);
		separateData[tree] = data;
		allData = { ...allData, ...data };
		highlightPaths(data, allPaths[tree], tree, spread.length === 1);
	});
	const treesWithPath = (path) =>
		new Map(
			treeNames
				.filter((tree) => separateData[tree][path])
				.map((tree) => [tree, allPaths[tree][path]])
		);
	Object.keys(allData).forEach(
		(key) =>
			(allData[key] = { cards: allData[key], trees: treesWithPath(key) })
	);
	return allData;
}

function spreadPathsData(spread, paths) {
	const minors = minorPairs(spread, paths),
		result = {};
	minors.forEach((pair) => {
		const key = pair[0].join("-");
		if (paths[key]) {
			result[key] ? result[key].push(pair[1]) : (result[key] = [pair[1]]);
		}
	});
	const majorArcana = spread.filter((card) => majors[card]);
	majorArcana.forEach((major) => {
		const cardInfo = info(major, paths);
		result[cardInfo]
			? result[cardInfo].push([major])
			: (result[cardInfo] = [[major]]);
	});
	return result;
}

function minorPairs(spread, paths) {
	const pairs = minorPairsHelper(spread);
	return pairs.map((pair) => {
		const [card1, card2] = pair,
			card1Info = info(card1, paths),
			card2Info = info(card2, paths),
			sortedPair = [card1, card2].sort(() => card1Info - card2Info);
		return [[card1Info, card2Info].sort((a, b) => +a - +b), sortedPair];
	});
}

function minorPairsHelper(spread) {
	const result = new Set();
	for (const card of spread) {
		if (majors[card]) {
			continue;
		}
		for (const c of spread) {
			if (card === c || majors[c]) {
				continue;
			}
			result.add([card, c].sort().join(" - "));
		}
	}
	return [...result].map((pair) => pair.split(" - "));
}

function info(card, paths) {
	const rank = !majors[card] && card.split(" ")[0];
	return rank
		? numerify(rank)
		: Object.entries(paths).find(([_, v]) => v === majors[card])[0];
}

function numerify(rank) {
	if (+rank) {
		return +rank;
	} else if (rank === "Ace") {
		return 1;
	} else {
		switch (rank) {
			case "Page":
				return 10;
			case "Knight":
				return 6;
			case "Queen":
				return 3;
			case "King":
				return 2;
			default:
				return;
		}
	}
}

function highlightPaths(pathsData, paths, treeName, isSingle) {
	const trees = [...document.getElementsByClassName(treeName)];
	trees.forEach((tree) =>
		Object.entries(pathsData).forEach(([path, pairs]) =>
			[...tree.getElementsByClassName(paths[path])].forEach(
				(elem) =>
					(elem.style.opacity = isSingle
						? 1
						: 0.3 + +`0.${"" + pairs.length}`)
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
	Object.entries(allPaths).forEach(([k, v]) =>
		[...document.getElementsByClassName(k)].forEach(
			(tree) =>
				tree &&
				Object.entries(v).forEach(([path, letter]) =>
					[...tree.getElementsByClassName(letter)].forEach(
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
