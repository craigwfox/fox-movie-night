export class DateItem {
	date: Date
	day: number
	month: number
	monthShort: string
	year: number

	constructor(date: Date) {
		this.date = date
		this.day = this.date.getDate()
		this.month = this.date.getMonth()
		this.monthShort = this.date.toLocaleString('default', {
			month: 'short',
		})
		this.year = this.date.getFullYear()
	}

	get MMMDYYYY() {
		return `${this.monthShort} ${this.day}, ${this.year}`
	}

	get YYYYMMDD() {
		return `${this.year}-${this.month + 1}-${this.day}`
	}
}
