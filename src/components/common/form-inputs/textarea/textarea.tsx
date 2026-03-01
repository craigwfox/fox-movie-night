interface TextareaProps {
	label: string
	id: string
	required?: boolean
	value: string
	onChange: (value: string) => void
	message?: string
	rowCount?: number
}

export function Textarea({
	label,
	id,
	required,
	value,
	onChange,
	message,
	rowCount
}: TextareaProps) {
	return (
		<div className="form-control">
			<label htmlFor={id}>{label}</label>
			<textarea
				value={value}
				onChange={(e) => onChange(e.target.value)}
				id={id}
				required={required ? true : undefined}
				rows={rowCount ? rowCount : 10}
			/>
			{message ? <span className="message">{message}</span> : ''}
		</div>
	)
}
