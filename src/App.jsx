import React, { useState } from 'react';

const App = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [downloadIframeUrl, setDownloadIframeUrl] = useState('');

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">YTDL</h1>

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
              allowtransparency="true"
              scrolling="no"
              style={{ border: 'none' }}
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

