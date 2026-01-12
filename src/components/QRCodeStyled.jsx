import React, { useEffect, useRef, useState } from 'react'
import QRCodeStyling from 'qr-code-styling'

export default function QRCodeStyled({ value = '', styleOptions = {} }) {
  const containerRef = useRef(null)
  const qrRef = useRef(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // create instance on mount
    qrRef.current = new QRCodeStyling({
      width: 300,
      height: 300,
      data: value || '',
      imageOptions: { crossOrigin: 'anonymous', margin: 5 },
      dotsOptions: { type: styleOptions?.dotsOptions?.type || 'square', color: styleOptions?.dotsOptions?.color || '#000' },
      cornersSquareOptions: { type: styleOptions?.cornersSquareOptions?.type || 'square', color: styleOptions?.cornersSquareOptions?.color || '#000' },
      cornersDotOptions: { type: styleOptions?.cornersDotOptions?.type || 'square' },
      backgroundOptions: { color: styleOptions?.backgroundOptions?.color || '#fff' }
    })

    try {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
        qrRef.current.append(containerRef.current)
      }
    } catch (err) {
      console.error('QR append error', err)
      setHasError(true)
    }

    return () => {
      // cleanup
      try { if (containerRef.current) containerRef.current.innerHTML = '' } catch (e) {}
      qrRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!qrRef.current) return
    setHasError(false)
    try {
      qrRef.current.update({
        data: value || '',
        dotsOptions: { type: styleOptions?.dotsOptions?.type || 'square', color: styleOptions?.dotsOptions?.color || '#000' },
        cornersSquareOptions: { type: styleOptions?.cornersSquareOptions?.type || 'square', color: styleOptions?.cornersSquareOptions?.color || '#000' },
        backgroundOptions: { color: styleOptions?.backgroundOptions?.color || '#fff' }
      })
    } catch (err) {
      console.error('QR update error', err)
      setHasError(true)
    }
  }, [value, styleOptions])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', borderRadius: '8px', background: styleOptions?.backgroundOptions?.color || 'white' }}>
        {hasError ? <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>Preview not available</div> : <div ref={containerRef} />}
      </div>
      <small style={{ color: 'var(--color-text-muted)' }}>QR Preview</small>
    </div>
  )
}
