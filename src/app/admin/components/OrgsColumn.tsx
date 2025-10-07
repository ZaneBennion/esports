'use client';

import { Org } from '@/lib/db/schema';
import { createOrg } from '@/lib/actions/orgs';
import { useState } from 'react';
import styles from './Column.module.css';

type Region = 'amer' | 'pac' | 'emea' | 'cn' | 'all';

export default function OrgsColumn({ orgs }: { orgs: Org[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regionFilter, setRegionFilter] = useState<Region>('all');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      await createOrg(formData);
      e.currentTarget.reset();
    } catch (error) {
      console.error('Failed to create org:', error);
      alert('Failed to create org. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOrgClick = (org: Org) => {
    // Placeholder functionality - will be implemented later
    console.log('Org clicked:', org);
  };

  const filteredOrgs = regionFilter === 'all' 
    ? orgs 
    : orgs.filter(org => org.region === regionFilter);

  return (
    <div className={styles.column}>
      <h2 className={styles.columnTitle}>Organizations</h2>
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Organization name"
          required
          className={styles.input}
          disabled={isSubmitting}
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          required
          className={styles.input}
          disabled={isSubmitting}
        />
        <select
          name="region"
          required
          className={styles.select}
          disabled={isSubmitting}
        >
          <option value="">Select region</option>
          <option value="amer">Americas</option>
          <option value="pac">Pacific</option>
          <option value="emea">EMEA</option>
          <option value="cn">China</option>
        </select>
        <label className={styles.fileLabel}>
          Logo (SVG)
          <input
            type="file"
            name="logo"
            accept=".svg,image/svg+xml"
            className={styles.fileInput}
            disabled={isSubmitting}
          />
        </label>
        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Organization'}
        </button>
      </form>

      <div className={styles.filterContainer}>
        <label className={styles.filterLabel}>Filter by region:</label>
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value as Region)}
          className={styles.select}
        >
          <option value="all">All Regions</option>
          <option value="amer">Americas</option>
          <option value="pac">Pacific</option>
          <option value="emea">EMEA</option>
          <option value="cn">China</option>
        </select>
      </div>

      <div className={styles.list}>
        {filteredOrgs.length === 0 ? (
          <p className={styles.emptyText}>No organizations found</p>
        ) : (
          filteredOrgs.map((org) => (
            <div
              key={org.id}
              className={styles.listItem}
              onClick={() => handleOrgClick(org)}
            >
              <span className={styles.itemName}>{org.name}</span>
              <span className={styles.itemSlug}>{org.slug}</span>
              <span className={styles.itemRegion}>{org.region.toUpperCase()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

