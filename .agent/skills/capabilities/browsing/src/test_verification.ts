import { BrowsingLib } from './BrowsingLib.js';

export async function run(browsing: BrowsingLib) {
    console.log("Starting verification script...");

    // 1. Open a page
    console.log("Opening Naver...");
    await browsing.open("https://www.naver.com");

    // 2. Perform system dump
    console.log("Performing system dump...");
    const dumpResult = await browsing.systemDump();
    console.log("Dump result:", JSON.stringify(dumpResult, null, 2));

    // 3. Test extract content
    console.log("Extracting content...");
    const contentResult = await browsing.extractContent();
    console.log("Content extraction ok:", contentResult.ok);

    return {
        dumpId: dumpResult.dumpId,
        url: dumpResult.url
    };
}
