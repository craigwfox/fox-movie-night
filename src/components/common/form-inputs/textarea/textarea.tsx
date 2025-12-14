'use client'

import { ChangeEvent } from 'react'

interface TextareaProps {
	label: string
	onChange: (value: string) => void
	value?: string
	name?: string
	id: string
	placeholder?: string
	required?: boolean
	disabled?: boolean
	rows?: number
}

export default function Textarea({
	label,
	onChange,
	value = '',
	name = 'textarea',
	id = 'textarea',
	placeholder = '',
	required = false,
	disabled = false,
	rows = 4,
}: TextareaProps) {
	const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		onChange(event.target.value)
	}

	return (
		<div className="form-input form-input--textarea">
			<label htmlFor={id}>{label}</label>
			<textarea
				name={name}
				id={id}
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
				required={required}
				disabled={disabled}
				rows={rows}
			/>
		</div>
	)
}
