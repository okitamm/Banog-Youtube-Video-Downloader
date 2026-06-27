// 1. Theme Management
const themeToggle = document.getElementById('themeToggle');
const htmlEl = document.documentElement;

const savedTheme = localStorage.getItem('peakdl-theme') || 'dark';
htmlEl.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

themeToggle.addEventListener('click', () => {
    const nextTheme = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', nextTheme);
    themeToggle.textContent = nextTheme === 'dark' ? '🌙' : '☀️';
    localStorage.setItem('peakdl-theme', nextTheme);
});

// 2. API Communication & Telemetry Receiver
async function startDownload() {
    const urlInput = document.getElementById('urlInput');
    const url = urlInput.value.trim();
    const btn = document.getElementById('downloadBtn');
    const btnText = document.getElementById('btnText');
    
    let btnIcon = document.getElementById('btnIcon');
    if (!btnIcon) {
        btnIcon = document.createElement('span');
        btnIcon.id = 'btnIcon';
        btn.prepend(btnIcon);
    }
    
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    
    // NEW: We introduce a flag to track if the pipeline succeeds
    let isSuccess = false;

    if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) {
        showStatus('error', 'Please provide a valid YouTube URL.');
        return;
    }

    setTimeout(() => {
        btn.disabled = true;
        btnIcon.innerHTML = '<div class="spinner"></div>';
        btnText.textContent = ' Server Processing...';
    }, 150);

    progressContainer.style.display = 'block';
    progressContainer.classList.add('reveal-anim'); // NEW: Trigger the smooth reveal
    progressBar.style.width = '0%';
    progressBar.style.background = 'var(--accent)';

    // THE RECEIVER: Open a live connection to Flask's telemetry stream
    const eventSource = new EventSource('/api/progress');
    
    eventSource.onmessage = function(event) {
        const data = JSON.parse(event.data);
        
        if (data.status === 'downloading') {
            // Parse the numbers to compare them (e.g., turns "45.5%" into 45.5)
            let currentWidth = parseFloat(progressBar.style.width) || 0;
            let incomingWidth = parseFloat(data.percent);
            
            // THE PROGRESS LOCK: Only allow the bar to grow forwards. 
            // This silently hides the audio-track download reset from the user.
            if (incomingWidth > currentWidth) {
                progressBar.style.width = data.percent;
            }
        } else if (data.status === 'multiplexing') {
            // Lock it at 100% while FFmpeg finishes up the audio stitching
            progressBar.style.width = '100%';
        }
    };  

    // Grab the selected quality from the dropdown
    const selectedQuality = document.getElementById('qualitySelect').value;

    try {
        const response = await fetch('/api/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // NEW: Add the quality parameter to the payload
            body: JSON.stringify({ url: url, quality: selectedQuality })
        });

        const result = await response.json();

        if (result.status === 'success') {
            isSuccess = true; // Flip the flag!
            showStatus('success', `File processed!`);
            window.location.href = '/api/serve?filepath=' + encodeURIComponent(result.filepath);
        } else {
            showStatus('error', ` ${result.message}`);
        }
    } catch (error) {
        showStatus('error', 'Network error: Cannot establish connection.');
    } finally {
        eventSource.close();
        btnIcon.innerHTML = ''; 
        
        if (isSuccess) {
            btnText.textContent = 'Download Now';
            btn.disabled = true;
            
            // Pop up the secondary reset button WITH animation
            const resetBtn = document.getElementById('resetBtn');
            resetBtn.style.display = 'flex';
            resetBtn.classList.add('reveal-anim'); // NEW: Trigger the smooth reveal
        } else {
            // If it failed, reset the main button immediately so they can try again
            btn.disabled = false;
            btnText.textContent = 'Download Now';
            setTimeout(() => progressContainer.style.display = 'none', 3000);
        }
    }
}

// 3. UI State Modifiers
function showStatus(type, message) {
    const box = document.getElementById('statusBox');
    
    // Set the text and the CSS class
    box.className = 'status-box ' + type;
    box.textContent = message;
    
    // THE FIX: Explicitly remove the inline 'display: none' trap
    box.style.display = 'block'; 
}

function setStep(stepNumber) {
    resetSteps();
    const step = document.getElementById('step' + stepNumber);
    if (step) step.classList.add('active');
}

function markAllStepsDone() {
    [1, 2, 3].forEach(i => {
        const step = document.getElementById('step' + i);
        if (step) {
            step.classList.remove('active');
            step.classList.add('done');
        }
    });
}

function resetSteps() {
    [1, 2, 3].forEach(i => {
        const step = document.getElementById('step' + i);
        if (step) step.classList.remove('active', 'done');
    });
}

document.getElementById('urlInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') startDownload();
});

// 4. Manual UI Reset
function resetUI() {
    // 1. Clear the input field
    document.getElementById('urlInput').value = '';
    
    // 2. Hide the reset button
    document.getElementById('resetBtn').style.display = 'none';
    
    // 3. Reactivate the main download button
    document.getElementById('downloadBtn').disabled = false;
    
    // 4. Sweep away the UI clutter
    document.getElementById('progressContainer').style.display = 'none';
    document.getElementById('statusBox').style.display = 'none';
    resetSteps();
}

// Clear the error message the moment the user starts typing a new link
document.getElementById('urlInput').addEventListener('input', () => {
    document.getElementById('statusBox').style.display = 'none';
});