import React from 'react'

type CustomCheckboxProps = {
  checked: boolean
  onChange(): void
  onClick(e: React.MouseEvent): void
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onChange, onClick }) => {
  return (
    <div
      onClick={e => {
        onClick(e)
        onChange()
      }}
      style={{
        width: '20px',
        height: '20px',
        border: '2px solid #8884d8',
        borderRadius: '4px',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      {checked && (
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '2px',
            backgroundColor: '#8884d8',
          }}
        />
      )}
    </div>
  )
}

export default CustomCheckbox
