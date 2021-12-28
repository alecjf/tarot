import { courts } from "../../scripts/spread-data";

function Counts({ entries }) {
	const row1 = entries.filter(([key, _]) => !courts.includes(key)),
		row2 = entries.filter((entry) => !row1.includes(entry));

	function CountsRow({ entries }) {
		return (
			<div className="counts-row">
				{entries.map(([key, value]) => (
					<div key={`${key} ${value}`} className="count-col">
						<div className="count-header custom-header">{key}</div>
						<div className={`count-value ${!value ? "dim" : ""}`}>
							{value}
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="counts">
			<CountsRow entries={row1} />
			<CountsRow entries={row2} />
		</div>
	);
}

export default Counts;
