import { cardSorter } from "../../scripts/spread-data";

function DailyStats({ dailyStats, cardLinkHandler }) {
	const { cardFreq, wordFreq, totalCards, totalWords } = dailyStats;

	function StatColumn({ header, freqs, total }) {
		const processed = Object.entries(freqs)
			.filter(([_, freq]) => freq)
			.sort((a, b) => {
				const [aItem, aFreq] = a,
					[bItem, bFreq] = b;
				return aFreq === bFreq
					? header === "Cards"
						? cardSorter(aItem, bItem)
						: aItem.localeCompare(bItem)
					: bFreq - aFreq;
			});

		return (
			<div>
				<div className="stat-column-header custom-header">
					{total} {header} Drawn
				</div>
				{processed.map(([item, freq]) => (
					<div key={`${header} ${item}`} className="stats-row">
						<div
							onClick={() =>
								header === "Cards" && cardLinkHandler(item)
							}
						>
							{item}
						</div>
						<div>{freq}</div>
						<div>{~~((freq / total) * 100)}%</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div id="daily-stats-container">
			<h3 id="daily-stats-header" className="custom-header">
				Daily Spread History
			</h3>
			<div id="daily-stats-subheader">
				Here you can track common keywords from the text of your daily
				spreads.
				<br />
				Want to recommend a word for a card?
				<br />
				Please email <a href="mailto:al@fern.haus">al@fern.haus</a>
			</div>
			<div id="daily-stats">
				<StatColumn
					header={"Cards"}
					freqs={cardFreq}
					total={totalCards}
				/>
				<StatColumn
					header={"Words"}
					freqs={wordFreq}
					total={totalWords}
				/>
			</div>
		</div>
	);
}

export default DailyStats;
