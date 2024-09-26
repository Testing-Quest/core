import React from 'react'
import { Typography } from 'antd'

const { Text } = Typography

type AnalysisTabProps = {
  tabName: string
}

const AnalysisTab: React.FC<AnalysisTabProps> = ({ tabName }) => {
  return (
    <div className='p-4'>
      <Text className='text-base'>Analysis content for {tabName} goes here.</Text>
    </div>
  )
}

export default AnalysisTab
