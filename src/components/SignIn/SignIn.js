import { signInUser } from "../../scripts/auth";
import FormTemplate from "./FormTemplate";

function SignIn({ setView }) {
	function signInHandler(e) {
		const email = e.target.email.value,
			password = e.target.password.value;
		signInUser(email, password);
		setView("daily-spread");
		e.preventDefault();
	}

	return (
		<FormTemplate
			title="Sign In"
			handler={signInHandler}
			submitButton="Enter"
		/>
	);
}

export default SignIn;
