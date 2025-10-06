'use client'

import { useState, ReactNode } from 'react'
import styles from './tabs.module.css'

export type Tab = {
  id: string
  label: string
  content: ReactNode
}

type TabsProps = {
  tabs: Tab[]
}

export default function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id)

  if (tabs.length === 0) {
    return null
  }

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabList}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>{activeTabContent}</div>
    </div>
  )
}

