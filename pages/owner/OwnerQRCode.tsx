import React, { useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { QRCodeCanvas } from 'qrcode.react';

const OwnerQRCode: React.FC = () => {
    const { user } = useAuth();
    const qrCodeRef = useRef<HTMLDivElement>(null);

    const menuUrl = `${window.location.origin}${window.location.pathname}#/menu/${user?.id}`;

    const downloadQRCode = () => {
        const canvas = qrCodeRef.current?.querySelector('canvas');
        if (canvas) {
            const pngUrl = canvas
                .toDataURL("image/png")
                .replace("image/png", "image/octet-stream");
            let downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = `doonum-qr-code-${user?.id}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Your Menu QR Code</h1>
            <div className="bg-white dark:bg-dark-card p-8 rounded-lg shadow-lg flex flex-col items-center">
                <p className="text-center text-gray-600 dark:text-dark-text-secondary mb-4">
                    Customers can scan this code to view your digital menu.
                </p>
                <div ref={qrCodeRef} className="bg-white p-4 rounded-lg">
                    <QRCodeCanvas
                        value={menuUrl}
                        size={256}
                        bgColor={"#ffffff"}
                        fgColor={"#000000"}
                        level={"H"}
                        includeMargin={true}
                    />
                </div>
                <div className="mt-6 text-center">
                    <p className="font-mono bg-gray-200 dark:bg-gray-900 px-3 py-2 rounded-md text-primary break-all">{menuUrl}</p>
                </div>
                <button
                    onClick={downloadQRCode}
                    className="mt-8 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
                >
                    <i className="fas fa-download mr-2"></i>
                    Download QR Code
                </button>
            </div>
        </div>
    );
};

export default OwnerQRCode;