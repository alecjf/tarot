import "../../css/trees/paths-window.css";
import { useEffect, useState } from "react";
import { flipUpright } from "../../scripts/data/opposites";
import spreadPaths, {
	pathColors,
	resetAllColors,
} from "../../scripts/trees/spread-paths";
import PathsSummary from "./PathsSummary";
import Trees from "./Trees";

function PathsWindow({ cardNames, ClosePathsWindowButton }) {
	const [pathsSummary, setPathsSummary] = useState(undefined);

	useEffect(() => {
		if (cardNames) {
			setPathsSummary(
				spreadPaths(cardNames.map((cardName) => flipUpright(cardName)))
			);
		}
	}, [cardNames]);

	useEffect(() => {
		function scrollToSummary(elem) {
			document
				.getElementById("paths-window")
				.scrollTo(
					0,
					document.getElementById("paths-summary").offsetTop
				);
			elem.scrollIntoView();
		}

		function pathHandler(path) {
			resetAllColors();
			const p = path.className.split(" ").pop(),
				row = document.getElementById(p);
			if (row) {
				row.style.backgroundColor =
					pathColors("interact").highlightColor;
				[...document.getElementsByClassName(p)].forEach(
					(pt) =>
						(pt.style.backgroundColor =
							pathColors("path").highlightColor)
				);
				scrollToSummary(row);
			} else {
				alert(p);
			}
		}

		function sefHandler(sef) {
			resetAllColors();
			const { highlightColor } = pathColors("sefira"),
				row = document.getElementById(sef.className.split(" ").pop());
			sef.style.backgroundColor = highlightColor;
			row.style.backgroundColor = highlightColor;
			scrollToSummary(row);
		}

		const setOnClick = (cn, handler) =>
			[
				...document
					.getElementById("paths-window")
					.getElementsByClassName(cn),
			].forEach((elem) => {
				elem.onclick = () => handler(elem);
			});

		setOnClick("path", pathHandler);
		setOnClick("sefira", sefHandler);
	}, [pathsSummary]);

	return (
		<div id="paths-window">
			{pathsSummary && (
				<>
					<ClosePathsWindowButton />
					<div id="trees-wrapper">
						<h4>{cardNames.join(", ")}</h4>
						<Trees
							{...{
								key: cardNames,
								cardNames,
							}}
						/>
					</div>
					<PathsSummary
						{...{
							allData: pathsSummary,
							isSingle: cardNames.length === 1,
						}}
					/>
				</>
			)}
		</div>
	);
}

export default PathsWindow;
