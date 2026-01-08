import React from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';

const QRDisplay = ({ value, type = 'svg', size = 256, fgColor = '#000000', bgColor = '#ffffff', level = 'M' }) => {
    const commonProps = {
        value: value,
        size: size,
        fgColor: fgColor,
        bgColor: bgColor,
        level: level,
        includeMargin: true,
    };

    return (
        <div className="qr-wrapper" style={{ padding: '20px', background: 'white', borderRadius: '12px' }}>
            {type === 'svg' ? (
                <QRCodeSVG {...commonProps} />
            ) : (
                <QRCodeCanvas {...commonProps} />
            )}
        </div>
    );
};

export default QRDisplay;
