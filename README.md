# Banog: Local YouTube Extraction Server

> A sleek, premium web application that turns your PC into a dedicated YouTube extraction engine. Built with a minimalist UI, Banog bypasses standard container limits to fetch raw 4K/1080p60 video tracks and merges them with high-fidelity audio on the fly using FFmpeg. 

Because it runs entirely on your local machine, it bypasses cloud-based IP bans, features zero ads, and can be accessed by any device on your home Wi-Fi network.

## 🚀 Features

* **Home Network Access:** Run the server on your PC and download videos directly to your phone, tablet, or laptop over your Wi-Fi (`http://<your-ip>:5000`).
* **Peak Quality Multiplexing:** Utilizes `yt-dlp` and `FFmpeg` to decouple video and audio streams, extracting resolutions up to 4K that are normally restricted.
* **One-Click Startup:** Includes a simple `Banog.bat` launcher that boots the server and acts as a master off-switch when you close the window.
* **Real-Time Telemetry:** Features a buttery-smooth progress bar driven by Server-Sent Events (SSE) that pipes live download data directly from the Python backend to the UI.

## 🛠️ Technology Stack

* **Backend:** Python, Flask, Server-Sent Events (SSE)
* **Extraction Engine:** yt-dlp, FFmpeg
* **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6)

## ⚙️ Prerequisites

Before running this application, ensure you have the following installed on your machine:

1. **Python 3.x**
2. **FFmpeg** *(Note: This must be installed and added to your system's PATH environment variable for the multiplexing engine to function).*

## 💻 Local Setup & Installation

**1. Clone the repository**
```bash
git clone [https://github.com/okitamm/Banog-Youtube-Video-Downloader.git](https://github.com/okitamm/Banog-Youtube-Video-Downloader.git)
cd Banog-Youtube-Video-Downloader
```

**2. Initialize a virtual environment**
```bash
python -m venv venv
```

**3. Activate the environment**
* **Windows:** `venv\Scripts\activate`
* **macOS/Linux:** `source venv/bin/activate`

**4. Install backend dependencies**
```bash
pip install -r requirements.txt
```

## 🔌 Running the Server

**The Easy Way (Windows):**
Simply double-click the `Banog.bat` file in the project folder. This will automatically activate the environment and start the server. To shut the server down, just close the terminal window.

**The Manual Way:**
If you prefer using the terminal, activate your virtual environment and run:
```bash
python app.py
```

**Accessing the App:**
* **On this PC:** Open your browser and go to `http://localhost:5000`
* **On your Phone/Other Devices:** Connect to the same Wi-Fi, find this PC's IPv4 address, and go to `http://<your-ip-address>:5000`

---

## 👨‍💻 Author

**Tom Lloyd Del Rosario**
