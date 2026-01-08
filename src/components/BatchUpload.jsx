import React, { useRef } from 'react';
import Papa from 'papaparse';
import { Upload, FileSpreadsheet } from 'lucide-react';

const BatchUpload = ({ onDataLoaded }) => {
    const fileInputRef = useRef(null);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                // Map CSV fields to our internal format
                const mappedData = results.data.map(row => ({
                    firstName: row['Firstname'] || '',
                    lastName: row['Lastname'] || '',
                    organization: row['Organization'] || '',
                    position: row['Position (Work)'] || '',
                    phoneWork: row['Phone (Work)'] || '',
                    phoneMobile: row['Phone (Mobile)'] || '',
                    email: row['Email'] || '',
                    street: row['Street'] || '',
                    zip: row['Zipcode'] || '',
                    city: row['City'] || '',
                    country: row['Country'] || '',
                    website: row['Website'] || ''
                }));
                onDataLoaded(mappedData);
            },
            error: (error) => {
                console.error('Error parsing CSV:', error);
                alert('Error parsing CSV file');
            }
        });
    };

    return (
        <div className="glass-panel hover-scale" style={{ padding: '3rem', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={() => fileInputRef.current.click()}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                <FileSpreadsheet size={48} color="hsl(var(--color-primary))" />
            </div>

            <h2 style={{ marginBottom: '0.5rem' }}>Batch Processing</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                Upload a CSV file to generate multiple QR codes automatically.
            </p>

            <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
            />

            <button
                className="btn-primary"
                style={{ pointerEvents: 'none' }} // Button visual only, container clicks
            >
                <Upload size={18} style={{ marginRight: '8px' }} />
                Select CSV File
            </button>
            <small style={{ display: 'block', marginTop: '1rem', color: 'var(--color-text-muted)', opacity: 0.7 }}>
                Headers: Firstname, Lastname, Organization...
            </small>
        </div>
    );
};

export default BatchUpload;
