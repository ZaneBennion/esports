'use client'

import { useState, ReactNode } from 'react'

export type Tab = {
  id: string
  label: string
  content: ReactNode
}

type TabsProps = {
  tabs: Tab[]
}

// Sub-component: Tab Button
function TabButton({ 
  tab, 
  isActive, 
  onClick 
}: { 
  tab: Tab
  isActive: boolean
  onClick: () => void 
}) {
  return (
    <button
      onClick={onClick}
      className={`py-3 px-6 bg-transparent border-0 text-[var(--foreground)] text-base font-medium cursor-pointer relative transition-opacity ${
        isActive ? 'opacity-100 font-semibold after:content-[""] after:absolute after:-bottom-0.5 after:left-0 after:right-0 after:h-0.5 after:bg-[var(--foreground)]' : 'opacity-60 hover:opacity-80'
      }`}
    >
      {tab.label}
    </button>
  )
}

// Sub-component: Tab List
function TabList({ 
  tabs, 
  activeTab, 
  onTabChange 
}: { 
  tabs: Tab[]
  activeTab: string
  onTabChange: (id: string) => void 
}) {
  return (
    <div className="flex gap-2 border-b-2 border-[var(--foreground)] mb-8">
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}
          tab={tab}
          isActive={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        />
      ))}
    </div>
  )
}

// Sub-component: Tab Panel
function TabPanel({ content }: { content: ReactNode }) {
  return (
    <div className="animate-[fadeIn_0.2s_ease-in]">
      {content}
    </div>
  )
}

export default function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id)

  if (tabs.length === 0) {
    return null
  }

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content

  return (
    <div className="w-full">
      <TabList tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <TabPanel content={activeTabContent} />
    </div>
  )
}

