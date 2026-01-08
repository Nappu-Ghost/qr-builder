import { useState, useCallback } from 'react'
import BatchUpload from './components/BatchUpload'
import ContactForm from './components/ContactForm'
import QRDisplay from './components/QRDisplay'
import ExportPanel from './components/ExportPanel'
import { generateVCard } from './utils/vcard'

function App() {
  const [mode, setMode] = useState('landing') // landing, individual, batch-review
  const [qrData, setQrData] = useState([]) // Array of contact objects
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Customization State
  const [qrSettings, setQrSettings] = useState({
    fgColor: '#000000',
    bgColor: '#ffffff',
    level: 'M'
  })

  const currentContact = qrData[selectedIndex] || {}
  const currentVCard = generateVCard(currentContact)

  const handleBatchLoaded = (data) => {
    setQrData(data)
    setSelectedIndex(0)
    setMode('batch-review')
  }

  const startIndividual = () => {
    setQrData([{}]) // Start with one empty contact
    setSelectedIndex(0)
    setMode('individual')
  }

  const handleContactChange = useCallback((newData) => {
    setQrData(prev => {
      const copy = [...prev]
      copy[selectedIndex] = newData
      return copy
    })
  }, [selectedIndex])

  // Navigation Logic
  const canExport = qrData.length > 0

  return (
    <div className="app-container">
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ cursor: 'pointer', fontSize: '3rem', background: 'linear-gradient(to right, #a78bfa, #2dd4bf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} onClick={() => setMode('landing')}>
          QR Builder
        </h1>
        <p style={{ color: 'hsl(var(--color-text-muted))' }}>Premium VCard QR Generator</p>
      </header>

      {mode === 'landing' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', cursor: 'pointer' }} onClick={startIndividual}>
            <h2>Individual</h2>
            <p>Create a single custom QR Code</p>
          </div>
          <BatchUpload onDataLoaded={handleBatchLoaded} />
        </div>
      )}

      {(mode === 'individual' || mode === 'batch-review') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '2rem' }}>

          {/* Left Column: Input / List */}
          <div>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--color-border)' }} onClick={() => setMode('landing')}>Back</button>
              {mode === 'batch-review' && (
                <span>Editing {selectedIndex + 1} of {qrData.length}</span>
              )}
            </div>

            <ContactForm initialData={currentContact} onChange={handleContactChange} />

            {mode === 'batch-review' && (
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '1rem 0' }}>
                {qrData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedIndex(idx)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: idx === selectedIndex ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                      color: idx === selectedIndex ? 'white' : 'var(--color-text-muted)',
                      border: '1px solid var(--color-border)',
                      minWidth: '40px'
                    }}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Preview & Customization */}
          <div>
            <div className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Visual Customization</h3>

              {/* Color Controls */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Foreground Color</label>
                <input type="color" value={qrSettings.fgColor} onChange={e => setQrSettings(s => ({ ...s, fgColor: e.target.value }))} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Background Color</label>
                <input type="color" value={qrSettings.bgColor} onChange={e => setQrSettings(s => ({ ...s, bgColor: e.target.value }))} />
              </div>

              {/* Preview */}
              <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
                <QRDisplay
                  value={currentVCard}
                  fgColor={qrSettings.fgColor}
                  bgColor={qrSettings.bgColor}
                />
              </div>

              <ExportPanel
                isBatch={mode === 'batch-review'}
                onExport={(options) => {
                  const dataToExport = mode === 'batch-review' ? qrData : [currentContact];
                  const exportOpts = { ...options, qrSettings };

                  // Logic: If batch OR multiple formats -> Zip. Else -> Single file.
                  const formatsCount = (options.includePng ? 1 : 0) + (options.includeSvg ? 1 : 0) + (options.includeVCard ? 1 : 0);

                  if (dataToExport.length > 1 || formatsCount > 1) {
                    import('./utils/exportUtils').then(mod => mod.processBatchExport(dataToExport, exportOpts));
                  } else {
                    // Single file export
                    import('./utils/exportUtils').then(mod => {
                      const filename = `${currentContact.firstName || 'contact'}_${currentContact.lastName || 'qrcode'}`;
                      if (options.includeVCard) mod.downloadVCard(generateVCard(currentContact), filename);
                      if (options.includePng) mod.downloadQRImage(generateVCard(currentContact), 'png', filename, qrSettings);
                      if (options.includeSvg) mod.downloadQRImage(generateVCard(currentContact), 'svg', filename, qrSettings);
                    });
                  }
                }}
              />

            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
