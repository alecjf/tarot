import { pathColors, resetAllColors } from "../../scripts/trees/spread-paths";

function PathsSummary({ allData }) {
	const sefs = [
		"Kether",
		"Chokmah",
		"Binah",
		"Chesed",
		"Geburah",
		"Tiphareth",
		"Netzach",
		"Hod",
		"Yesod",
		"Malkuth",
	];

	const sefInfo = {
		Kether: [
			"Crown",
			"Sphere of Creative Urge",
			"nothingness, supreme godhead, the creator",
			"Saturn",
		],
		Chokmah: [
			"Wisdom",
			"Sphere of Force",
			"yang, active, positive, god, benevolent, beginning, point",
			"Kings: Elders, fire, Atziluth (creative urge)",
		],
		Binah: [
			"Understanding",
			"Sphere of Conceptual Form",
			"yin, passive, negative, goddess, discerning, womb",
			"Queens: Adults, water, Briah (concept)",
		],
		Chesed: [
			"Mercy",
			"Sphere of Expansion",
			"peace, forgiveness, cohesion, grace",
			"right arm, white, Moon",
		],
		Geburah: [
			"Strength",
			"Sphere of Restriction",
			"struggle, judgment, punishment, retribution, rigor",
			"left arm, red",
		],
		Tiphareth: [
			"Beauty",
			"Sphere of Illumination",
			"harmony, awakening, compassion",
			"green, Venus",
			"Princes: Young adults, air, Yetzirah (formation)",
		],
		Netzach: [
			"Victory",
			"Sphere of Creativity",
			"passion, emotion, instinct, prophecy",
			"right leg, Mars",
		],
		Hod: [
			"Splendor",
			"Sphere of Logic",
			"reason, intellect, learning, prophecy",
			"left leg, Sun",
		],
		Yesod: [
			"Foundation",
			"Sphere of Potential",
			"spiritual connection, divine transmission, covenant",
			"phallus, Mercury",
		],
		Malkuth: [
			"Kingdom",
			"Sphere of Manifestation",
			"physical world, health & wealth, basic consciousness, communion of Israel",
			"Jupiter",
			"Princesses: Children, earth, Assiah (presence)",
		],
	};

	const pathTranslate = (path) => {
		const s = path.split("-").map((num) => sefs[num - 1]),
			relateSefs = (s, reverse) =>
				(reverse ? s.reverse() : s)
					.map((sef) => sefInfo[sef][0])
					.join(" of ");
		return (
			<>
				{"from " + s.join(" to ")}
				<br />
				{relateSefs(s, false)}
				<br />
				{relateSefs(s, true)}
			</>
		);
	};

	const scrollToPaths = () =>
		document
			.getElementById("paths-window")
			.scrollTo(0, document.getElementById("trees-wrapper").offsetTop);

	function interactHandler(e) {
		const treesMap = allData[e.currentTarget.id].trees,
			{ highlightColor } = pathColors("path");
		resetAllColors();
		e.currentTarget.style.backgroundColor = highlightColor;
		[...treesMap.keys()].forEach((tree) =>
			[
				...document
					.getElementById("paths-window")
					.getElementsByClassName(tree),
			].forEach((treeElem) =>
				[
					...treeElem.getElementsByClassName(treesMap.get(tree)),
				].forEach(
					(elem) => (elem.style.backgroundColor = highlightColor)
				)
			)
		);
		scrollToPaths();
	}

	function sefInfoHandler(e) {
		const { highlightColor } = pathColors("sefira"),
			sef = e.currentTarget.id;
		resetAllColors();
		e.currentTarget.style.backgroundColor = highlightColor;
		[
			...document
				.getElementById("trees-wrapper")
				.getElementsByClassName(sef.toLowerCase()),
		].forEach((elem) => (elem.style.backgroundColor = highlightColor));
		scrollToPaths();
	}

	return (
		<div id="paths-summary">
			<h2>Paths Drawn</h2>
			<table id="summary-table">
				<tbody>
					{Object.entries(allData)
						.sort((a, b) => {
							const [aKey, aVal] = a,
								[bKey, bVal] = b,
								[aFrom, aTo] = aKey.split("-"),
								[bFrom, bTo] = bKey.split("-");
							return (
								bVal.cards.length - aVal.cards.length ||
								+aFrom - +bFrom ||
								+aTo - +bTo ||
								aVal.cards[0][0].localeCompare(bVal.cards[0][0])
							);
						})
						.map(([k, v]) => (
							<tr
								key={`paths-summary-row-${k}`}
								id={k}
								className="interact"
								onClick={(e) => interactHandler(e)}
							>
								<td>
									{pathTranslate(k)}
									<ul>
										{[...v.trees.entries()].map(
											([tree, path]) => (
												<li
													key={`tree-list-item-${k}-${tree}-${path}`}
													className={tree}
												>
													{tree}: {path}
												</li>
											)
										)}
									</ul>
								</td>
								<td>
									{`${v.cards.length} occurrence${
										v.cards.length === 1 ? "" : "s"
									}`}
									:
									<ul>
										{v.cards
											.map((pair) => pair.join(" and "))
											.sort()
											.map((pair) => (
												<li
													key={`tree-list-item-${k}-${pair}`}
												>
													{pair}
												</li>
											))}
									</ul>
								</td>
							</tr>
						))}
				</tbody>
			</table>
			<hr />
			<h2>Sefirot</h2>
			<table id="sef-info">
				<tbody>
					{Object.entries(sefInfo).map(([sef, info]) => (
						<tr
							key={`sef-info-row-${sef}`}
							id={sef.toLowerCase()}
							className="sef-info-row"
							onClick={(e) => sefInfoHandler(e)}
						>
							<td>{sef}</td>
							<td>
								<ul>
									{info.map((part, i) => (
										<li key={`sef-info-row-${i}`}>
											{part}
										</li>
									))}
								</ul>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default PathsSummary;
