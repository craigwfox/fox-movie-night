import Link from "next/link";

export default function PageHeader() {
	return (
		<header className="page-header">
			<h1>What have we watched?</h1>
			<nav className="page-nav" aria-label="Primary">
				<ul>
					<li>
						<Link href="/">Home</Link>
					</li>
					<li>
						<Link href="/">Add movie</Link>
					</li>
				</ul>
			</nav>
		</header>
	);
}
