import "../../css/spread.css";
import Cards from "./Cards";
import Lines from "./Lines";
import Histogram from "./Histogram";
import Counts from "./Counts";
import CommonWords from "./CommonWords";
import {
	histogram,
	sortCountedEntries,
	rankWords,
	suitWords,
} from "../../scripts/spread-data";
import DailyStats from "./DailyStats";
import SpreadWords from "../SpreadWords";

function Spread({
	view,
	spreads,
	SpreadSize,
	userID,
	dailyStats,
	cardLinkHandler,
	wordLinkHandler,
	DrawingStatus,
}) {
	const cardNamesFromPhrases = (phrases) => [
		...new Set(phrases.map((p) => p.cards).flat()),
	];

	let phrases, cardNames, rankEntries, suitEntries;

	if (spreads?.[view]) {
		phrases = spreads[view];
		cardNames = cardNamesFromPhrases(phrases);
		rankEntries = sortCountedEntries(cardNames, true);
		suitEntries = sortCountedEntries(cardNames, false);
	}

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
				<h3 id="ranks-header" className="custom-header">
					Ranks
				</h3>
				<Counts entries={rankEntries} />
				<CommonWords commonWords={rankWords} entries={rankEntries} />
				<h3 id="suits-header" className="custom-header">
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
					<h3 id="card-words-header" className="custom-header">
						Compare Card Words
					</h3>
					<SpreadWords
						{...{
							cardNames,
							cardLinkHandler,
							wordLinkHandler,
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
			) : view === "custom-spread" ? (
				<div id="empty-custom">
					<h3>Choose a spread between 2 and 10 cards.</h3>
					<hr />
					<SpreadSize {...{ phrases }} />
					<hr />
					<DrawingStatus longVersion={true} />
				</div>
			) : (
				<></>
			)}
		</div>
	);
}

export default Spread;
