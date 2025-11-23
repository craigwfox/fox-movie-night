import Link from "next/link";
import Image from "next/image";
import LogoDark from "@/src/images/logo-dark.svg";

export default function PageHeader() {
	return (
		<header className="page-header">
			<Link href="/">
				<Image
					src={LogoDark}
					alt="What have we watched"
					width={157}
					height={56}
					className="object-contain"
				/>
			</Link>
			<nav className="page-header__nav" aria-label="Primary">
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
