import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import SelectInput from './select-input'

describe('SelectInput', () => {
	const mockOnChange = vi.fn()
	const defaultProps = {
		label: 'Test Label',
		options: [
			{ value: 'option1', label: 'Option 1' },
			{ value: 'option2', label: 'Option 2' },
			{ value: 'option3', label: 'Option 3' },
		],
		onChange: mockOnChange,
		id: 'test-select',
	}

	beforeEach(() => {
		mockOnChange.mockClear()
		cleanup()
	})

	it('renders label correctly', () => {
		render(<SelectInput {...defaultProps} />)
		expect(screen.getByText('Test Label')).toBeTruthy()
	})

	it('renders all options', () => {
		render(<SelectInput {...defaultProps} />)
		const selectElement = screen.getByRole('combobox') as HTMLSelectElement
		expect(selectElement.options.length).toBe(4) // 1 default + 3 options
		expect(selectElement.options[0].text).toBe('-- Select an option --')
		expect(selectElement.options[1].text).toBe('Option 1')
		expect(selectElement.options[2].text).toBe('Option 2')
		expect(selectElement.options[3].text).toBe('Option 3')
	})

	it('calls onChange with correct value when selection changes', () => {
		render(<SelectInput {...defaultProps} />)
		const selectElement = screen.getByRole('combobox')

		fireEvent.change(selectElement, { target: { value: 'option2' } })

		expect(mockOnChange).toHaveBeenCalledWith('option2')
		expect(mockOnChange).toHaveBeenCalledTimes(1)
	})

	it('renders with custom id and name props', () => {
		render(<SelectInput {...defaultProps} id="custom-id" name="custom-name" />)
		const selectElement = screen.getByRole('combobox') as HTMLSelectElement
		expect(selectElement.id).toBe('custom-id')
		expect(selectElement.name).toBe('custom-name')
	})

	it('sets value prop correctly', () => {
		render(<SelectInput {...defaultProps} value="option2" />)
		const selectElement = screen.getByRole('combobox') as HTMLSelectElement
		expect(selectElement.value).toBe('option2')
	})

	it('renders with required attribute when required prop is true', () => {
		render(<SelectInput {...defaultProps} required={true} />)
		const selectElement = screen.getByRole('combobox') as HTMLSelectElement
		expect(selectElement.required).toBe(true)
	})

	it('renders with disabled attribute when disabled prop is true', () => {
		render(<SelectInput {...defaultProps} disabled={true} />)
		const selectElement = screen.getByRole('combobox') as HTMLSelectElement
		expect(selectElement.disabled).toBe(true)
	})

	it('label is associated with select element', () => {
		render(<SelectInput {...defaultProps} id="test-select-custom" />)
		const label = screen.getByText('Test Label') as HTMLLabelElement
		expect(label.htmlFor).toBe('test-select-custom')
	})

	it('handles multiple onChange calls correctly', () => {
		render(<SelectInput {...defaultProps} />)
		const selectElement = screen.getByRole('combobox')

		fireEvent.change(selectElement, { target: { value: 'option1' } })
		fireEvent.change(selectElement, { target: { value: 'option3' } })

		expect(mockOnChange).toHaveBeenCalledTimes(2)
		expect(mockOnChange).toHaveBeenNthCalledWith(1, 'option1')
		expect(mockOnChange).toHaveBeenNthCalledWith(2, 'option3')
	})
})
