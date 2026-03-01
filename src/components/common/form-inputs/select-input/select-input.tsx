interface SelectOption {
	value: string
	label: string
}

interface SelectInputProps {
	label: string
	id: string
	required?: boolean
	value: string
	onChange: (value: string) => void
	message?: string
	options: SelectOption[]
}

export function SelectInput({
	label,
	id,
	required,
	value,
	onChange,
	message,
	options,
}: SelectInputProps) {
	return (
		<div className="form-control">
			<label htmlFor={id}>{label}</label>
			<select
				value={value}
				onChange={(e) => onChange(e.target.value)}
				id={id}
				required={required ? true : undefined}
			>
				<option value="">Select {label.toLowerCase()}</option>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			{message ? <span className="message">{message}</span> : ''}
		</div>
	)
}
