function FormTemplate({ title, handler, submitButton }) {
	return (
		<>
			<h2 className="custom-header">{title}</h2>
			<form className="user-form" action="" onSubmit={(e) => handler(e)}>
				<label>
					<div className="custom-header">Email:</div>
					<input type="email" name="email" placeholder="email" />
				</label>
				<label>
					<div className="custom-header">Password:</div>
					<input
						type="password"
						name="password"
						placeholder="password"
					/>
				</label>
				<button type="submit">{submitButton}</button>
			</form>
		</>
	);
}

export default FormTemplate;
