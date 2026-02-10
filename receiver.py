import requests
import time
import os

# -------------------- CONFIG --------------------
SAVE_FOLDER = os.path.expanduser("~/Downloads/uploads")
SITE = "https://photo-site-xdtg.onrender.com/latest"

last_downloaded = ""

while True:
    try:
        r = requests.get(SITE, timeout=5)
        if r.status_code == 200:
            # Try to get filename from headers, fallback to timestamp
            content_disp = r.headers.get('Content-Disposition')
            if content_disp and 'filename=' in content_disp:
                filename = content_disp.split('filename=')[-1].replace('"', '').strip()
            else:
                filename = f"photo_{int(time.time())}.png"

            # Skip if already downloaded
            if filename != last_downloaded:
                os.makedirs(SAVE_FOLDER, exist_ok=True)
                save_path = os.path.join(SAVE_FOLDER, filename)

                # Write file
                with open(save_path, "wb") as f:
                    f.write(r.content)

                print("Saved:", save_path)
                last_downloaded = filename

    except Exception as e:
        print("Error:", e)

    time.sleep(3)

