'use client'

import { ChangeEvent } from 'react'

interface SelectOption {
	value: string
	label: string
}

interface SelectInputProps {
	label: string
	options: SelectOption[]
	onChange: (value: string) => void
	value?: string
	name?: string
	id: string
	required?: boolean
	disabled?: boolean
}

export default function SelectInput({
	label,
	options,
	onChange,
	value = '',
	name = 'select-input',
	id = 'select-input',
	required = false,
	disabled = false,
}: SelectInputProps) {
	const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
		onChange(event.target.value)
	}

	return (
		<div className="form-input form-input--select">
			<label htmlFor={id}>{label}</label>
			<select
				name={name}
				id={id}
				value={value}
				onChange={handleChange}
				required={required}
				disabled={disabled}
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	)
}
