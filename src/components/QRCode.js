import React from 'react';

const QRCode = ({ url, size = 150 }) => {
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;

    return (
        <div className="qr-code">
            <img src={qrApiUrl} alt="QR Code" />
            <a href={qrApiUrl} download="qrcode.png" className="download-btn">
                Download QR Code
            </a>
        </div>
    );
};

export default QRCode;
