# Banog: Premium YouTube Extraction Engine

A sleek, full-stack web application that extracts maximum-quality video and audio streams from YouTube. Built with a minimalist, Apple-inspired UI, Banog bypasses standard container limits to fetch raw 4K/1080p60 video tracks and merges them with high-fidelity audio on the fly using FFmpeg.

## 🚀 Features

* **Peak Quality Multiplexing:** Utilizes `yt-dlp` and `FFmpeg` to decouple video and audio streams, extracting resolutions up to 4K that are normally restricted by standard MP4 containers.
* **Selectable Resolutions:** Choose between Peak Quality, 1080p, 720p, or 360p data-saver modes.
* **Real-Time Telemetry:** Features a buttery-smooth progress bar driven by Server-Sent Events (SSE) that pipes live download data directly from the Python backend to the JavaScript frontend.
* **Direct-to-Browser Handoff:** Processes the heavy media files entirely Server-Side, then instantly hands the compiled `.mp4` back to the browser's native download manager.
* **Premium UI/UX:** Built from scratch with vanilla CSS and JavaScript, featuring a dynamic dark/light mode toggle, cubic-bezier reveal animations, and accessible form design.

## 🛠️ Technology Stack

* **Backend:** Python, Flask, Server-Sent Events (SSE)
* **Extraction Engine:** `yt-dlp`, `FFmpeg`
* **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6)

## ⚙️ Prerequisites

Before running this application locally, ensure you have the following installed:
1. [Python 3.x](https://www.python.org/downloads/)
2. [FFmpeg](https://ffmpeg.org/download.html) (Must be installed and added to your system's environmental `PATH` variables for the multiplexing engine to function).

## 💻 Local Setup & Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/YourUsername/yt-extraction-engine.git](https://github.com/YourUsername/yt-extraction-engine.git)
   cd yt-extraction-engine
   ```

2. **Initialize a virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate the environment**
   * Windows: `venv\Scripts\activate`
   * Mac/Linux: `source venv/bin/activate`

4. **Install backend dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Boot the extraction server**
   ```bash
   python app.py
   ```

6. Open your web browser and navigate to `http://127.0.0.1:5000`

## 👨‍💻 Author
**Tom Lloyd Del Rosario** 
