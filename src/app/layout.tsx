import type { Metadata } from 'next'
import { Suspense } from 'react'
import '../styles/styles.css'
import { Figtree } from 'next/font/google'
import PageFooter from '../components/layout/page-footer'
import PageHeader from '../components/layout/page-header'

const figtreeSans = Figtree({
	variable: '--font-figtree-sans',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Fox Movie Nights',
	description: 'A list of movies that we have watched',
	icons: {
		icon: '/favicon.svg',
		apple: '/apple-touch-icon.png',
		other: [
			{
				rel: 'icon',
				url: '/icon-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				rel: 'icon',
				url: '/icon-512x512.png',
				sizes: '512x512',
				type: 'image/png',
			},
		],
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`${figtreeSans.variable}`}>
				<Suspense fallback={<header className="page-header" />}>
					<PageHeader />
				</Suspense>
				{children}
				<PageFooter />
			</body>
		</html>
	)
}
