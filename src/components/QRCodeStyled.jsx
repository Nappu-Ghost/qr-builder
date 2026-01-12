import React, { useEffect, useRef } from 'react'
import QRCodeStyling from 'qr-code-styling'

export default function QRCodeStyled({ value = '', styleOptions = {} }) {
  const containerRef = useRef(null)
  const qrRef = useRef(null)

  useEffect(() => {
    // create instance on mount
    qrRef.current = new QRCodeStyling({
      width: 250, // Adjusted width
      height: 250, // Adjusted height
      data: value || '',
      imageOptions: { crossOrigin: 'anonymous', margin: 10 }, // Increased margin
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
    }

    const container = containerRef.current;

    return () => {
      // cleanup
      if (container) container.innerHTML = '';
      qrRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!qrRef.current) return
    try {
      qrRef.current.update({
        data: value || '',
        dotsOptions: { type: styleOptions?.dotsOptions?.type || 'square', color: styleOptions?.dotsOptions?.color || '#000' },
        cornersSquareOptions: { type: styleOptions?.cornersSquareOptions?.type || 'square', color: styleOptions?.cornersSquareOptions?.color || '#000' },
        backgroundOptions: { color: styleOptions?.backgroundOptions?.color || '#fff' }
      })
    } catch (err) {
      console.error('QR update error', err)
    }
  }, [value, styleOptions])

  return (
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div ref={containerRef} style={{ width: '300px', height: '300px' }} />
    </div>
  )
}
