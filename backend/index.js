const express = require('express');
const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint to fetch available formats for a video
app.post('/formats', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).send('Missing video URL');

  try {
    const info = await ytdl.getInfo(url);
    const formats = info.formats.map((format) => ({
      itag: format.itag,
      qualityLabel: format.qualityLabel || 'Audio Only',
      container: format.container,
      codecs: format.codecs,
      hasVideo: !!format.qualityLabel,
      hasAudio: !!format.audioBitrate,
    }));

    res.json({ title: info.videoDetails.title, formats });
  } catch (error) {
    console.error('Error fetching video formats:', error);
    res.status(500).send('Error fetching video formats');
  }
});

// Endpoint to download video with selected format
app.post('/download', async (req, res) => {
  const { url, itag } = req.body;
  if (!url || !itag) return res.status(400).send('Missing parameters');

  try {
    // Get video information
    const info = await ytdl.getInfo(url);

    // Find the format based on the selected itag
    const format = ytdl.chooseFormat(info.formats, { quality: itag });
    if (!format) return res.status(400).send('No format found for the requested quality');

    const videoTitle = info.videoDetails.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filePath = path.join(__dirname, `${videoTitle}.${format.container}`);

    // Download the video using ytdl and save it using fs
    const stream = ytdl(url, { format });
    const writeStream = fs.createWriteStream(filePath);

    stream.pipe(writeStream);

    // Listen for stream events
    writeStream.on('finish', () => {
      res.download(filePath, (err) => {
        if (err) {
          console.error('Error downloading the video:', err);
          res.status(500).send('Error downloading the video');
        }
        // Clean up the file after sending it
        fs.unlinkSync(filePath);
      });
    });

    stream.on('error', (err) => {
      console.error('Stream error:', err);
      res.status(500).send('Error during download');
    });

  } catch (error) {
    console.error('Error fetching video info or downloading:', error);
    res.status(500).send('Error fetching video info or downloading');
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

