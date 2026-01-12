import React, { useState, useRef } from 'react'
import Papa from 'papaparse'

const VCARD_FIELDS = [
  'Firstname', 'Lastname', 'Organization', 'Position (Work)',
  'Phone (Work)', 'Phone (Mobile)', 'Email', 'Street', 'Zipcode', 'City'
]

function autoMap(headers) {
  const map = {}
  const hLower = headers.map(h => h.toLowerCase())
  const guess = (candidates) => {
    for (const cand of candidates) {
      const idx = hLower.indexOf(cand.toLowerCase())
      if (idx !== -1) return headers[idx]
    }
    return null
  }

  map['Firstname'] = guess(['firstname', 'first name', 'givenname', 'given name'])
  map['Lastname'] = guess(['lastname', 'last name', 'surname', 'familyname'])
  map['Email'] = guess(['email', 'e-mail', 'email address'])
  map['Phone (Mobile)'] = guess(['mobile', 'phone (mobile)', 'phone_mobile', 'mobilephone', 'cell']) || guess(['phone', 'phone (work)'])
  map['Phone (Work)'] = guess(['phone (work)', 'phone_work', 'work phone', 'phone'])
  map['Organization'] = guess(['organization', 'company', 'org'])
  map['Position (Work)'] = guess(['position', 'title', 'role'])
  map['Street'] = guess(['street', 'address', 'street address'])
  map['Zipcode'] = guess(['zipcode', 'zip', 'postalcode', 'postal code'])
  map['City'] = guess(['city', 'town'])

  return map
}

export default function BatchUpload({ onDataLoaded }) {
  const inputRef = useRef(null)
  const [headers, setHeaders] = useState([])
  const [rows, setRows] = useState([]) // array of parsed objects (original headers)
  const [mapping, setMapping] = useState({})
  const [previewContacts, setPreviewContacts] = useState([])

  function parseText(text) {
    const res = Papa.parse(text, { header: true, skipEmptyLines: true })
    if (res.errors && res.errors.length) {
      console.warn('PapaParse errors', res.errors)
    }
    const hdrs = res.meta.fields || []
    setHeaders(hdrs)
    setRows(res.data || [])
    setMapping(prev => ({ ...autoMap(hdrs), ...prev }))
    setPreviewContacts([])
  }

  function handleFile(file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        parseText(e.target.result || '')
      } catch (err) {
        console.error('Failed to parse CSV', err)
        alert('Failed to parse CSV file')
      }
    }
    reader.readAsText(file, 'utf-8')
  }

  function loadExample() {
    fetch('/template/examplelist.csv').then(r => r.text()).then(t => parseText(t)).catch(err => {
      console.error(err)
      alert('Failed to load example CSV')
    })
  }

  function updateMap(field, header) {
    setMapping(m => {
      const next = { ...m, [field]: header }
      return next
    })
  }

  function buildContactsFromMapping() {
    const contacts = rows.map(r => {
      const c = {}
      for (const f of VCARD_FIELDS) {
        const h = mapping[f]
        if (h && r[h] !== undefined) c[f] = (r[h] || '').toString().trim()
      }
      return c
    })
    setPreviewContacts(contacts.slice(0, 20))
    return contacts
  }

  React.useEffect(() => {
    // update preview automatically when mapping or rows change
    if (rows.length === 0) return
    buildContactsFromMapping()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapping, rows])

  function confirmImport() {
    const contacts = buildContactsFromMapping().filter(c => Object.values(c).some(v => v && String(v).trim() !== ''))
    if (contacts.length === 0) return alert('No contacts to import. Check mapping and CSV file.')
    onDataLoaded && onDataLoaded(contacts)
    // reset
    setHeaders([])
    setRows([])
    setMapping({})
    setPreviewContacts([])
  }

  function autoMapClick() {
    setMapping(autoMap(headers))
  }

  return (
    <div className="glass-panel hover-scale" style={{ padding: '2rem', textAlign: 'center', cursor: 'default', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1rem' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><polyline points="7 10 12 15 17 10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></polyline><line x1="12" y1="15" x2="12" y2="3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></line></svg>
      </div>

      <h2 style={{ marginBottom: '0.25rem' }}>Batch Upload</h2>
      <p style={{ marginBottom: '1rem', color: 'var(--color-text-muted)' }}>Upload a CSV of contacts (see template/examplelist.csv). Map columns to vCard fields before import.</p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input ref={inputRef} type="file" accept=".csv,text/csv" style={{ display: 'none' }} onChange={e => e.target.files && e.target.files[0] && handleFile(e.target.files[0])} />
        <button className="btn-primary" onClick={() => inputRef.current && inputRef.current.click()}>Upload CSV</button>
        <button className="btn-ghost" onClick={loadExample}>Use Example</button>
        <button className="btn-ghost" onClick={autoMapClick}>Auto-map</button>
      </div>

      {headers.length > 0 && (
        <div style={{ width: '100%', marginTop: '0.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Header Mapping</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.5rem' }}>
            {VCARD_FIELDS.map(f => (
              <div key={f} style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>{f}</label>
                <select value={mapping[f] || ''} onChange={e => updateMap(f, e.target.value)}>
                  <option value="">— ignore —</option>
                  {headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: 'var(--color-text-muted)' }}>{rows.length} rows detected</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-ghost" onClick={() => { setHeaders([]); setRows([]); setMapping({}); setPreviewContacts([]) }}>Cancel</button>
              <button className="btn-primary" onClick={confirmImport}>Import {rows.length} contacts</button>
            </div>
          </div>

          {previewContacts.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>Preview (first {previewContacts.length} contacts)</h4>
              <div style={{ maxHeight: 220, overflow: 'auto', border: '1px solid var(--color-border)', borderRadius: 6, padding: 8 }}>
                {previewContacts.map((c, i) => (
                  <div key={i} style={{ padding: '0.5rem 0', borderBottom: '1px dashed var(--color-border)' }}>
                    <div style={{ fontWeight: 600 }}>{(c['Firstname'] || '') + ' ' + (c['Lastname'] || '')}</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{c['Email'] || c['Phone (Mobile)'] || c['Phone (Work)']}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
