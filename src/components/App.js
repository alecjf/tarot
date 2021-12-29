import "../css/sign-in-screen.css";
import "../css/navigation.css";
import "../css/enter-cards.css";
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
import cards, { allWords } from "../scripts/data/cards";
import { flipUpright } from "../scripts/data/opposites";
import { randomItem } from "../scripts/misc";
import Header from "./Header";
import SignIn from "./SignIn/SignIn";
import Register from "./SignIn/Register";
import Spread from "./Spread/Spread";
import LookupCard from "./LookupCard";
import Journal from "./Journal";
import LookupWord from "./LookupWord";
import SpreadWords from "./SpreadWords";
import CardImage from "./CardImage";
import { cardSorter } from "../scripts/spread-data";

function App() {
	const [loaded, setLoaded] = useState(false),
		[userID, setUserID] = useState(undefined),
		[plan, setPlan] = useState(undefined),
		[view, setView] = useState("daily-spread"),
		[spreads, setSpreads] = useState({
			"daily-spread": undefined,
			"custom-spread": undefined,
			"enter-cards": [],
		}),
		[dailyStats, setDailyStats] = useState(undefined),
		[customSpreads, setShowSpreads] = useState(undefined),
		[customSpreadView, setShowSpreadView] = useState("random"),
		[lookupCard, setLookupCard] = useState(randomItem(cards).name),
		cardLinkHandler = (cardName) => {
			setLookupCard(cardName);
			setView("lookup-card");
		},
		[lookupWord, setLookupWord] = useState(allWords[0]),
		wordLinkHandler = (word) => {
			setLookupWord(word);
			setView("lookup-word");
		},
		SignOutButton = () => (
			<button onClick={() => signOutUser()}>Sign Out</button>
		);

	useEffect(() => {
		window.scrollTo(0, 0);
		document.getElementsByTagName("select")[0]?.focus();
	});

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
					setShowSpreads(numberDrawn);
				} else {
					writeCustomSpreads({
						userID: id,
						date: new Date(),
						numberDrawn: 0,
					});
					setShowSpreads(0);
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
							view === "lookup-card" ? "active" : ""
						}`}
						onClick={(e) => navButtonHandler(e)}
					>
						LOOKUP CARD
					</button>
					<button
						className={`nav-button ${
							view === "lookup-word" ? "active" : ""
						}`}
						onClick={(e) => navButtonHandler(e)}
					>
						LOOKUP WORD
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

		const spreadSizeHandler = (enterCards) => {
			if (plan === "paid" || customSpreads < 3) {
				const copy = { ...spreads };
				if (enterCards) {
					let entered = [
						...new Set(
							[...document.getElementsByClassName("enter-card")]
								.map((elem) => elem.value)
								.filter(
									(cardName, _, arr) =>
										cardName !== "PICK CARD" &&
										// check if reversed card has upright version in spread:
										(cardName.includes(" reversed")
											? !arr.includes(
													flipUpright(cardName)
											  )
											: true)
								)
						),
					];
					if (entered.length < 2) {
						alert("Must pick at least 2 distinct cards.");
						return;
					} else if (
						[...entered].sort().join(", ") ===
						[...copy["enter-cards"]].sort().join(", ")
					) {
						alert("No new cards selected. Check for duplicates.");
						return;
					} else {
						copy["enter-cards"] = entered;
					}
				} else {
					copy["custom-spread"] = phrasesData(
						document.querySelector("#select-size").value
					);
				}
				setSpreads(copy);
				if (plan === "free") {
					setShowSpreads(customSpreads + 1);
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

		function ShowSpread() {
			function CustomSpreadOptions({ enterCards }) {
				const result = [
					<button
						key="draw-random-button"
						onClick={() =>
							enterCards
								? setShowSpreadView("random")
								: spreadSizeHandler()
						}
					>
						DRAW RANDOM
					</button>,
					" OR ",
					<button
						key="compare-cards-button"
						onClick={() =>
							enterCards
								? spreadSizeHandler(true)
								: setShowSpreadView("enter")
						}
					>
						COMPARE CARDS
					</button>,
				];
				enterCards && result.reverse();
				return result;
			}

			function DrawingStatus({ longVersion }) {
				const PlanButton = () => (
					<button
						onClick={() => {
							writePlan({ userID, plan: "paid" });
							setPlan("paid");
						}}
					>
						Upgrade
					</button>
				);

				return plan === "free" ? (
					longVersion ? (
						<>
							<p>
								You have used{" "}
								<span className="custom-limit">
									{customSpreads}/3
								</span>{" "}
								of your daily drawings.
								<br />
								Want unlimited spreads?
							</p>
							<PlanButton />
						</>
					) : (
						<div>
							<span className="custom-limit">
								{customSpreads}/3
							</span>{" "}
							drawings today <PlanButton />
						</div>
					)
				) : (
					<>
						{longVersion && (
							<p>You have unlimited readings! Draw away!</p>
						)}
						<button
							onClick={() => {
								writePlan({ userID, plan: "free" });
								setPlan("free");
							}}
						>
							Downgrade :(
						</button>
					</>
				);
			}

			function EnterCards() {
				const [enterSize, setEnterSize] = useState(
					spreads["enter-cards"]?.length || 3
				);

				function EnterSelect({ defaultValue, childKeyBase }) {
					return (
						<div className="enter-select">
							<CardImage cardName={defaultValue} />
							<select
								className="enter-card"
								defaultValue={defaultValue || "PICK CARD"}
							>
								<option value="PICK CARD">PICK CARD</option>
								{cards
									.map((card) => card.name)
									.sort(cardSorter)
									.map((cardName) => (
										<option
											key={`${childKeyBase}-${cardName}`}
											value={cardName}
										>
											{cardName}
										</option>
									))}
							</select>
						</div>
					);
				}

				return (
					<div id="enter-cards">
						<h2 className="custom-header">
							CARDS:{" "}
							<select
								defaultValue={enterSize}
								onChange={(e) => setEnterSize(+e.target.value)}
							>
								{new Array(9).fill(null).map((_, i) => (
									<option
										key={`enter-cards-size-${i}`}
										value={i + 2}
									>
										{i + 2}
									</option>
								))}
							</select>
						</h2>
						<div id="enter-selects">
							{new Array(enterSize).fill(null).map((n, i) => (
								<EnterSelect
									key={`enter-select-${i}`}
									childKeyBase={`enter-select-${i}`}
									defaultValue={spreads["enter-cards"][i]}
								/>
							))}
						</div>
						<br />
						<div id="enter-cards-buttons">
							<CustomSpreadOptions enterCards={true} />
							<DrawingStatus longVersion={true} />
						</div>
						{!!spreads["enter-cards"].length ? (
							<>
								<hr />
								<SpreadWords
									{...{
										cardNames: spreads["enter-cards"],
										cardLinkHandler,
										wordLinkHandler,
									}}
								/>
							</>
						) : (
							<>
								<br />
								<br />
							</>
						)}
					</div>
				);
			}

			function SpreadSize({ phrases }) {
				return (
					<>
						<div id="spread-size">
							<h2 className="custom-header">Cards:</h2>
							<select
								id="select-size"
								defaultValue={phrases ? phrases.length + 1 : 5}
							>
								{Array.apply(null, Array(9)).map((_, i) => (
									<option
										key={`size select ${i + 2}`}
										value={i + 2}
									>
										{i + 2}
									</option>
								))}
							</select>
						</div>
						<div>
							<CustomSpreadOptions />
						</div>
					</>
				);
			}

			return view === "daily-spread" || customSpreadView === "random" ? (
				<Spread
					{...{
						view,
						spreads,
						SpreadSize,
						userID,
						dailyStats,
						cardLinkHandler,
						wordLinkHandler,
						DrawingStatus,
					}}
				/>
			) : (
				<EnterCards />
			);
		}

		return (
			<>
				<Navigation />
				{view === "spread-journal" ? (
					<Journal {...{ userID, cardLinkHandler }} />
				) : view === "lookup-card" ? (
					<LookupCard
						{...{
							lookupCard,
							cardLinkHandler,
							wordLinkHandler,
						}}
					/>
				) : view === "lookup-word" ? (
					<LookupWord
						{...{ lookupWord, cardLinkHandler, wordLinkHandler }}
					/>
				) : (
					<ShowSpread />
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
