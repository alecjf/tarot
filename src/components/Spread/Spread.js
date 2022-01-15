import "../../css/spread.css";
import {
	histogram,
	sortCountedEntries,
	rankWords,
	suitWords,
} from "../../scripts/spread-data";
import Cards from "./Cards";
import Lines from "./Lines";
import Histogram from "./Histogram";
import Counts from "./Counts";
import CommonWords from "./CommonWords";
import DailyStats from "./DailyStats";
import SpreadWords from "../SpreadWords";

function cardNamesFromPhrases(phrases) {
	return [...new Set(phrases.map((p) => p.cards).flat())];
}

function Spread({
	view,
	spreads,
	SpreadSize,
	userID,
	dailyStats,
	cardLinkHandler,
	wordLinkHandler,
	DrawingStatus,
	TreesSummary,
}) {
	let phrases, cardNames, rankEntries, suitEntries;

	if (spreads?.[view]) {
		phrases = spreads[view];
		cardNames = cardNamesFromPhrases(phrases);
		rankEntries = sortCountedEntries(cardNames, true);
		suitEntries = sortCountedEntries(cardNames, false);
	}

	console.log(cardNames);

	function Phrases() {
		return (
			<div id="phrases">
				<Cards {...{ cardNames, cardLinkHandler }} />
				<Lines
					{...{
						phrases,
						SpreadSize,
						view,
						userID,
						cardNames,
						cardLinkHandler,
						wordLinkHandler,
						DrawingStatus,
					}}
				/>
			</div>
		);
	}

	function SpreadData() {
		return (
			<div id="spread-data">
				<Histogram data={histogram(cardNames)} />
				<h3 id="ranks-header" className="custom-header dark">
					Ranks
				</h3>
				<Counts entries={rankEntries} />
				<CommonWords commonWords={rankWords} entries={rankEntries} />
				<h3 id="suits-header" className="custom-header dark">
					Suits
				</h3>
				<Counts entries={suitEntries} />
				<CommonWords commonWords={suitWords} entries={suitEntries} />
			</div>
		);
	}

	return (
		<div id="spread-container">
			{spreads?.[view] ? (
				<>
					<Phrases />
					<SpreadData />
					<h3 id="card-words-header" className="custom-header dark">
						Compare Card Words
					</h3>
					<SpreadWords
						{...{
							cardNames,
							cardLinkHandler,
							wordLinkHandler,
						}}
					/>
					<TreesSummary
						{...{
							cardNames,
						}}
					/>
					{dailyStats && view === "daily-spread" && (
						<DailyStats
							{...{
								dailyStats,
								cardLinkHandler,
								wordLinkHandler,
							}}
						/>
					)}
				</>
			) : (
				view === "custom-spread" && (
					<div id="empty-custom">
						<h3>Choose a spread between 2 and 10 cards.</h3>
						<hr />
						<SpreadSize {...{ phrases }} />
						<hr />
						<DrawingStatus longVersion={true} />
					</div>
				)
			)}
		</div>
	);
}

export default Spread;
export { cardNamesFromPhrases };
