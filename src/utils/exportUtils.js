import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generateVCard } from './vcard';
import QRCodeStyling from 'qr-code-styling';

/**
 * Downloads a single VCard file.
 */
export const downloadVCard = (vcardString, filename) => {
    const blob = new Blob([vcardString], { type: 'text/vcard;charset=utf-8' });
    saveAs(blob, `${filename}.vcf`);
};

/**
 * Helper to generate a Blob from QRCodeStyling
 */
const getQRBlob = async (data, options, format) => {
    const qr = new QRCodeStyling({
        width: 1000,
        height: 1000,
        data: data,
        margin: 5,
        ...options
    });
    return await qr.getRawData(format);
};

/**
 * Processes batch export using QRCodeStyling logic.
 * Handles both Single and Multiple contacts.
 * Logic:
 *  - If 1 contact AND 1 format -> Download directly.
 *  - Else -> Zip.
 */
export const processBatchExportStyled = async (dataList, exportOptions = {}) => {
    const {
        includePng = true,
        includeSvg = false,
        includeVCard = false,
        qrSettings = {} // This now contains { dotsOptions: {...}, ... }
    } = exportOptions;

    const zip = new JSZip();
    const folder = zip.folder("vcard-qr-codes");
    let fileCount = 0;

    // Pre-calculate if we need zip
    const formatsCount = (includePng ? 1 : 0) + (includeSvg ? 1 : 0) + (includeVCard ? 1 : 0);
    const isSingleFileDownload = dataList.length === 1 && formatsCount === 1;

    for (let i = 0; i < dataList.length; i++) {
        const contact = dataList[i];
        const vcard = generateVCard(contact);
        const safeName = `${contact.firstName || 'contact'}_${contact.lastName || 'qrcode'}_${i + 1}`.replace(/[^a-z0-9_-]/gi, '_');

        if (includeVCard) {
            if (isSingleFileDownload) {
                downloadVCard(vcard, safeName);
            } else {
                folder.file(`${safeName}.vcf`, vcard);
            }
            fileCount++;
        }

        if (includePng) {
            const blob = await getQRBlob(vcard, qrSettings, 'png');
            if (isSingleFileDownload) {
                saveAs(blob, `${safeName}.png`);
            } else {
                folder.file(`${safeName}.png`, blob);
            }
            fileCount++;
        }

        if (includeSvg) {
            // QRCodeStyling returns blob for SVG too
            const blob = await getQRBlob(vcard, qrSettings, 'svg');
            if (isSingleFileDownload) {
                saveAs(blob, `${safeName}.svg`);
            } else {
                folder.file(`${safeName}.svg`, blob);
            }
            fileCount++;
        }
    }

    if (!isSingleFileDownload && fileCount > 0) {
        const zipContent = await zip.generateAsync({ type: "blob" });
        saveAs(zipContent, `qr_batch_export_${Date.now()}.zip`);
    }
};
