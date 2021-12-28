import React from "react";

function Histogram({ data }) {
	return (
		<div id="histogram">
			{Object.entries(data).map(([key, value]) => (
				<div key={`histogram ${key} ${value}`} className="histo-column">
					<h3 className="histo-header custom-header">{key}</h3>
					{Object.entries(value).map(([k, v]) => (
						<React.Fragment key={`${k} ${v}`}>
							<div className="histo-subheader custom-header">
								{k}
							</div>
							<div className={`histo-value ${!v ? "dim" : ""}`}>
								{v}
							</div>
						</React.Fragment>
					))}
				</div>
			))}
		</div>
	);
}

export default Histogram;
