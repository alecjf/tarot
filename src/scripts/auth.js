import app from "./firebase";
import {
	getAuth,
	createUserWithEmailAndPassword,
	sendEmailVerification,
	signInWithEmailAndPassword,
	signOut,
	// updateProfile,
} from "firebase/auth";

const auth = getAuth(app);

const DEV_MODE = false;

function addUser(email, password) {
	createUserWithEmailAndPassword(auth, email, password)
		.then(() =>
			sendEmailVerification(auth.currentUser, {
				url: DEV_MODE
					? "http://localhost:3000"
					: "https://fern.haus/projects/tarot",
			})
		)
		.catch((error) => {
			const errorCode = error.code,
				errorMessage = error.message;
			errorCode === "auth/email-already-in-use" &&
				alert("Email already registered.");
			errorCode === "auth/weak-password" &&
				alert("Password is too weak.");
			console.log("Error Code:", errorCode);
			console.log("Error Message:", errorMessage);
		});
}

function signInUser(email, password) {
	signInWithEmailAndPassword(auth, email, password).catch((error) => {
		const errorCode = error.code,
			errorMessage = error.message;
		(errorCode === "auth/user-not-found" ||
			errorCode === "auth/wrong-password") &&
			alert("Wrong password or user not found.");
		console.log("Error Code:", errorCode);
		console.log("Error Message:", errorMessage);
	});
}

function signOutUser() {
	signOut(auth)
		.then(() => {
			// Sign-out successful.
			console.log("Sign out successful.");
		})
		.catch((error) => {
			// An error happened.
			console.error("Couldn't sign out!");
		});
}

export default auth;
export { addUser, signInUser, signOutUser };
