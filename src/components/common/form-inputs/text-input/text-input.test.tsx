import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import TextInput from './text-input'

describe('TextInput', () => {
	const mockOnChange = vi.fn()
	const defaultProps = {
		label: 'Test Label',
		onChange: mockOnChange,
		id: 'test-input',
	}

	beforeEach(() => {
		mockOnChange.mockClear()
		cleanup()
	})

	it('renders label correctly', () => {
		render(<TextInput {...defaultProps} />)
		expect(screen.getByText('Test Label')).toBeTruthy()
	})

	it('renders input element with default type text', () => {
		render(<TextInput {...defaultProps} />)
		const inputElement = screen.getByRole('textbox') as HTMLInputElement
		expect(inputElement.type).toBe('text')
	})

	it('calls onChange with correct value when input changes', () => {
		render(<TextInput {...defaultProps} />)
		const inputElement = screen.getByRole('textbox')

		fireEvent.change(inputElement, { target: { value: 'test value' } })

		expect(mockOnChange).toHaveBeenCalledWith('test value')
		expect(mockOnChange).toHaveBeenCalledTimes(1)
	})

	it('renders with custom id and name props', () => {
		render(<TextInput {...defaultProps} id="custom-id" name="custom-name" />)
		const inputElement = screen.getByRole('textbox') as HTMLInputElement
		expect(inputElement.id).toBe('custom-id')
		expect(inputElement.name).toBe('custom-name')
	})

	it('sets value prop correctly', () => {
		render(<TextInput {...defaultProps} value="initial value" />)
		const inputElement = screen.getByRole('textbox') as HTMLInputElement
		expect(inputElement.value).toBe('initial value')
	})

	it('renders with placeholder text', () => {
		render(<TextInput {...defaultProps} placeholder="Enter text here" />)
		const inputElement = screen.getByRole('textbox') as HTMLInputElement
		expect(inputElement.placeholder).toBe('Enter text here')
	})

	it('renders with custom input type', () => {
		render(<TextInput {...defaultProps} id="email-input" type="email" />)
		const inputElement = screen.getByRole('textbox') as HTMLInputElement
		expect(inputElement.type).toBe('email')
	})

	it('renders with required attribute when required prop is true', () => {
		render(<TextInput {...defaultProps} required={true} />)
		const inputElement = screen.getByRole('textbox') as HTMLInputElement
		expect(inputElement.required).toBe(true)
	})

	it('renders with disabled attribute when disabled prop is true', () => {
		render(<TextInput {...defaultProps} disabled={true} />)
		const inputElement = screen.getByRole('textbox') as HTMLInputElement
		expect(inputElement.disabled).toBe(true)
	})

	it('label is associated with input element', () => {
		render(<TextInput {...defaultProps} id="test-input-custom" />)
		const label = screen.getByText('Test Label') as HTMLLabelElement
		expect(label.htmlFor).toBe('test-input-custom')
	})

	it('handles multiple onChange calls correctly', () => {
		render(<TextInput {...defaultProps} />)
		const inputElement = screen.getByRole('textbox')

		fireEvent.change(inputElement, { target: { value: 'first' } })
		fireEvent.change(inputElement, { target: { value: 'second' } })

		expect(mockOnChange).toHaveBeenCalledTimes(2)
		expect(mockOnChange).toHaveBeenNthCalledWith(1, 'first')
		expect(mockOnChange).toHaveBeenNthCalledWith(2, 'second')
	})
})
