import app from "./firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firestore = getFirestore(app);

const dateFormatter = (date) =>
	`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

async function writePlan({ userID, plan }) {
	await setDoc(doc(firestore, "User Spreads", userID), {
		plan,
	});
}

async function writeDailySpread({ userID, date, spread }) {
	await setDoc(
		doc(
			firestore,
			"User Spreads",
			userID,
			"Daily Spreads",
			dateFormatter(date)
		),
		{
			spread,
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
