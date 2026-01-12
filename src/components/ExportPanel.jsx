import React, { useState } from 'react'

export default function ExportPanel({ isBatch, onExport, exporting, progress, errors }) {
  const [size, setSize] = useState(1024)
  const [format, setFormat] = useState('png')

  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
        <label style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Size</label>
        <input type="number" value={size} onChange={e => setSize(Number(e.target.value) || 1024)} style={{ width: 100 }} />
        <label style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Format</label>
        <select value={format} onChange={e => setFormat(e.target.value)}>
          <option value="png">PNG</option>
          <option value="svg">SVG</option>
        </select>
      </div>

      <button disabled={exporting} className="btn-primary" onClick={() => onExport && onExport({ format, size, isBatch })}>
        {exporting ? `Exporting (${progress?.index || 0}/${progress?.total || 0})` : `Export ${isBatch ? 'Batch' : 'Single'}`}
      </button>

      {exporting && (
        <div style={{ marginTop: '0.5rem' }}>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ width: `${Math.round(((progress?.index || 0) / (progress?.total || 1)) * 100)}%`, height: '100%', background: 'linear-gradient(90deg,#a78bfa,#2dd4bf)' }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 6 }}>Processed {progress?.index || 0} / {progress?.total || 0}</div>
          {errors && errors.length > 0 && (
            <div style={{ marginTop: 6, color: '#fca5a5', fontSize: 12 }}>
              <strong>Errors:</strong>
              <ul style={{ margin: '6px 0 0', paddingLeft: 16 }}>
                {errors.map((e, idx) => <li key={idx}>{`Row ${e.index}: ${e.error}`}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
