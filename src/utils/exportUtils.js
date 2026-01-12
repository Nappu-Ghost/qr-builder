import QRCode from 'qrcode'
import QRCodeStyling from 'qr-code-styling'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

function dataURLtoBlob(dataURL) {
  const parts = dataURL.split(',')
  const mime = parts[0].match(/:(.*?);/)[1]
  const bstr = atob(parts[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) u8arr[n] = bstr.charCodeAt(n)
  return new Blob([u8arr], { type: mime })
}

async function generateBlobWithStyling(qrText, size, format, qrSettings) {
  // try to use qr-code-styling to preserve types/colors
  try {
    const instance = new QRCodeStyling({
      width: size,
      height: size,
      data: qrText,
      dotsOptions: { type: qrSettings?.dotsOptions?.type || 'square', color: qrSettings?.dotsOptions?.color || '#000' },
      cornersSquareOptions: { type: qrSettings?.cornersSquareOptions?.type || 'square', color: qrSettings?.cornersSquareOptions?.color || '#000' },
      cornersDotOptions: { type: qrSettings?.cornersDotOptions?.type || 'square' },
      backgroundOptions: { color: qrSettings?.backgroundOptions?.color || '#fff' }
    })

    // get blob (png) or svg string
    if (format === 'svg') {
      const svg = await instance.getRawData('svg')
      // some versions return Blob, some return string — normalize
      if (svg instanceof Blob) return svg
      return new Blob([String(svg)], { type: 'image/svg+xml' })
    } else {
      // png
      const blob = await instance.getRawData('png')
      return blob
    }
  } catch (err) {
    console.warn('qr-code-styling failed, falling back to qrcode', err)
    throw err
  }
}

export async function processBatchExportStyled(data = [], options = {}) {
  const zip = new JSZip()
  const folder = zip.folder('qr-exports')
  const size = options.size || 1024
  const format = options.format || 'png'
  const onProgress = typeof options.onProgress === 'function' ? options.onProgress : () => {}

  for (let i = 0; i < data.length; i++) {
    const contact = data[i]
    const v = typeof contact === 'string' ? contact : contact.vcard || contact // allow passing vcard string or object
    const qrText = typeof v === 'string' ? v : (contact && contact.vcard) || ''
    const indexHuman = i + 1

    try {
      let blob
      let fname
      // Prefer styled generation when qrSettings is provided
      if (options.qrSettings) {
        try {
          const b = await generateBlobWithStyling(qrText, size, format, options.qrSettings)
          blob = b
          fname = `${(contact.Firstname || 'contact')}_${(contact.Lastname || i)}.${format}`.replace(/[^a-z0-9_\-\.]/gi, '_')
          folder.file(fname, blob)
          onProgress({ index: indexHuman, total: data.length, success: true, filename: fname })
          continue
        } catch (err) {
          // fallback to old approach
          console.warn('Styled generation failed, falling back', err)
        }
      }

      if (format === 'svg') {
        const svg = await QRCode.toString(qrText, { type: 'svg', width: size })
        blob = new Blob([svg], { type: 'image/svg+xml' })
        fname = `${(contact.Firstname || 'contact')}_${(contact.Lastname || i)}.svg`.replace(/[^a-z0-9_\-\.]/gi, '_')
        folder.file(fname, blob)
      } else {
        const opts = { width: size, margin: 1 }
        const dataUrl = await QRCode.toDataURL(qrText, opts)
        blob = dataURLtoBlob(dataUrl)
        fname = `${(contact.Firstname || 'contact')}_${(contact.Lastname || i)}.${format}`.replace(/[^a-z0-9_\-\.]/gi, '_')
        folder.file(fname, blob)
      }

      onProgress({ index: indexHuman, total: data.length, success: true, filename: fname })
    } catch (err) {
      console.error('Failed to generate QR for contact', i, err)
      const errMsg = String(err && (err.message || err))
      onProgress({ index: indexHuman, total: data.length, success: false, filename: null, error: errMsg })
    }
  }

  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, 'qr-export.zip')
  onProgress({ done: true, total: data.length })
}
