import "../css/navigation.css";
import "../css/sign-in-screen.css";
import { useEffect, useState } from "react";
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import firestore, {
	dateFormatter,
	writeDailySpread,
	writePlan,
} from "../scripts/cloud";
import auth, { signOutUser } from "../scripts/auth";
import { writeCustomSpreads } from "../scripts/cloud";
import phrasesData from "../scripts/phrases-data";
import processDailyReadings from "../scripts/daily-stats";
import cards from "../scripts/data/cards";
import { randomItem } from "../scripts/misc";
import Header from "./Header";
import SignIn from "./SignIn/SignIn";
import Register from "./SignIn/Register";
import Spread from "./Spread/Spread";
import CardLookup from "./CardLookup";
import Journal from "./Journal";

function App() {
	const [loaded, setLoaded] = useState(false),
		[userID, setUserID] = useState(undefined),
		[plan, setPlan] = useState(undefined),
		[view, setView] = useState("daily-spread"),
		[spreads, setSpreads] = useState({
			"daily-spread": undefined,
			"custom-spread": undefined,
		}),
		[dailyStats, setDailyStats] = useState(undefined),
		[customSpreads, setCustomSpreads] = useState(undefined),
		[singleCard, setSingleCard] = useState(randomItem(cards).name),
		cardLinkHandler = (cardName) => {
			setSingleCard(cardName);
			setView("card-lookup");
		},
		SignOutButton = () => (
			<button onClick={() => signOutUser()}>Sign Out</button>
		);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			const id = user?.email;
			setUserID(id);
			setLoaded(true);

			async function planStatus() {
				const docRef = doc(firestore, "User Spreads", id),
					docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					setPlan(docSnap.data().plan);
				} else {
					writePlan({ userID: id, plan: "free" });
					setPlan("free");
				}
			}

			async function dailySpread() {
				const docRef = doc(
					firestore,
					"User Spreads",
					id,
					"Daily Spreads",
					dateFormatter(new Date())
				);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					setSpreads({
						...spreads,
						"daily-spread": docSnap.data().spread,
					});
				} else {
					// doc.data() will be undefined in this case
					const spread = phrasesData(5);
					writeDailySpread({
						userID: id,
						date: new Date(),
						spread,
					});
					setSpreads({ ...spreads, "daily-spread": spread });
				}
			}

			async function customSpreadsDrawn() {
				// clear all old Custom Spread records:
				const querySnapshot = await getDocs(
					collection(firestore, "User Spreads", id, "Custom Spreads")
				);
				let today;
				// .filter() doesn't work, so use .forEach():
				querySnapshot.forEach((doc) => {
					// doc.data() is never undefined for query doc snapshots
					if (doc.id === dateFormatter(new Date())) {
						today = doc;
					} else {
						deleteDoc(doc.ref);
					}
				});

				if (today) {
					const { numberDrawn } = today.data();
					setCustomSpreads(numberDrawn);
				} else {
					writeCustomSpreads({
						userID: id,
						date: new Date(),
						numberDrawn: 0,
					});
					setCustomSpreads(0);
				}
			}

			if (user?.emailVerified) {
				planStatus();
				dailySpread();
				processDailyReadings(id).then((result) =>
					setDailyStats(result)
				);
				customSpreadsDrawn();
			}
		});
	}, []);

	function SignedIn() {
		function Navigation() {
			const UserInfo = () => (
				<div id="user-info">
					<span className="custom-header">{userID}</span>
					<SignOutButton />
				</div>
			);

			const navButtonHandler = (e) =>
				setView(e.target.innerHTML.split(" ").join("-").toLowerCase());

			return (
				<div id="navigation">
					<button
						className={`nav-button ${
							view === "daily-spread" ? "active" : ""
						}`}
						onClick={(e) => navButtonHandler(e)}
					>
						DAILY SPREAD
					</button>
					<button
						className={`nav-button ${
							view === "custom-spread" ? "active" : ""
						}`}
						onClick={(e) => navButtonHandler(e)}
					>
						CUSTOM SPREAD
					</button>
					<button
						className={`nav-button ${
							view === "card-lookup" ? "active" : ""
						}`}
						onClick={(e) => navButtonHandler(e)}
					>
						CARD LOOKUP
					</button>
					<button
						className={`nav-button ${
							view === "spread-journal" ? "active" : ""
						}`}
						onClick={(e) => navButtonHandler(e)}
					>
						SPREAD JOURNAL
					</button>
					<UserInfo />
				</div>
			);
		}

		function SpreadSize({ phrases }) {
			const spreadSizeHandler = () => {
				if (plan === "paid" || customSpreads < 3) {
					const copy = { ...spreads };
					copy[view] = phrasesData(
						document.querySelector("#select-size").value
					);
					setSpreads(copy);
					if (plan === "free") {
						setCustomSpreads(customSpreads + 1);
						writeCustomSpreads({
							userID,
							date: new Date(),
							numberDrawn: customSpreads + 1,
						});
					}
				} else {
					alert(
						"You have exceeded your custom spread limits for the day."
					);
				}
			};

			return (
				<div id="spread-size">
					<h2 className="custom-header">Cards:</h2>
					<select
						id="select-size"
						defaultValue={phrases ? phrases.length + 1 : 5}
					>
						{Array.apply(null, Array(9)).map((_, i) => (
							<option key={`size select ${i + 2}`} value={i + 2}>
								{i + 2}
							</option>
						))}
					</select>
					<button onClick={() => spreadSizeHandler()}>DRAW</button>
				</div>
			);
		}

		return (
			<>
				<Navigation />
				{view === "spread-journal" ? (
					<Journal {...{ userID, cardLinkHandler }} />
				) : view === "card-lookup" ? (
					<CardLookup
						{...{
							singleCard,
							cardLinkHandler,
						}}
					/>
				) : (
					<Spread
						{...{
							view,
							spreads,
							SpreadSize,
							userID,
							dailyStats,
							cardLinkHandler,
							customSpreads,
							plan,
							setPlan,
						}}
					/>
				)}
			</>
		);
	}

	function SignInScreen({ pendingVerify }) {
		return (
			<div id="sign-in-screen">
				{pendingVerify ? (
					<>
						This account is not yet verified. Please click on the
						link sent to {auth.currentUser.email}
						<br />
						<br />
						<SignOutButton />
					</>
				) : (
					<>
						<Register />
						<hr />
						<h3 className="custom-header">OR</h3>
						<hr />
						<SignIn {...{ setView }} />
					</>
				)}
			</div>
		);
	}

	return (
		<div className="App">
			<Header />
			{loaded &&
				(auth.currentUser ? (
					auth.currentUser.emailVerified ? (
						<SignedIn />
					) : (
						<SignInScreen pendingVerify={true} />
					)
				) : (
					<SignInScreen pendingVerify={false} />
				))}
		</div>
	);
}

export default App;
