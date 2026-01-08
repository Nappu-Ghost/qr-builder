import React, { useState } from 'react';

const ExportPanel = ({ onExport, isBatch }) => {
    const [options, setOptions] = useState({
        includePng: true,
        includeSvg: false,
        includeVCard: false
    });

    const handleChange = (e) => {
        const { name, checked } = e.target;
        setOptions(prev => ({ ...prev, [name]: checked }));
    };

    const handleExportClick = () => {
        onExport(options);
    };

    // If single, we might want buttons for each?
    // User scenario: "export ticking options" ... "if all 3 ticked it should create a zip file"
    // Actually, for individual, typically you download one by one. But user asked for "export ticking options" 
    // and "create zip file which I can name before downloading".
    // This implies even for single, if multiple are selected, zip might be better?
    // Or maybe for single, "Download PNG", "Download SVG" buttons are enough.
    // But the prompt says "4. after I finish customizing the next step would be export ticking options".
    // I will follow the prompt mechanism for both Single and Batch to be consistent.

    return (
        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Export Options</h4>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        name="includePng"
                        checked={options.includePng}
                        onChange={handleChange}
                    />
                    PNG Image
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        name="includeSvg"
                        checked={options.includeSvg}
                        onChange={handleChange}
                    />
                    SVG Vector
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        name="includeVCard"
                        checked={options.includeVCard}
                        onChange={handleChange}
                    />
                    VCard File (.vcf)
                </label>
            </div>

            <button
                className="btn-primary"
                style={{ width: '100%' }}
                onClick={handleExportClick}
            >
                {isBatch ? 'Download Batch ZIP' : 'Download Selected Formats'}
            </button>
        </div>
    );
};

export default ExportPanel;
