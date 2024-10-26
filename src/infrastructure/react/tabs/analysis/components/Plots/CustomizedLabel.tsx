/* eslint-disable @typescript-eslint/no-explicit-any */
export const CustomizedLabel = (props: any) => {
  const { x, y, value, color } = props
  const finalColor = color ? color : '#4f4f4f'

  const labelWidth = 40
  const labelHeight = 25
  const arrowSize = 4
  const valid_x = x + 5

  return (
    <g>
      <rect
        x={valid_x - labelWidth / 2}
        y={y - labelHeight - arrowSize - 5}
        width={labelWidth}
        height={labelHeight}
        fill={finalColor}
        rx={4}
        ry={4}
      />
      <polygon
        points={`${valid_x - arrowSize},${y - arrowSize - 5} ${valid_x + arrowSize},${y - arrowSize - 5} ${valid_x},${y - 5}`}
        fill={finalColor}
      />
      <text
        x={valid_x}
        y={y - labelHeight / 2 - arrowSize - 5}
        dy={4}
        fill='white'
        fontSize={12}
        fontWeight='bold'
        textAnchor='middle'
        alignmentBaseline='middle'
      >
        {value}
      </text>
    </g>
  )
}
