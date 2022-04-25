import app from "./firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import sentenceHandlers from "./data/sentences";

const firestore = getFirestore(app);

const dateFormatter = (date) =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

async function writePlan({ userID, plan }) {
    await setDoc(doc(firestore, "User Spreads", userID), {
        plan,
    });
}

function getWordForms(func) {
    const { people, pos } = func;
    return {
        person1: people[0],
        person2: people[1],
        noun1: pos.Noun[0],
        noun2: pos.Noun[1],
        adj1: pos.Adj[0],
        adj2: pos.Adj[1],
    };
}

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

function transformSpread(spread) {
    const result = [];
    spread.forEach((pair) =>
        result.push({
            cards: pair.cards,
            funcs: pair.funcs.map((func) => ({ pos: func.pos })),
            lines: pair.funcs.map((func) =>
                capitalize(sentenceHandlers[func.key](getWordForms(func)))
            ),
        })
    );
    return result;
}

async function writeDailySpread({ userID, date, spread }) {
    console.log(spread);

    await setDoc(
        doc(
            firestore,
            "User Spreads",
            userID,
            "Daily Spreads",
            dateFormatter(date)
        ),
        {
            spread: transformSpread(spread),
        }
    );
}

async function writeCustomSpreads({ userID, date, numberDrawn }) {
    await setDoc(
        doc(
            firestore,
            "User Spreads",
            userID,
            "Custom Spreads",
            dateFormatter(date)
        ),
        {
            numberDrawn,
        }
    );
}

async function writeInJournal({ userID, date, spreads }) {
    await setDoc(
        doc(firestore, "User Spreads", userID, "Journal", dateFormatter(date)),
        {
            spreads,
        }
    );
}

export default firestore;
export {
    dateFormatter,
    writeDailySpread,
    writeCustomSpreads,
    writeInJournal,
    writePlan,
};
