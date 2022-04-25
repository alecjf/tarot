import React from "react";
import { dateFormatter, writeInJournal } from "../../scripts/cloud";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import firestore from "../../scripts/cloud";

const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ],
    dateHeader = (date) =>
        `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

function Lines({
    phrases,
    SpreadSize,
    view,
    userID,
    cardNames,
    cardLinkHandler,
    DrawingStatus,
}) {
    async function journalHandler(line, pair) {
        const docRef = doc(
                firestore,
                "User Spreads",
                userID,
                "Journal",
                dateFormatter(new Date())
            ),
            docSnap = await getDoc(docRef),
            add = line + ` (${pair.join(", ")})`;
        if (docSnap.exists()) {
            console.log("Journal Day Exists");
            const updates = {
                    ...docSnap.data().spreads,
                },
                key = cardNames.join(", ");
            updates[key] = updates[key]
                ? [...new Set([...updates[key], add])]
                : [add];
            // update saved phrases:
            await updateDoc(docRef, {
                spreads: updates,
            });
        } else {
            // doc.data() will be undefined in this case
            console.log("No such journal day!");
            const addSpread = {};
            addSpread[cardNames.join(", ")] = [add];
            await writeInJournal({
                userID: userID,
                date: new Date(),
                spreads: addSpread,
            });
        }
        alert("Written to your journal!");
    }

    return (
        <div id="lines">
            <div id="header">
                {view === "custom-spread" ? (
                    <>
                        <SpreadSize {...{ phrases }} />
                        <DrawingStatus />
                    </>
                ) : (
                    <h2 className="custom-header">
                        Your Daily Spread For {dateHeader(new Date())}
                    </h2>
                )}
            </div>
            {phrases.map((cardPair) => {
                const key = cardPair.cards.join(" - ");
                return (
                    <div key={key} className="lines-item">
                        {cardPair.cards.map((card) => (
                            <div
                                key={`${key} ${card} header`}
                                className="card-name custom-header dark"
                                onClick={() => cardLinkHandler(card)}
                            >
                                {card}
                            </div>
                        ))}
                        <div className="phrases">
                            {cardPair.lines.map((line, i) => (
                                <div
                                    key={`${key} phrases ${cardPair.cards} ${i}`}
                                >
                                    <button
                                        onClick={(e) =>
                                            journalHandler(line, cardPair.cards)
                                        }
                                    >
                                        +
                                    </button>{" "}
                                    {line}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
            <div id="footer">
                <h1 className="custom-header">Spread Data</h1>
            </div>
        </div>
    );
}

export default Lines;
