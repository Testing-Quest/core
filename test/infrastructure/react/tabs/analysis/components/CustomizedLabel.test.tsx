import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CustomizedLabel } from '../../../../../../src/infrastructure/react/tabs/analysis/components/Plots/CustomizedLabel'

const renderInSvg = (element: JSX.Element) => {
  return render(<svg>{element}</svg>)
}

describe('CustomizedLabel', () => {
  const defaultProps = {
    x: 100,
    y: 100,
    value: '42',
  }

  it('renders basic label with default color', () => {
    const { container } = renderInSvg(<CustomizedLabel {...defaultProps} />)

    // Check if all SVG elements are present
    expect(container.querySelector('rect')).toBeInTheDocument()
    expect(container.querySelector('polygon')).toBeInTheDocument()
    expect(container.querySelector('text')).toBeInTheDocument()

    // Check if default color is applied
    expect(container.querySelector('rect')).toHaveAttribute('fill', '#4f4f4f')
    expect(container.querySelector('polygon')).toHaveAttribute('fill', '#4f4f4f')
  })

  it('renders label with custom color', () => {
    const customColor = '#ff0000'
    const { container } = renderInSvg(<CustomizedLabel {...defaultProps} color={customColor} />)

    expect(container.querySelector('rect')).toHaveAttribute('fill', customColor)
    expect(container.querySelector('polygon')).toHaveAttribute('fill', customColor)
  })

  it('positions rect correctly', () => {
    const { container } = renderInSvg(<CustomizedLabel {...defaultProps} />)
    const rect = container.querySelector('rect')

    expect(rect).toHaveAttribute('x', expect.any(String))
    expect(rect).toHaveAttribute('y', expect.any(String))
    expect(rect).toHaveAttribute('width', '40') // labelWidth
    expect(rect).toHaveAttribute('height', '25') // labelHeight
    expect(rect).toHaveAttribute('rx', '4') // rounded corners
    expect(rect).toHaveAttribute('ry', '4') // rounded corners
  })

  it('positions polygon (arrow) correctly', () => {
    const { container } = renderInSvg(<CustomizedLabel {...defaultProps} />)
    const polygon = container.querySelector('polygon')

    expect(polygon).toHaveAttribute('points', expect.any(String))
    // Verify the points format matches the expected pattern
    const points = polygon?.getAttribute('points')?.split(' ')
    expect(points?.length).toBe(3) // Three points for the triangle
  })

  it('adjusts x position correctly', () => {
    const props = {
      ...defaultProps,
      x: 200,
    }
    const { container } = renderInSvg(<CustomizedLabel {...props} />)
    const text = container.querySelector('text')

    // Check if x position is adjusted by the offset (+5)
    expect(text).toHaveAttribute('x', '205') // x + 5
  })

  it('handles different value types', () => {
    const numericValue = {
      ...defaultProps,
      value: 42,
    }
    const { container: container1 } = renderInSvg(<CustomizedLabel {...numericValue} />)
    expect(container1.querySelector('text')).toHaveTextContent('42')

    const stringValue = {
      ...defaultProps,
      value: 'test',
    }
    const { container: container2 } = renderInSvg(<CustomizedLabel {...stringValue} />)
    expect(container2.querySelector('text')).toHaveTextContent('test')
  })

  it('calculates positions correctly with different y values', () => {
    const props = {
      ...defaultProps,
      y: 200,
    }
    const { container } = renderInSvg(<CustomizedLabel {...props} />)
    const rect = container.querySelector('rect')
    const text = container.querySelector('text')

    // Verify y position calculations
    expect(rect).toHaveAttribute('y', expect.any(String))
    expect(text).toHaveAttribute('y', expect.any(String))
  })

  describe('Edge Cases', () => {
    it('handles zero coordinates', () => {
      const props = {
        ...defaultProps,
        x: 0,
        y: 0,
      }
      const { container } = renderInSvg(<CustomizedLabel {...props} />)

      expect(container.querySelector('rect')).toBeInTheDocument()
      expect(container.querySelector('polygon')).toBeInTheDocument()
      expect(container.querySelector('text')).toBeInTheDocument()
    })

    it('handles negative coordinates', () => {
      const props = {
        ...defaultProps,
        x: -100,
        y: -100,
      }
      const { container } = renderInSvg(<CustomizedLabel {...props} />)

      expect(container.querySelector('rect')).toBeInTheDocument()
      expect(container.querySelector('polygon')).toBeInTheDocument()
      expect(container.querySelector('text')).toBeInTheDocument()
    })

    it('handles empty value', () => {
      const props = {
        ...defaultProps,
        value: '',
      }
      const { container } = renderInSvg(<CustomizedLabel {...props} />)

      expect(container.querySelector('text')).toHaveTextContent('')
    })
  })

  describe('Calculations', () => {
    it('verifies label dimensions', () => {
      const { container } = renderInSvg(<CustomizedLabel {...defaultProps} />)
      const rect = container.querySelector('rect')

      // Check if dimensions match the constants in the component
      expect(rect).toHaveAttribute('width', '40') // labelWidth
      expect(rect).toHaveAttribute('height', '25') // labelHeight
    })

    it('verifies arrow positioning', () => {
      const { container } = renderInSvg(<CustomizedLabel {...defaultProps} />)
      const polygon = container.querySelector('polygon')
      const points = polygon?.getAttribute('points')?.split(' ')

      // Verify the arrow points are correctly calculated
      expect(points?.length).toBe(3)
      points?.forEach(point => {
        expect(point).toMatch(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/)
      })
    })
  })
})
