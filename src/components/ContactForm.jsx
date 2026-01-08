import React, { useState, useEffect } from 'react';
import { User, Building2, Phone, Mail, Globe, MapPin } from 'lucide-react';

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
        // Determine if initialData effectively changed (e.g. strict batch switch)
        if (initialData) {
            setFormData(prev => ({ ...prev, ...initialData }));
        }
    }, [initialData]);

    // Sync up to parent only when formData strictly changes by user input
    // (Handling derived state can be tricky, but here we just need to push up changes)
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Update local state first
        const updated = { ...formData, [name]: value };
        setFormData(updated);
        // Propagate up
        onChange(updated);
    };

    const inputGroupStyle = {
        position: 'relative',
        marginBottom: '1rem'
    };

    const iconStyle = {
        position: 'absolute',
        left: '12px',
        top: '38px', // aligned with input
        color: 'var(--color-text-muted)',
        pointerEvents: 'none'
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem 0.75rem 0.75rem 2.8rem', // Left padding for icon
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)',
        background: 'var(--color-bg-base)',
        color: 'var(--color-text-main)',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
        fontSize: '0.95rem'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        fontSize: '0.85rem',
        fontWeight: '500',
        color: 'var(--color-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    };

    // Helper for input field with icon
    const Field = ({ label, name, icon: Icon, placeholder, width = '100%' }) => (
        <div style={inputGroupStyle}>
            <label style={labelStyle}>{label}</label>
            {Icon && <Icon size={16} style={iconStyle} />}
            <input
                name={name}
                style={inputStyle}
                value={formData[name] || ''}
                onChange={handleChange}
                placeholder={placeholder}
            />
        </div>
    );

    return (
        <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={20} className="text-primary" /> Contact Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="First Name" name="firstName" icon={User} placeholder="John" />
                <Field label="Last Name" name="lastName" icon={User} placeholder="Doe" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Organization" name="organization" icon={Building2} placeholder="Company Ltd" />
                <Field label="Job Title" name="position" icon={Building2} placeholder="Director" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Work Phone" name="phoneWork" icon={Phone} placeholder="+1 234..." />
                <Field label="Mobile Phone" name="phoneMobile" icon={Phone} placeholder="+1 987..." />
            </div>

            <Field label="Email" name="email" icon={Mail} placeholder="john@example.com" />
            <Field label="Website" name="website" icon={Globe} placeholder="https://..." />

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <Field label="Street" name="street" icon={MapPin} placeholder="123 Main St" />
                <Field label="City" name="city" icon={MapPin} placeholder="New York" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Zip Code" name="zip" icon={MapPin} placeholder="10001" />
                <Field label="Country" name="country" icon={MapPin} placeholder="USA" />
            </div>

        </div>
    );
};

export default ContactForm;
