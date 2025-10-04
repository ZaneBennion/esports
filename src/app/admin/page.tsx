import Link from 'next/link';
import styles from './page.module.css';

export default function Admin() {
  const adminPages = [
    {
      title: 'Content',
      href: '/admin/content',
      description: 'Manage content and links',
      icon: '📝'
    },
    {
      title: 'Organizations',
      href: '/admin/orgs',
      description: 'Manage esports organizations',
      icon: '🏢'
    },
    {
      title: 'Events',
      href: '/admin/events',
      description: 'Manage esports events',
      icon: '🎮'
    },
    {
      title: 'Games',
      href: '/admin/games',
      description: 'Manage games and titles',
      icon: '🎯'
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p className={styles.subtitle}>Manage your esports platform</p>
      </div>
      
      <div className={styles.grid}>
        {adminPages.map((page) => (
          <Link 
            key={page.href} 
            href={page.href}
            className={styles.card}
          >
            <div className={styles.icon}>{page.icon}</div>
            <h2 className={styles.cardTitle}>{page.title}</h2>
            <p className={styles.cardDescription}>{page.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}