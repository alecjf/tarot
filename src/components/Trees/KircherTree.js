import "../../css/trees/kircher.css";
import Sefirot from "./Sefirot";

function KircherTree() {
	return (
		<div className="kircher tree">
			<Sefirot isGra={false} />
			<div className="path long center center-1 gimmel"></div>
			<div className="path short center center-2 samekh"></div>
			<div className="path short center center-3 tav"></div>
			<div className="top-hex">
				<div className="path medium daleth"></div>
				<div className="path short beth"></div>
				<div className="path short aleph"></div>
				<div className="path short chet"></div>
				<div className="path short vav"></div>
				<div className="path other-diag zain"></div>
				<div className="path other-diag heh"></div>
			</div>
			<div className="triangle">
				<div className="path medium teth"></div>
				<div className="path short lamed"></div>
				<div className="path short yod"></div>
			</div>
			<div className="base">
				<div className="path medium peh"></div>
				<div className="path medium shin"></div>
				<div className="path medium qof"></div>
				<div className="path short mem"></div>
				<div className="path short kaph"></div>
				<div className="path short ayin"></div>
				<div className="path short nun"></div>
				<div className="path short resh"></div>
				<div className="path short tzaddi"></div>
			</div>
		</div>
	);
}

export default KircherTree;
