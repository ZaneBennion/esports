interface ContentCardProps {
  content: {
    link: string
    orgId: number
  }
}

export function ContentCard({ content }: ContentCardProps) {
  return (
    <div>
      <h3>Content card</h3>
    </div>  
  )
}