import React from 'react';

const ExportButton = ({ urls }) => {
    const exportToJSON = () => {
        const dataStr = JSON.stringify(urls, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        const exportFileDefaultName = `urls_export_${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const exportToCSV = () => {
        const headers = ['Short ID', 'Short URL', 'Original URL', 'Clicks', 'Created At'];
        const csvContent = [
            headers.join(','),
            ...urls.map(url => [
                url.shortId,
                url.shortUrl,
                `"${url.originalUrl}"`,
                url.clicks,
                url.createdAt
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const exportFileName = `urls_export_${new Date().toISOString().split('T')[0]}.csv`;

        link.href = URL.createObjectURL(blob);
        link.download = exportFileName;
        link.click();
    };

    return (
        <div className="export-buttons">
            <button onClick={exportToJSON} className="export-btn">
                📄 Export JSON
            </button>
            <button onClick={exportToCSV} className="export-btn">
                📊 Export CSV
            </button>
        </div>
    );
};

export default ExportButton;
