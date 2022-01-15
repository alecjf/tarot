import "../../css/trees/luria.css";
import Sefirot from "./Sefirot";

function LuriaTree() {
	return (
		<div className="luria tree">
			<Sefirot isGra={false} />
			<div className="path long center center-1 daleth"></div>
			<div className="path short center center-2 resh"></div>
			<div className="path short center center-3 tav"></div>
			<div className="top-hex">
				<div className="path medium shin"></div>
				<div className="path short vav"></div>
				<div className="path short heh"></div>
				<div className="path short gimmel"></div>
				<div className="path short beth"></div>
				<div className="path bisect-hex-diag qof"></div>
				<div className="path bisect-hex-diag zain"></div>
				<div className="path other-diag ayin"></div>
				<div className="path other-diag teth"></div>
			</div>
			<div className="triangle">
				<div className="path medium aleph"></div>
				<div className="path short tzaddi"></div>
				<div className="path short chet"></div>
			</div>
			<div className="base">
				<div className="path medium mem"></div>
				<div className="path short peh"></div>
				<div className="path short kaph"></div>
				<div className="path short samekh"></div>
				<div className="path short yod"></div>
				<div className="path short lamed"></div>
				<div className="path short nun"></div>
			</div>
		</div>
	);
}

export default LuriaTree;
