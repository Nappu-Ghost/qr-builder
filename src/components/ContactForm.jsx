import React, { useEffect, useState } from 'react'

export default function ContactForm({ initialData = {}, onChange }) {
  const [data, setData] = useState(initialData)

  useEffect(() => setData(initialData), [initialData])

  function update(key, value) {
    const next = { ...data, [key]: value }
    setData(next)
    onChange && onChange(next)
  }

  return (
    <div className="glass-panel" style={{ padding: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <input value={data['Firstname'] || ''} onChange={e => update('Firstname', e.target.value)} placeholder="First name" />
        <input value={data['Lastname'] || ''} onChange={e => update('Lastname', e.target.value)} placeholder="Last name" />
        <input value={data['Organization'] || ''} onChange={e => update('Organization', e.target.value)} placeholder="Organization" />
        <input value={data['Position (Work)'] || ''} onChange={e => update('Position (Work)', e.target.value)} placeholder="Position (Work)" />
        <input value={data['Phone (Work)'] || ''} onChange={e => update('Phone (Work)', e.target.value)} placeholder="Phone (Work)" />
        <input value={data['Phone (Mobile)'] || ''} onChange={e => update('Phone (Mobile)', e.target.value)} placeholder="Phone (Mobile)" />
        <input value={data['Email'] || ''} onChange={e => update('Email', e.target.value)} placeholder="Email" />
        <input value={data['Street'] || ''} onChange={e => update('Street', e.target.value)} placeholder="Street" />
        <input value={data['Zipcode'] || ''} onChange={e => update('Zipcode', e.target.value)} placeholder="Zipcode" />
        <input value={data['City'] || ''} onChange={e => update('City', e.target.value)} placeholder="City" />
      </div>
    </div>
  )
}
