import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';

const QRCodeStyled = ({ value, styleOptions }) => {
    const ref = useRef(null);
    const qrCode = useRef(null);

    useEffect(() => {
        // Initialize
        qrCode.current = new QRCodeStyling({
            width: 256,
            height: 256,
            data: value,
            margin: 5,
            ...styleOptions
        });

        if (ref.current) {
            ref.current.innerHTML = '';
            qrCode.current.append(ref.current);
        }
    }, []);

    useEffect(() => {
        if (!qrCode.current) return;

        // Update options dynamically
        qrCode.current.update({
            data: value,
            ...styleOptions
        });
    }, [value, styleOptions]);

    return (
        <div
            ref={ref}
            style={{
                padding: '20px',
                background: 'white',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        />
    );
};

export default QRCodeStyled;
