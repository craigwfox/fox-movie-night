// converts date string to Jan 1, 2001
export function MMMDYYYY(date: string) {
	const dateItem = new Date(date.replaceAll('-', '/'))
	const day = dateItem.getDate()
	const month = dateItem.toLocaleString('default', { month: 'short' })
	const year = dateItem.getFullYear()

	return `${month} ${day}, ${year}`
}
