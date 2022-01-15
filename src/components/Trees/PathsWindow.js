import "../../css/trees/paths-window.css";
import { useEffect, useState } from "react";
import { flipUpright } from "../../scripts/data/opposites";
import spreadPaths, {
	pathColors,
	resetAllColors,
} from "../../scripts/trees/spread-paths";
import PathsSummary from "./PathsSummary";
import Trees from "./Trees";
import { pathTranslate } from "../../scripts/trees/sefs";

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

		function handlerHelper(cn, elem) {
			resetAllColors();
			const { highlightColor } = pathColors(cn),
				name = elem.className.split(" ").pop(),
				row = document.getElementById(name);
			row
				? (row.style.backgroundColor = highlightColor)
				: alert("NOT DRAWN: " + pathTranslate(name).join("; "));
			[
				...document
					.getElementById("paths-window")
					.getElementsByClassName(name),
			].forEach((el) => (el.style.backgroundColor = highlightColor));
			scrollToSummary(row);
		}

		const pathHandler = (path) => handlerHelper("path", path),
			sefHandler = (sef) => handlerHelper("sefira", sef),
			setOnClick = (cn, handler) =>
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
