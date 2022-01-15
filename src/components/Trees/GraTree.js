import "../../css/trees/gra.css";
import Sefirot from "./Sefirot";

function GraTree() {
	return (
		<div className="gra tree">
			<Sefirot isGra={true} />
			<div className="path short center center-1 beth"></div>
			<div className="path short center center-2gra resh"></div>
			<div className="path short center center-3gra tav"></div>
			<div className="top-hex">
				<div className="path medium shin"></div>
				<div className="path short vav"></div>
				<div className="path short heh"></div>
				<div className="path short daleth"></div>
				<div className="path short gimmel"></div>
				<div className="path short chet"></div>
				<div className="path short zain"></div>
			</div>
			<div className="diamond">
				<div className="path medium aleph"></div>
				<div className="path short yod"></div>
				<div className="path short teth"></div>
				<div className="path short nun"></div>
				<div className="path short lamed"></div>
			</div>
			<div className="base">
				<div className="path medium mem"></div>
				<div className="path short peh"></div>
				<div className="path short kaph"></div>
				<div className="path short ayin"></div>
				<div className="path short samekh"></div>
				<div className="path short qof"></div>
				<div className="path short tzaddi"></div>
			</div>
		</div>
	);
}

export default GraTree;
