import { render, screen, fireEvent } from '@testing-library/react'
import { Textarea } from './textarea'

describe('Textarea', () => {
	const defaultProps = {
		label: 'Overview',
		id: 'overview',
		value: '',
		onChange: vi.fn(),
	}

	it('renders label and textarea element', () => {
		render(<Textarea {...defaultProps} />)
		expect(screen.getByLabelText('Overview')).toBeInTheDocument()
		expect(screen.getByRole('textbox')).toBeInTheDocument()
	})

	it('displays initial value', () => {
		render(<Textarea {...defaultProps} value="Test overview" />)
		expect(screen.getByRole('textbox')).toHaveValue('Test overview')
	})

	it('calls onChange when textarea value changes', () => {
		const onChange = vi.fn()
		render(<Textarea {...defaultProps} onChange={onChange} />)
		const textarea = screen.getByRole('textbox')
		fireEvent.change(textarea, { target: { value: 'New text' } })
		expect(onChange).toHaveBeenCalledWith('New text')
	})

	it('displays message when provided', () => {
		render(<Textarea {...defaultProps} message="This field is required" />)
		expect(screen.getByText('This field is required')).toBeInTheDocument()
	})

	it('sets required attribute when required prop is true', () => {
		render(<Textarea {...defaultProps} required />)
		expect(screen.getByRole('textbox')).toHaveAttribute('required')
	})
})
