import React, { useState } from 'react';
import { Download, FileCode, FileImage, FileText } from 'lucide-react';

const ExportPanel = ({ onExport, isBatch }) => {
    const [options, setOptions] = useState({
        includePng: true,
        includeSvg: false,
        includeVCard: false,
        imageFormat: 'png' // Default to png for UI, but exportUtils handles both
    });

    const handleChange = (e) => {
        const { name, checked } = e.target;
        setOptions(prev => ({ ...prev, [name]: checked }));
    };

    const handleExportClick = () => {
        onExport(options);
    };

    return (
        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Download size={20} /> Export Options
            </h4>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <label className="checkbox-card">
                    <input
                        type="checkbox"
                        name="includePng"
                        checked={options.includePng}
                        onChange={handleChange}
                    />
                    <div className="content">
                        <FileImage size={18} />
                        <span>PNG</span>
                    </div>
                </label>

                <label className="checkbox-card">
                    <input
                        type="checkbox"
                        name="includeSvg"
                        checked={options.includeSvg}
                        onChange={handleChange}
                    />
                    <div className="content">
                        <FileCode size={18} />
                        <span>SVG</span>
                    </div>
                </label>

                <label className="checkbox-card">
                    <input
                        type="checkbox"
                        name="includeVCard"
                        checked={options.includeVCard}
                        onChange={handleChange}
                    />
                    <div className="content">
                        <FileText size={18} />
                        <span>VCard</span>
                    </div>
                </label>
            </div>

            <button
                className="btn-primary"
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                onClick={handleExportClick}
            >
                <Download size={20} />
                {isBatch ? 'Download Batch ZIP' : 'Download Selected Formats'}
            </button>
        </div>
    );
};

export default ExportPanel;
