import QRCode from 'qrcode';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generateVCard } from './vcard';

/**
 * Downloads a single VCard file.
 */
export const downloadVCard = (vcardString, filename) => {
    const blob = new Blob([vcardString], { type: 'text/vcard;charset=utf-8' });
    saveAs(blob, `${filename}.vcf`);
};

/**
 * Downloads the current QR code as PNG or SVG.
 * Note: For SVG, we might need to serialize the SVG DOM element if we want exact current state,
 * but reusing the generator is cleaner for logic if we match settings.
 * However, qrcode.react renders to DOM.
 * For "Downloading" current view, serializing DOM is best for SVG.
 * For PNG, we can use QRCode.toDataURL with same settings.
 */
export const downloadQRImage = async (text, format = 'png', filename, options = {}) => {
    const { fgColor = '#000000', bgColor = '#ffffff', margin = 1 } = options;

    if (format === 'png') {
        try {
            const dataUrl = await QRCode.toDataURL(text, {
                color: {
                    dark: fgColor,
                    light: bgColor // Transparency: if bgColor is null/undefined? QRCode lib handles RGBA?
                    // If user wants transparent, we should pass alpha. 
                    // But input is usually hex. 
                },
                margin,
                width: 1000 // High res
            });
            saveAs(dataUrl, `${filename}.png`);
        } catch (err) {
            console.error(err);
        }
    } else if (format === 'svg') {
        // For SVG, we can generate string using QRCode lib
        try {
            const svgString = await QRCode.toString(text, {
                type: 'svg',
                color: { dark: fgColor, light: bgColor },
                margin
            });
            const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            saveAs(blob, `${filename}.svg`);
        } catch (err) {
            console.error(err);
        }
    }
};

/**
 * Generates a ZIP file containing QR codes (PNG/SVG) and VCards for the batch.
 */
export const processBatchExport = async (dataList, exportOptions = {}) => {
    const {
        includePng = true,
        includeSvg = false,
        includeVCard = false,
        qrSettings = {}
    } = exportOptions;

    const zip = new JSZip();
    const folder = zip.folder("vcard-qr-codes");

    for (let i = 0; i < dataList.length; i++) {
        const contact = dataList[i];
        const vcard = generateVCard(contact);
        // Filename strategy: Firstname_Lastname or Organization or Index
        const safeName = `${contact.firstName || ''}_${contact.lastName || ''}_${i + 1}`.replace(/[^a-z0-9_-]/gi, '_');

        if (includeVCard) {
            folder.file(`${safeName}.vcf`, vcard);
        }

        if (includePng) {
            const dataUrl = await QRCode.toDataURL(vcard, {
                color: { dark: qrSettings.fgColor, light: qrSettings.bgColor },
                margin: 1,
                width: 1000
            });
            // Remove data:image/png;base64, header
            const base64 = dataUrl.split(',')[1];
            folder.file(`${safeName}.png`, base64, { base64: true });
        }

        if (includeSvg) {
            const svgString = await QRCode.toString(vcard, {
                type: 'svg',
                color: { dark: qrSettings.fgColor, light: qrSettings.bgColor }
            });
            folder.file(`${safeName}.svg`, svgString);
        }
    }

    const zipContent = await zip.generateAsync({ type: "blob" });
    saveAs(zipContent, "qr_batch_export.zip");
};
