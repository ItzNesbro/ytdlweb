import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [url, setUrl] = useState('');
  const [videoDetails, setVideoDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch video details
  const fetchVideoDetails = async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`https://5000-itznesbro-ytdlweb-vitrcm0wp2z.ws-us116.gitpod.io/info?url=${encodeURIComponent(url)}`);
      setVideoDetails(response.data);
    } catch (err) {
      setError('Error fetching video details. Please check the URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">YouTube Video Info Fetcher</h1>

      <div className="mb-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube video URL"
          className="border p-2 w-full"
        />
        <button
          onClick={fetchVideoDetails}
          className="bg-blue-500 text-white px-4 py-2 mt-2"
        >
          Get Video Info
        </button>
      </div>

      {/* Loading and error handling */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display video details if available */}
      {videoDetails && (
        <div className="mt-4 p-4 border rounded-lg shadow-lg bg-white">
          {/* Video Title */}
          <h2 className="text-xl font-bold">{videoDetails.title}</h2>

          {/* Video Author and View Count */}
          <p className="text-sm text-gray-600">
            <strong>Author:</strong> <a href={videoDetails.ownerProfileUrl} target="_blank" rel="noopener noreferrer">{videoDetails.author.name}</a> <br />
            <strong>Views:</strong> {videoDetails.viewCount}
          </p>

          {/* Display Video Thumbnail or Embed */}
          <div className="mt-4">
            <iframe
              title={videoDetails.title}
              width={videoDetails.embed.width}
              height={videoDetails.embed.height}
              src={videoDetails.embed.iframeUrl}
              frameBorder="0"
              allowFullScreen
              className="w-full"
            />
          </div>

          {/* Download Formats Section (To be implemented later) */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Available Formats for Download</h3>
            <p className="text-gray-600">This section will display available download formats in the future.</p>
            {/* Placeholder for formats to be added later */}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

