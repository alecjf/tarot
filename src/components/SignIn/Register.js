import { addUser } from "../../scripts/auth";
import FormTemplate from "./FormTemplate";

function Register() {
	function registerHandler(e) {
		const email = e.target.email.value,
			password = e.target.password.value;
		addUser(email, password);
		e.preventDefault();
	}

	return (
		<FormTemplate
			title="Register"
			handler={registerHandler}
			submitButton="Sign Up"
		/>
	);
}

export default Register;
