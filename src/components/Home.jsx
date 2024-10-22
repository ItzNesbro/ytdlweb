import React, { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [url, setUrl] = useState('');
  const [formats, setFormats] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [title, setTitle] = useState('');

  // Fetch formats for the video
  const fetchFormats = async () => {
    try {
      const response = await axios.post('https://5000-itznesbro-ytdlweb-vitrcm0wp2z.ws-us116.gitpod.io/formats', { url });
      setTitle(response.data.title);
      setFormats(response.data.formats);
      setSelectedFormat(response.data.formats[0]?.itag || '');
    } catch (err) {
      console.error('Error fetching formats:', err);
    }
  };

  // Download the video
  const downloadVideo = async () => {
    if (!selectedFormat) return;
    try {
      const response = await axios.post('https://5000-itznesbro-ytdlweb-vitrcm0wp2z.ws-us116.gitpod.io/download', {
        url,
        itag: selectedFormat,
      }, { responseType: 'blob' });

      // Handle file download
      const blob = new Blob([response.data], { type: response.data.type });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${title}.mp4`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading the video:', err);
    }
  };

  return (
    <div className="container">
      <h1>YouTube Video Downloader</h1>

      <input
        type="text"
        placeholder="Video URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={fetchFormats}>Fetch Formats</button>

      {formats.length > 0 && (
        <div>
          <h3>{title}</h3>
          <label htmlFor="format">Select Format:</label>
          <select id="format" value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)}>
            {formats.map(format => (
              <option key={format.itag} value={format.itag}>
                {format.qualityLabel} - {format.container} ({format.codecs})
              </option>
            ))}
          </select>
          <button onClick={downloadVideo}>Download Video</button>
        </div>
      )}
    </div>
  );
};

export default Home;

