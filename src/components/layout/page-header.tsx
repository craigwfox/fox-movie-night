import Link from 'next/link'
import Image from 'next/image'
import LogoDark from '@/src/images/logo-dark.svg'
import { isUserLoggedIn } from '@/src/utils/supabase/auth'

export default async function PageHeader() {
	const loggedIn = await isUserLoggedIn()

	return (
		<header className="page-header">
			<Link href="/">
				<Image
					src={LogoDark}
					alt="What have we watched"
					width={157}
					height={56}
					className="object-contain"
					loading="eager"
				/>
			</Link>
			<nav className="page-header__nav" aria-label="Primary">
				<ul>
					<li>
						<Link href="/">Home</Link>
					</li>
					<li>
						{loggedIn ? (
							<Link href="/add-movie">Add movie</Link>
						) : (
							<Link href="/login">Login</Link>
						)}
					</li>
				</ul>
			</nav>
		</header>
	)
}
