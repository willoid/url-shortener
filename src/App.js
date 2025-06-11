import React, {useState, useEffect} from 'react';
import './App.css';
import QRCode from './components/QRCode';
import ExportButton from './components/ExportButton';


function App() {
    const [url, setUrl] = useState('');
    const [customShortId, setCustomShortId] = useState('');
    const [urls, setUrls] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');
    const [showQR, setShowQR] = useState({});
    const toggleQR = (id) => {
        setShowQR(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Load data from localStorage on component mount
    useEffect(() => {
        const savedUrls = localStorage.getItem('shortenedUrls');
        const savedDarkMode = localStorage.getItem('darkMode');

        if (savedUrls) {
            setUrls(JSON.parse(savedUrls));
        }

        if (savedDarkMode === 'true') {
            setDarkMode(true);
            document.body.classList.add('dark-mode');
        }
    }, []);

    // Save to localStorage whenever urls change
    useEffect(() => {
        localStorage.setItem('shortenedUrls', JSON.stringify(urls));
    }, [urls]);

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', !darkMode);
    };

    // Generate random short ID
    const generateShortId = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    // Create shortened URL
    const shortenUrl = (e) => {
        e.preventDefault();

        // Check if URL already exists
        const existingUrl = urls.find(item => item.originalUrl === url);
        if (existingUrl) {
            alert('This URL has already been shortened!');
            return;
        }

        const shortId = customShortId || generateShortId();
        const newUrl = {
            id: Date.now(),
            shortId: shortId,
            originalUrl: url,
            shortUrl: `https://short.link/${shortId}`,
            createdAt: new Date().toLocaleString(),
            clicks: 0
        };

        setUrls([newUrl, ...urls]);
        setUrl('');
        setCustomShortId('');

        // Show success animation
        const element = document.querySelector('.url-form');
        element.classList.add('success-animation');
        setTimeout(() => element.classList.remove('success-animation'), 1000);
    };

    // Copy to clipboard
    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopySuccess(id);
        setTimeout(() => setCopySuccess(''), 2000);
    };

    // Delete URL
    const deleteUrl = (id) => {
        if (window.confirm('Are you sure you want to delete this URL?')) {
            setUrls(urls.filter(item => item.id !== id));
        }
    };

    // Simulate click tracking
    const trackClick = (id) => {
        setUrls(urls.map(item =>
            item.id === id
                ? {...item, clicks: item.clicks + 1}
                : item
        ));
    };

    // Filter URLs based on search
    const filteredUrls = urls.filter(item =>
        item.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.shortId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate statistics
    const totalClicks = urls.reduce((sum, item) => sum + item.clicks, 0);
    const mostClicked = urls.reduce((max, item) =>
        item.clicks > (max?.clicks || 0) ? item : max, null
    );

    return (
        <div className={`App ${darkMode ? 'dark' : ''}`}>
            <header className="App-header">
                <div className="header-content">
                    <h1>🔗 URL Shortener Pro</h1>
                    <button className="theme-toggle" onClick={toggleDarkMode}>
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                </div>
                <p>Create custom short links that are easy to share</p>
            </header>

            <div className="container">
                <form onSubmit={shortenUrl} className="url-form">
                    <div className="form-group">
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Enter your long URL here..."
                            required
                            className="url-input"
                        />
                        <input
                            type="text"
                            value={customShortId}
                            onChange={(e) => setCustomShortId(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                            placeholder="Custom ID (optional)"
                            className="custom-input"
                            maxLength="10"
                        />
                    </div>
                    <button type="submit" className="submit-btn">
                        <span>Shorten URL</span>
                        <span className="btn-icon">✨</span>
                    </button>
                </form>

                <div className="controls">
                    <input
                        type="text"
                        placeholder="🔍 Search URLs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button
                        className="stats-btn"
                        onClick={() => setShowStats(!showStats)}
                    >
                        📊 {showStats ? 'Hide' : 'Show'} Stats
                    </button>
                    <ExportButton urls={urls}/>
                </div>

                {showStats && (
                    <div className="stats-panel">
                        <h3>📈 Statistics</h3>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-number">{urls.length}</div>
                                <div className="stat-label">Total URLs</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">{totalClicks}</div>
                                <div className="stat-label">Total Clicks</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">
                                    {mostClicked ? mostClicked.shortId : 'N/A'}
                                </div>
                                <div className="stat-label">Most Popular</div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="urls-section">
                    <h3>Your Shortened URLs ({filteredUrls.length})</h3>
                    {filteredUrls.length === 0 ? (
                        <div className="empty-state">
                            <span className="empty-icon">📭</span>
                            <p>No URLs found. Create your first short link above!</p>
                        </div>
                    ) : (
                        <div className="urls-grid">
                            {filteredUrls.map((item) => (
                                <div key={item.id} className="url-card">
                                    <div className="url-header">
                                        <span className="url-date">{item.createdAt}</span>
                                        <button
                                            className="delete-btn"
                                            onClick={() => deleteUrl(item.id)}
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                        <button
                                            className="qr-btn"
                                            onClick={() => toggleQR(item.id)}
                                            title="QR Code"
                                        >
                                            📱
                                        </button>
                                    </div>

                                    <div className="url-content">
                                        <div className="short-url-section">
                                            <a
                                                href={item.originalUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="short-url"
                                                onClick={() => trackClick(item.id)}
                                            >
                                                {item.shortUrl}
                                            </a>
                                            <button
                                                className={`copy-btn ${copySuccess === item.id ? 'copied' : ''}`}
                                                onClick={() => copyToClipboard(item.shortUrl, item.id)}
                                            >
                                                {copySuccess === item.id ? '✓ Copied' : '📋 Copy'}
                                            </button>
                                        </div>

                                        <div className="original-url">{item.originalUrl}</div>

                                        <div className="url-stats">

                                          <span className="click-count">
                                            👆 {item.clicks} clicks
                                          </span>
                                            <span className="short-id">
                                                ID: {item.shortId}
                                          </span>
                                        </div>
                                        {showQR[item.id] && (
                                            <div className="qr-section">
                                                <QRCode url={item.shortUrl}/>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <footer className="app-footer">
                <p>Made with ❤️ by <a href="https://github.com/willoid">willoid</a> |
                    <a href="https://github.com/yourusername/url-shortener" target="_blank" rel="noopener noreferrer">
                        View on GitHub
                    </a>
                </p>
            </footer>
        </div>
    );
}

export default App;
