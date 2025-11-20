import { login, signup } from "./actions";

export default function LoginPage() {
	return (
		<form>
			<label htmlFor="email">Email:</label>
			<input id="email" name="email" type="email" required />
			<label htmlFor="password">Password:</label>
			<button formAction={login}>Log in</button>
		</form>
	);
}
