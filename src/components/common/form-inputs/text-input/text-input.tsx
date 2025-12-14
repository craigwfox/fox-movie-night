'use client'

import { ChangeEvent } from 'react'

interface TextInputProps {
	label: string
	onChange: (value: string) => void
	value?: string
	name?: string
	id: string
	type?: string
	placeholder?: string
	required?: boolean
	disabled?: boolean
}

export default function TextInput({
	label,
	onChange,
	value = '',
	name = 'text-input',
	id = 'text-input',
	type = 'text',
	placeholder = '',
	required = false,
	disabled = false,
}: TextInputProps) {
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		onChange(event.target.value)
	}

	return (
		<div className="form-input form-input--text">
			<label htmlFor={id}>{label}</label>
			<input
				type={type}
				name={name}
				id={id}
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
				required={required}
				disabled={disabled}
			/>
		</div>
	)
}
