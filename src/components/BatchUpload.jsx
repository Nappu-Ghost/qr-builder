import React, { useRef } from 'react';
import Papa from 'papaparse';

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
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '1rem' }}>Batch QR Generation</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                Upload a CSV file to generate multiple QR codes at once.
                <br />
                <small>Supported headers: Firstname, Lastname, Organization, Position (Work), Phone... etc.</small>
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
                onClick={() => fileInputRef.current.click()}
            >
                Upload CSV List
            </button>
        </div>
    );
};

export default BatchUpload;
