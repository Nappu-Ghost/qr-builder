import { useState, useCallback, useEffect } from 'react'
import BatchUpload from './components/BatchUpload'
import ContactForm from './components/ContactForm'
import QRCodeStyled from './components/QRCodeStyled'
import ExportPanel from './components/ExportPanel'
import { generateVCard } from './utils/vcard'
import { ArrowLeft, User, QrCode, Sparkles, Shapes } from 'lucide-react'

function App() {
  const [mode, setMode] = useState('landing') // landing, individual, batch-review
  const [qrData, setQrData] = useState([]) // Array of contact objects
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Customization State
  const [qrSettings, setQrSettings] = useState({
    fgColor: '#000000',
    bgColor: '#ffffff',
    dotsType: 'square', // square, dots, rounded, extra-rounded, classy, classy-rounded
    cornerSquareType: 'square', // dot, square, extra-rounded
    cornerDotType: 'square' // dot, square
  })

  // Options for dropdowns
  const dotsOptions = ['square', 'dots', 'rounded', 'extra-rounded', 'classy', 'classy-rounded'];
  const cornerSquareOptions = ['square', 'dot', 'extra-rounded'];
  const cornerDotOptions = ['square', 'dot'];

  const currentContact = qrData[selectedIndex] || {}
  const currentVCard = generateVCard(currentContact)

  // Memoized style options for the QR component
  const styleOptions = {
    dotsOptions: {
      type: qrSettings.dotsType,
      color: qrSettings.fgColor
    },
    backgroundOptions: {
      color: qrSettings.bgColor,
    },
    cornersSquareOptions: {
      type: qrSettings.cornerSquareType,
      color: qrSettings.fgColor
    },
    cornersDotOptions: {
      type: qrSettings.cornerDotType,
      color: qrSettings.fgColor
    }
  };

  const handleBatchLoaded = (data) => {
    setQrData(data)
    setSelectedIndex(0)
    setMode('batch-review')
  }

  const startIndividual = () => {
    setQrData([{}])
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
      <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <h1
          onClick={() => setMode('landing')}
          style={{
            cursor: 'pointer',
            fontSize: '3.5rem',
            fontWeight: '800',
            background: 'linear-gradient(to right, #a78bfa, #2dd4bf)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '0.5rem'
          }}
        >
          <QrCode size={48} color="#a78bfa" /> QR Builder
        </h1>
        <p style={{ color: 'hsl(var(--color-text-muted))', fontSize: '1.1rem' }}>Premium VCard QR Generator</p>
      </header>

      {mode === 'landing' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>

          <div
            className="glass-panel hover-scale"
            style={{ padding: '3rem', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            onClick={startIndividual}
          >
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
              <User size={48} color="hsl(var(--color-primary))" />
            </div>
            <h2>Individual Mode</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Create a single custom QR Code manually.</p>
          </div>

          <BatchUpload onDataLoaded={handleBatchLoaded} />
        </div>
      )}

      {(mode === 'individual' || mode === 'batch-review') && (
        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '2rem' }}>

          {/* Left Column: Input / List */}
          <div>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                className="btn-ghost"
                onClick={() => setMode('landing')}
              >
                <ArrowLeft size={18} /> Back to Home
              </button>
              {mode === 'batch-review' && (
                <span className="badge">Editing {selectedIndex + 1} / {qrData.length}</span>
              )}
            </div>

            <ContactForm initialData={currentContact} onChange={handleContactChange} />

            {mode === 'batch-review' && (
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '1rem 0' }}>
                {qrData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedIndex(idx)}
                    className={`pagination-dot ${idx === selectedIndex ? 'active' : ''}`}
                    title={`Contact ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Preview & Customization */}
          <div>
            <div className="glass-panel sticky-panel" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={20} className="text-secondary" /> Visual Customization
              </h3>

              {/* Color Controls */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Foreground</label>
                  <div className="color-picker-wrapper">
                    <input type="color" value={qrSettings.fgColor} onChange={e => setQrSettings(s => ({ ...s, fgColor: e.target.value }))} />
                    <span style={{ color: qrSettings.fgColor }}>{qrSettings.fgColor}</span>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Background</label>
                  <div className="color-picker-wrapper">
                    <input type="color" value={qrSettings.bgColor} onChange={e => setQrSettings(s => ({ ...s, bgColor: e.target.value }))} />
                    <span style={{ color: qrSettings.bgColor }}>{qrSettings.bgColor}</span>
                  </div>
                </div>
              </div>

              <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: 'var(--color-text-muted)' }}>
                <Shapes size={16} /> Shape Style
              </h4>

              {/* Shape Controls */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Dots Pattern</label>
                <select
                  value={qrSettings.dotsType}
                  onChange={e => setQrSettings(s => ({ ...s, dotsType: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', color: 'white' }}
                >
                  {dotsOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Corner Square</label>
                  <select
                    value={qrSettings.cornerSquareType}
                    onChange={e => setQrSettings(s => ({ ...s, cornerSquareType: e.target.value }))}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', color: 'white' }}
                  >
                    {cornerSquareOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Corner Dot</label>
                  <select
                    value={qrSettings.cornerDotType}
                    onChange={e => setQrSettings(s => ({ ...s, cornerDotType: e.target.value }))}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', color: 'white' }}
                  >
                    {cornerDotOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>

              {/* Preview */}
              <div className="qr-preview-container">
                <QRCodeStyled
                  value={currentVCard}
                  styleOptions={styleOptions}
                />
              </div>

              <ExportPanel
                isBatch={mode === 'batch-review'}
                onExport={(options) => {
                  const dataToExport = mode === 'batch-review' ? qrData : [currentContact];
                  const exportOpts = { ...options, qrSettings: styleOptions };

                  import('./utils/exportUtils').then(mod => {
                    mod.processBatchExportStyled(dataToExport, exportOpts)
                  });
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
