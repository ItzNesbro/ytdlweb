import React, { useState } from 'react';

const App = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [downloadIframeUrl, setDownloadIframeUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
const API_URL = 'https://3000-itznesbro-ytdlweb-vitrcm0wp2z.ws-us116.gitpod.io';

  const handleVideoUrlChange = (e) => {
    setVideoUrl(e.target.value);
    setError('');
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
    setError('');  // Clear any previous errors
    setSummary('');  // Clear the summary on new request
    try {
      const response = await fetch(`${API_URL}/api/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl }),
      });

      // Check if the response is okay
      if (!response.ok) {
        const errorText = await response.text(); // Get error response as text
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
      <h1 className="text-2xl font-bold mb-4">YTDL & Summarizer</h1>

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

      <div>
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

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-600 rounded-md">
            <p>{error}</p>
          </div>
        )}

        {summary && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h3 className="font-bold mb-2">Summary:</h3>
            <p>{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

