async function getCurrentYear() {
	'use cache'
	return new Date().getFullYear()
}

export default async function PageFooter() {
	return (
		<footer className="page-footer">
			<p>
				&copy; {await getCurrentYear()}{' '}
				<a href="https://craigwfox.com">Craig Fox</a>
			</p>
		</footer>
	)
}
