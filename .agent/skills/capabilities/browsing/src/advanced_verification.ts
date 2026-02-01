import { BrowsingLib } from './BrowsingLib.js';

export async function run(browsing: BrowsingLib) {
    console.log("Starting advanced verification script...");

    // 1. Open a page and trigger network activity
    console.log("Opening Naver...");
    await browsing.open("https://www.naver.com");

    // 2. Test Network Logs
    console.log("Checking network logs...");
    const networkResult = await browsing.getNetworkLogs();
    console.log(`Captured ${networkResult.logs.length} network entries.`);

    // 3. Test Element Inspection at coordinates
    console.log("Inspecting element at 100, 100...");
    const inspectResult = await browsing.inspectAt(100, 100);
    console.log("Inspection data:", JSON.stringify(inspectResult.element, null, 2));

    // 4. Test JS Execution
    console.log("Executing custom JS...");
    const jsResult = await browsing.executeJS("document.title");
    console.log("JS Title Result:", jsResult.result);

    // 5. Perform Full System Dump
    console.log("Performing full system dump...");
    const dumpResult = await browsing.systemDump();
    console.log("System Dump path:", dumpResult.path);

    return {
        success: true,
        networkCount: networkResult.logs.length,
        dumpPath: dumpResult.path
    };
}
