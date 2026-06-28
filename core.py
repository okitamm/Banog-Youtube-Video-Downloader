import yt_dlp
import os
import shutil

current_progress = {
    "status": "idle",
    "percent": "0%",
    "speed": "0MiB/s",
    "eta": "00:00"
}

def progress_hook(d):
    global current_progress
    
    if d['status'] == 'downloading':
        current_progress['status'] = 'downloading'
        current_progress['percent'] = d.get('_percent_str', '0%').strip()
        current_progress['speed'] = d.get('_speed_str', '0MiB/s').strip()
        current_progress['eta'] = d.get('_eta_str', '00:00').strip()
        
    elif d['status'] == 'finished':
        current_progress['status'] = 'multiplexing'
        current_progress['percent'] = '100%'

# Note the new 'quality' parameter in the function definition!
def download_video(url, quality="peak"):
    global current_progress
    current_progress = {"status": "starting", "percent": "0%", "speed": "0MiB/s", "eta": "00:00"}
    
    os.makedirs('downloads', exist_ok=True)
    
    # 2. ADD THIS BLOCK: Copy the secret cookies to a writable location
    writable_cookie_path = 'downloads/temp_cookies.txt'
    if os.path.exists('/etc/secrets/cookies.txt'):
        shutil.copyfile('/etc/secrets/cookies.txt', writable_cookie_path)
    
    if quality == 'peak':
        format_string = 'bestvideo[ext=mp4]+bestaudio/best'
    else:
        format_string = f'bestvideo[height<={quality}][ext=mp4]+bestaudio/best'
    
    ydl_opts = {
        'format': format_string,  
        'merge_output_format': 'mp4',
        'outtmpl': 'downloads/%(title)s_%(resolution)s.%(ext)s', 
        'quiet': True, 
        'color': 'no_color', 
        
        # 3. UPDATE THIS LINE: Point yt-dlp to the writable copy
        'cookiefile': writable_cookie_path if os.path.exists(writable_cookie_path) else None,  
        
        'postprocessor_args': {
            'merger': ['-c:a', 'aac']
        },
        'progress_hooks': [progress_hook]
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            raw_filename = ydl.prepare_filename(info)
            final_filepath = os.path.splitext(raw_filename)[0] + '.mp4'
            
        current_progress['status'] = 'idle'
        return final_filepath 
        
    except Exception as e:
        current_progress['status'] = 'error'
        raise e