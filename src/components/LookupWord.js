import { allWords } from "../scripts/data/cards";
import { getAdjs, nounify } from "../scripts/misc";
import SpreadWords from "./SpreadWords";
import ButtonWords from "./ButtonWords";
import { useMemo } from "react";

function LookupWord({ lookupWord, cardLinkHandler, wordLinkHandler }) {
	const nouns = nounify(lookupWord).sort(),
		// related through a shared adjective;
		// see if adjectives have other nouns not already listed:
		related = getAdjs(lookupWord)
			.map((adj) => nounify(adj))
			.flat()
			.filter((noun) => !nouns.includes(noun))
			.sort();

	const selectWord = useMemo(
		() => (
			<select
				defaultValue={lookupWord}
				onChange={(e) => wordLinkHandler(e.target.value)}
			>
				{allWords.map((word) => (
					<option key={`select-word-${word}`} value={word}>
						{word}
					</option>
				))}
			</select>
		),
		[]
	);

	return (
		<div id="lookup-word">
			{selectWord}
			{!!related.length && (
				<>
					<br />
					<br />
					<h3 className="custom-header">
						Related:{" "}
						<ButtonWords {...{ words: related, wordLinkHandler }} />
					</h3>
				</>
			)}
			{nouns.map((noun) => (
				<SpreadWords
					{...{
						key: `spread-words-${noun}`,
						cardLinkHandler,
						wordLinkHandler,
						lookupWord: noun,
					}}
				/>
			))}
		</div>
	);
}

export default LookupWord;
