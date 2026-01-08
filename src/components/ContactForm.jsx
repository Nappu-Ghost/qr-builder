import React, { useState, useEffect } from 'react';

const ContactForm = ({ initialData, onChange }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        organization: '',
        position: '',
        phoneWork: '',
        phoneMobile: '',
        email: '',
        website: '',
        street: '',
        city: '',
        zip: '',
        country: '',
        ...initialData
    });

    useEffect(() => {
        onChange(formData);
    }, [formData, onChange]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)',
        background: 'var(--color-bg-base)',
        color: 'var(--color-text-main)',
        marginBottom: '1rem',
        boxSizing: 'border-box'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        fontSize: '0.9rem',
        color: 'var(--color-text-muted)'
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Contact Details</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={labelStyle}>First Name</label>
                    <input name="firstName" style={inputStyle} value={formData.firstName} onChange={handleChange} placeholder="John" />
                </div>
                <div>
                    <label style={labelStyle}>Last Name</label>
                    <input name="lastName" style={inputStyle} value={formData.lastName} onChange={handleChange} placeholder="Doe" />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={labelStyle}>Organization</label>
                    <input name="organization" style={inputStyle} value={formData.organization} onChange={handleChange} placeholder="Company Ltd" />
                </div>
                <div>
                    <label style={labelStyle}>Start Position / Job Title</label>
                    <input name="position" style={inputStyle} value={formData.position} onChange={handleChange} placeholder="Director" />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={labelStyle}>Work Phone</label>
                    <input name="phoneWork" style={inputStyle} value={formData.phoneWork} onChange={handleChange} placeholder="+1 234..." />
                </div>
                <div>
                    <label style={labelStyle}>Mobile Phone</label>
                    <input name="phoneMobile" style={inputStyle} value={formData.phoneMobile} onChange={handleChange} placeholder="+1 987..." />
                </div>
            </div>

            <div>
                <label style={labelStyle}>Email</label>
                <input name="email" type="email" style={inputStyle} value={formData.email} onChange={handleChange} placeholder="john@example.com" />
            </div>

            <div>
                <label style={labelStyle}>Website</label>
                <input name="website" style={inputStyle} value={formData.website} onChange={handleChange} placeholder="https://..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={labelStyle}>Street</label>
                    <input name="street" style={inputStyle} value={formData.street} onChange={handleChange} placeholder="123 Main St" />
                </div>
                <div>
                    <label style={labelStyle}>City</label>
                    <input name="city" style={inputStyle} value={formData.city} onChange={handleChange} placeholder="New York" />
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={labelStyle}>Zip Code</label>
                    <input name="zip" style={inputStyle} value={formData.zip} onChange={handleChange} placeholder="10001" />
                </div>
                <div>
                    <label style={labelStyle}>Country</label>
                    <input name="country" style={inputStyle} value={formData.country} onChange={handleChange} placeholder="USA" />
                </div>
            </div>

        </div>
    );
};

export default ContactForm;
