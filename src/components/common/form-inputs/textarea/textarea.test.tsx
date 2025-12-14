import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import Textarea from './textarea'

describe('Textarea', () => {
	const mockOnChange = vi.fn()
	const defaultProps = {
		label: 'Test Label',
		onChange: mockOnChange,
		id: 'test-textarea',
	}

	beforeEach(() => {
		mockOnChange.mockClear()
		cleanup()
	})

	it('renders label correctly', () => {
		render(<Textarea {...defaultProps} />)
		expect(screen.getByText('Test Label')).toBeTruthy()
	})

	it('renders textarea element', () => {
		render(<Textarea {...defaultProps} />)
		const textareaElement = screen.getByRole('textbox')
		expect(textareaElement).toBeTruthy()
	})

	it('calls onChange with correct value when textarea changes', () => {
		render(<Textarea {...defaultProps} />)
		const textareaElement = screen.getByRole('textbox')

		fireEvent.change(textareaElement, { target: { value: 'test value' } })

		expect(mockOnChange).toHaveBeenCalledWith('test value')
		expect(mockOnChange).toHaveBeenCalledTimes(1)
	})

	it('renders with custom id and name props', () => {
		render(<Textarea {...defaultProps} id="custom-id" name="custom-name" />)
		const textareaElement = screen.getByRole('textbox') as HTMLTextAreaElement
		expect(textareaElement.id).toBe('custom-id')
		expect(textareaElement.name).toBe('custom-name')
	})

	it('sets value prop correctly', () => {
		render(<Textarea {...defaultProps} value="initial value" />)
		const textareaElement = screen.getByRole('textbox') as HTMLTextAreaElement
		expect(textareaElement.value).toBe('initial value')
	})

	it('renders with placeholder text', () => {
		render(<Textarea {...defaultProps} placeholder="Enter text here" />)
		const textareaElement = screen.getByRole('textbox') as HTMLTextAreaElement
		expect(textareaElement.placeholder).toBe('Enter text here')
	})

	it('renders with custom rows prop', () => {
		render(<Textarea {...defaultProps} id="rows-test" rows={8} />)
		const textareaElement = screen.getByRole('textbox') as HTMLTextAreaElement
		expect(textareaElement.rows).toBe(8)
	})

	it('renders with default rows when not specified', () => {
		render(<Textarea {...defaultProps} />)
		const textareaElement = screen.getByRole('textbox') as HTMLTextAreaElement
		expect(textareaElement.rows).toBe(4)
	})

	it('renders with required attribute when required prop is true', () => {
		render(<Textarea {...defaultProps} required={true} />)
		const textareaElement = screen.getByRole('textbox') as HTMLTextAreaElement
		expect(textareaElement.required).toBe(true)
	})

	it('renders with disabled attribute when disabled prop is true', () => {
		render(<Textarea {...defaultProps} disabled={true} />)
		const textareaElement = screen.getByRole('textbox') as HTMLTextAreaElement
		expect(textareaElement.disabled).toBe(true)
	})

	it('label is associated with textarea element', () => {
		render(<Textarea {...defaultProps} id="test-textarea-custom" />)
		const label = screen.getByText('Test Label') as HTMLLabelElement
		expect(label.htmlFor).toBe('test-textarea-custom')
	})

	it('handles multiple onChange calls correctly', () => {
		render(<Textarea {...defaultProps} />)
		const textareaElement = screen.getByRole('textbox')

		fireEvent.change(textareaElement, { target: { value: 'first' } })
		fireEvent.change(textareaElement, { target: { value: 'second' } })

		expect(mockOnChange).toHaveBeenCalledTimes(2)
		expect(mockOnChange).toHaveBeenNthCalledWith(1, 'first')
		expect(mockOnChange).toHaveBeenNthCalledWith(2, 'second')
	})
})
