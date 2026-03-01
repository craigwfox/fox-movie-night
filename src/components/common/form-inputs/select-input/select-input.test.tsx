import { render, screen, fireEvent } from '@testing-library/react'
import { SelectInput } from './select-input'

describe('SelectInput', () => {
	const defaultProps = {
		label: 'Rating',
		id: 'rating',
		value: '',
		onChange: vi.fn(),
		options: [
			{ value: 'great', label: 'Great' },
			{ value: 'good', label: 'Good' },
			{ value: 'ok', label: 'Ok' },
		],
	}

	it('renders label and select element', () => {
		render(<SelectInput {...defaultProps} />)
		expect(screen.getByLabelText('Rating')).toBeInTheDocument()
		expect(screen.getByRole('combobox')).toBeInTheDocument()
	})

	it('renders all options', () => {
		render(<SelectInput {...defaultProps} />)
		expect(screen.getByRole('option', { name: 'Great' })).toBeInTheDocument()
		expect(screen.getByRole('option', { name: 'Good' })).toBeInTheDocument()
		expect(screen.getByRole('option', { name: 'Ok' })).toBeInTheDocument()
	})

	it('calls onChange when option is selected', () => {
		const onChange = vi.fn()
		render(<SelectInput {...defaultProps} onChange={onChange} />)
		const select = screen.getByRole('combobox')
		fireEvent.change(select, { target: { value: 'great' } })
		expect(onChange).toHaveBeenCalledWith('great')
	})

	it('displays message when provided', () => {
		render(<SelectInput {...defaultProps} message="This field is required" />)
		expect(screen.getByText('This field is required')).toBeInTheDocument()
	})

	it('sets required attribute when required prop is true', () => {
		render(<SelectInput {...defaultProps} required />)
		expect(screen.getByRole('combobox')).toHaveAttribute('required')
	})
})
