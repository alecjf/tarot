function CommonWords({ entries, commonWords }) {
	return (
		<div className="common-words">
			<ul>
				{entries
					.filter(([_, value]) => value)
					.map(([key, value]) => (
						<li key={`common words ${key} ${value}`}>
							<span>
								{key}
								{key.charAt(key.length - 1) === "s" ? "" : "s"}
							</span>{" "}
							represent {commonWords[key].join(", ")}.
						</li>
					))}
			</ul>
		</div>
	);
}

export default CommonWords;
