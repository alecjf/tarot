import { pathColors, resetAllColors } from "../../scripts/trees/spread-paths";
import sefInfo, { pathTranslateFormat } from "../../scripts/trees/sefs";

function PathsSummary({ allData }) {
	const scrollToPaths = () =>
		document
			.getElementById("paths-window")
			.scrollTo(0, document.getElementById("trees-wrapper").offsetTop);

	function interactHandler(e) {
		const trees = allData[e.currentTarget.id].trees,
			{ highlightColor } = pathColors("path");
		resetAllColors();
		e.currentTarget.style.backgroundColor = highlightColor;
		Object.keys(trees).forEach((tree) =>
			[
				...document
					.getElementById("paths-window")
					.getElementsByClassName(tree),
			].forEach((treeElem) =>
				[...treeElem.getElementsByClassName(trees[tree])].forEach(
					(elem) => (elem.style.backgroundColor = highlightColor)
				)
			)
		);
		scrollToPaths();
	}

	console.log(allData);

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
								+aTo - +bTo
								// || aVal.cards[0][0].localeCompare(bVal.cards[0][0])
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
									{pathTranslateFormat(k)}
									<ul>
										{Object.keys(allData[k].trees).map(
											(tree) => (
												<li
													key={`tree-list-item-${k}-${tree}-${allData[k][tree]}`}
												>
													{tree}:{" "}
													{allData[k].trees[tree]}
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
