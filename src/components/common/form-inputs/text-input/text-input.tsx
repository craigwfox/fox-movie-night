interface InputProps {
	label: string
	id: string
	required?: boolean
	value: string
	onChange: (value: string) => void
	message?: string
}

export function TextInput({
	label,
	id,
	required,
	value,
	onChange,
	message,
}: InputProps) {
	return (
		<div className="form-control">
			<label htmlFor={id}>{label}</label>
			<input
				value={value}
				onChange={(e) => onChange(e.target.value)}
				type="text"
				id={id}
				required={required ? true : undefined}
			/>
			{message ? <span className="message">{message}</span> : ''}
		</div>
	)
}
