from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout
import time, base64, os, urllib.request
OUT_DIR = '/Users/jamie/.openclaw/workspace'
OUT_NAME = '2026-02-22-야구하는-고양이-1k-playwright-v2.png'
PROMPT = '야구하는 고양이, 포토리얼리스틱, 1024x1024'

def save_data_url(data_url, out_path):
    header, data = data_url.split(',', 1)
    if header.startswith('data:image'):
        b = base64.b64decode(data)
        with open(out_path, 'wb') as f:
            f.write(b)
        return True
    return False

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    page.goto('https://gemini.google.com/app')
    # wait up to 120s for login -> detect if on accounts.google
    start = time.time()
    while True:
        url = page.url
        if 'accounts.google' not in url and 'signin' not in url and 'login' not in url:
            break
        if time.time() - start > 120:
            print('timeout waiting for login; current url=', url)
            break
        print('waiting for user to login... current url=', url)
        time.sleep(1)
        try:
            page.reload()
        except Exception:
            pass
    # fill prompt
    try:
        # try textarea
        page.fill('textarea', PROMPT)
    except Exception:
        try:
            page.eval_on_selector('[contenteditable]', '(el, val) => { el.innerText = val }', PROMPT)
        except Exception:
            pass
    # click generate/create button
    clicked = False
    for sel_text in ['이미지','생성','Generate','Create','그려','만들기']:
        try:
            btn = page.query_selector(f'button:has-text("{sel_text}")')
            if btn:
                btn.click()
                clicked = True
                break
        except Exception:
            continue
    if not clicked:
        # try pressing Enter
        try:
            page.keyboard.press('Enter')
        except Exception:
            pass
    # wait for result: look for canvas or large img up to 120s
    out_path = os.path.join(OUT_DIR, OUT_NAME)
    found = False
    start = time.time()
    while time.time() - start < 120:
        # try canvas
        try:
            canv = page.query_selector('canvas')
            if canv:
                data_url = page.evaluate('(c) => c.toDataURL("image/png")', canv)
                if save_data_url(data_url, out_path):
                    print('saved from canvas', out_path)
                    found = True
                    break
        except Exception:
            pass
        # try image tags with big src
        try:
            imgs = page.query_selector_all('img')
            for img in imgs:
                try:
                    src = img.get_attribute('src')
                    if not src:
                        continue
                    if src.startswith('data:image'):
                        if save_data_url(src, out_path):
                            print('saved from data URL img', out_path)
                            found = True
                            break
                    if src.startswith('http') and len(src) > 100:
                        # try download
                        try:
                            urllib.request.urlretrieve(src, out_path)
                            print('downloaded img src', out_path)
                            found = True
                            break
                        except Exception:
                            continue
                except Exception:
                    continue
            if found:
                break
        except Exception:
            pass
        time.sleep(1)
    if not found:
        # fallback screenshot of result area
        try:
            box = page.query_selector('main') or page
            box.screenshot(path=out_path)
            print('screenshot saved', out_path)
            found = True
        except Exception:
            page.screenshot(path=out_path, full_page=True)
            print('full screenshot saved', out_path)
            found = True
    browser.close()
    if found:
        print('DONE', out_path)
    else:
        print('FAILED')
