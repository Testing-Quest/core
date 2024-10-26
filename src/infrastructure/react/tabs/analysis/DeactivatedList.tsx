import React, { useEffect, useRef, useState } from 'react'
import { Card, Button, Popover, Typography } from 'antd'
import { DeleteOutlined, DownOutlined } from '@ant-design/icons'
import styles from './AnalysisTab.module.css'
import { useSettings } from '../../context/useSettings'

const { Title } = Typography

type DeactivatedListProps = {
  items: number[]
  title: string
  onClear(): void
}

const DeactivatedList: React.FC<DeactivatedListProps> = ({ items, title, onClear }) => {
  const [hasMore, setHasMore] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)
  const { fontSize } = useSettings()

  useEffect(() => {
    if (textRef.current) {
      const { scrollWidth, clientWidth } = textRef.current
      setHasMore(scrollWidth > clientWidth)
    }
  }, [items])

  const visibleItems = items.join(', ')
  const popoverContent = <div className={styles.popoverContent}>{visibleItems}</div>

  return (
    <Card className={styles.card}>
      <div className={styles.cardHeader}>
        <Title level={5} className={styles.cardTitle} style={{ fontSize }}>
          {title}
        </Title>
        {items.length > 0 && <Button icon={<DeleteOutlined />} size='small' onClick={onClear} />}
      </div>
      <div className={styles.cardContent}>
        <div ref={textRef} className={styles.cardText} style={{ fontSize }}>
          {visibleItems}
          {hasMore ? '...' : ''}
        </div>
        {hasMore && (
          <Popover content={popoverContent} trigger='click' placement='bottom'>
            <Button size='small' icon={<DownOutlined />} className={styles.moreButton} />
          </Popover>
        )}
      </div>
    </Card>
  )
}

export default DeactivatedList
