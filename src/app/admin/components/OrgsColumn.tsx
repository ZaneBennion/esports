'use client';

import { Org } from '@/lib/db/schema';
import { createOrg } from '@/lib/actions/orgs';
import { useState } from 'react';

type Region = 'amer' | 'pac' | 'emea' | 'cn' | 'all';

// Sub-component: Column Header
function ColumnHeader({ title }: { title: string }) {
  return (
    <h2 className="text-2xl font-semibold pb-4 border-b-2 border-foreground">
      {title}
    </h2>
  )
}

// Sub-component: Org Create Form
function OrgCreateForm({ onSubmit, isSubmitting }: { 
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isSubmitting: boolean 
}) {
  return (
    <form className="flex flex-col gap-3 pb-4 border-b-2 border-foreground" onSubmit={onSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Organization name"
        required
        className="p-2.5 border border-foreground/20 rounded-md bg-background text-foreground text-sm"
        disabled={isSubmitting}
      />
      <input
        type="text"
        name="country"
        placeholder="Country"
        required
        className="p-2.5 border border-foreground/20 rounded-md bg-background text-foreground text-sm"
        disabled={isSubmitting}
      />
      <select
        name="region"
        required
        className="p-2.5 border border-foreground/20 rounded-md bg-background text-foreground text-sm"
        disabled={isSubmitting}
      >
        <option value="">Select region</option>
        <option value="amer">Americas</option>
        <option value="pac">Pacific</option>
        <option value="emea">EMEA</option>
        <option value="cn">China</option>
      </select>
      <label className="flex flex-col gap-1.5 text-sm text-foreground/70 cursor-pointer">
        Logo (SVG)
        <input
          type="file"
          name="logo"
          accept=".svg,image/svg+xml"
          className="text-xs cursor-pointer"
          disabled={isSubmitting}
        />
      </label>
      <button 
        type="submit" 
        className="p-2.5 px-4 border-0 rounded-md bg-foreground text-background font-semibold text-sm cursor-pointer transition-all hover:opacity-90"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Create Organization'}
      </button>
    </form>
  )
}

// Sub-component: Region Filter
function RegionFilter({ value, onChange }: { value: Region, onChange: (value: Region) => void }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-foreground/70">Filter by region:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Region)}
        className="p-2.5 border border-foreground/20 rounded-md bg-background text-foreground text-sm"
      >
        <option value="all">All Regions</option>
        <option value="amer">Americas</option>
        <option value="pac">Pacific</option>
        <option value="emea">EMEA</option>
        <option value="cn">China</option>
      </select>
    </div>
  )
}

// Sub-component: Org List
function OrgList({ orgs, onOrgClick }: { orgs: Org[], onOrgClick: (org: Org) => void }) {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[var(--foreground)]/5 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-[var(--foreground)]/20 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-[var(--foreground)]/30">
      {orgs.length === 0 ? (
        <p className="text-center text-foreground/50 text-sm py-8 m-0">No organizations found</p>
      ) : (
        orgs.map((org) => (
          <div
            key={org.id}
            className="flex flex-col gap-1 p-3 rounded-lg bg-[var(--foreground)]/[0.03] cursor-pointer transition-all hover:bg-[var(--foreground)]/[0.08]"
            onClick={() => onOrgClick(org)}
          >
            <span className="font-semibold text-[15px]">{org.name}</span>
            <span className="text-xs text-foreground/50 font-semibold uppercase tracking-wider">{org.region.toUpperCase()}</span>
          </div>
        ))
      )}
    </div>
  )
}

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
    <div className="flex flex-col gap-4 bg-background rounded-xl p-6 border border-gray-200 h-[calc(100vh-200px)]">
      <ColumnHeader title="Organizations" />
      <OrgCreateForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      <RegionFilter value={regionFilter} onChange={setRegionFilter} />
      <OrgList orgs={filteredOrgs} onOrgClick={handleOrgClick} />
    </div>
  );
}

