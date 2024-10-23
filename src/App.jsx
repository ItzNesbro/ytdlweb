import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const App = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [downloadIframeUrl, setDownloadIframeUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const API_URL = 'https://ytdlweb-apiback-81bf0d2a2101.herokuapp.com';

  const handleVideoUrlChange = (e) => {
    setVideoUrl(e.target.value);
  };

  const handleDownloadSubmit = (e) => {
    e.preventDefault();
    setDownloadIframeUrl(`https://api.vevioz.com/apis/widget?url=${videoUrl}`);
    setTimeout(() => {
      window.iFrameResize({ log: false }, '#widgetApi');
    }, 100);
  };

  const handleSummarizeSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSummary('');
    try {
      const response = await fetch(`${API_URL}/api/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Error summarizing the video:', error);
      setError(error.message || 'An unknown error occurred');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">YouTube Downloader & Summarizer</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Download YouTube Video</h2>
        <form onSubmit={handleDownloadSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            value={videoUrl}
            onChange={handleVideoUrlChange}
            placeholder="Enter YouTube Video URL"
            className="border p-2 rounded-md"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Download Video
          </button>
        </form>
        {downloadIframeUrl && (
          <div className="mt-4">
            <iframe
              id="widgetApi"
              src={downloadIframeUrl}
              width="100%"
              height="500px"
              allowTransparency="true"
              scrolling="no"
              style={{ border: 'none' }}
            ></iframe>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Summarize YouTube Video</h2>
        <form onSubmit={handleSummarizeSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            value={videoUrl}
            onChange={handleVideoUrlChange}
            placeholder="Enter YouTube Video URL"
            className="border p-2 rounded-md"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
          >
            Summarize Video
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {summary && (
          <div className="mt-4 bg-gray-100 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Summary:</h3>
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

