from playwright.sync_api import sync_playwright
import time
from urllib.parse import urlparse
import urllib.request

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()
        page.goto('https://gemini.google.com/app')
        # wait for input
        page.wait_for_timeout(2000)
        # try to find any textarea or contenteditable
        try:
            page.fill('textarea', '야구하는 고양이, 포토리얼리스틱, 1024x1024')
        except Exception:
            try:
                page.eval_on_selector('[contenteditable]', "(el, value) => el.innerText = value", '야구하는 고양이, 포토리얼리스틱, 1024x1024')
            except Exception:
                pass
        # click generate button
        btn = None
        for t in ['button:has-text("이미지")','button:has-text("생성")','button:has-text("Generate")','button:has-text("Create")']:
            try:
                btn = page.query_selector(t)
                if btn:
                    btn.click()
                    break
            except Exception:
                pass
        # wait for result
        page.wait_for_timeout(8000)
        # try to collect large image srcs
        imgs = page.query_selector_all('img')
        srcs = []
        for img in imgs:
            try:
                src = img.get_attribute('src')
                if src and len(src)>100:
                    srcs.append(src)
            except:
                pass
        # fallback: capture screenshot
        out='/Users/jamie/.openclaw/workspace/2026-02-22-야구하는-고양이-1k-playwright.png'
        if srcs:
            url = srcs[0]
            urllib.request.urlretrieve(url, out)
            print('saved', out)
        else:
            page.screenshot(path=out, full_page=True)
            print('screenshot saved', out)
        browser.close()

if __name__=='__main__':
    run()
