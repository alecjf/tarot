import "../../css/trees/trees.css";
import { useEffect } from "react";
import { flipUpright } from "../../scripts/data/opposites";
import pathDimensions from "../../scripts/trees/path-dimensions";
import spreadPaths, {
	updatePathClassNames,
} from "../../scripts/trees/spread-paths";
import LuriaTree from "./LuriaTree";
import GraTree from "./GraTree";
import KircherTree from "./KircherTree";

function Trees({ cardNames }) {
	useEffect(() => {
		pathDimensions();
		updatePathClassNames();
		spreadPaths(cardNames.map((cardName) => flipUpright(cardName)));
	}, [cardNames]);

	return (
		<div className="trees">
			<div className="tree-container">
				<LuriaTree />
			</div>
			<div className="tree-container">
				<GraTree />
			</div>
			<div className="tree-container">
				<KircherTree />
			</div>
		</div>
	);
}

export default Trees;
