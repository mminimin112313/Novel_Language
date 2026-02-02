
import { pathToFileURL } from 'url';

export async function run(browsingLib) {
    console.log("[*] Starting Stable Google Search Test");
    const services = browsingLib.getServices();
    const page = await services.browser.getPage();

    // 1. Open Google
    await page.goto("https://www.google.com", { waitUntil: 'networkidle' });
    console.log("[*] Page loaded");

    // Check for CAPTCHA
    const captchaFrame = page.frames().find(f => f.url().includes('recaptcha'));
    if (captchaFrame) {
        console.log("[*] CAPTCHA detected. Attempting to solve...");
        // Wait for the checkbox to be visible and click it
        // Note: Real humans click with slight delay
        await new Promise(r => setTimeout(r, 2000));
        const checkbox = await page.waitForSelector('.recaptcha-checkbox-border', { timeout: 10000 }).catch(() => null);
        if (checkbox) {
            await checkbox.click();
            console.log("[*] CAPTCHA checkbox clicked");
            await new Promise(r => setTimeout(r, 5000)); // Wait for verification
        }
    }

    // 2. Perform Search if not blocked
    const searchBox = await page.waitForSelector("textarea[name='q']", { timeout: 5000 }).catch(() => null);
    if (searchBox) {
        await page.fill("textarea[name='q']", "Antigravity AI");
        await page.keyboard.press("Enter");
        console.log("[*] Search submitted");
        await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => { });
    } else {
        console.log("[!] Search box not found - might still be blocked by CAPTCHA");
    }

    // 3. System Dump for verification
    console.log("[*] Performing system dump...");
    return await browsingLib.systemDump();
}
