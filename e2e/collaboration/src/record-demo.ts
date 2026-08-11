import { chromium } from "playwright";
import { createRealWorldCollaborationScenarios } from "./real-world-scenarios";

const BASE_URL = "http://localhost:65533";
const PAUSE_MS = 2500; // Pause between steps for recording

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const log = (message: string) => {
  console.log(`\n📺 ${message}`);
};

async function recordDemo() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  page.setViewportSize({ width: 1280, height: 720 });

  try {
    // Generate scenario data
    log("Generating real-world collaboration scenario...");
    const scenario = await createRealWorldCollaborationScenarios(BASE_URL);
    const facilitatorAlpha = scenario.facilitators[0];
    const facilitatorBravo = scenario.facilitators[1];

    // ═══════════════════════════════════════════════════════════════════════════
    // PART 1: FACILITATOR ALPHA WORKFLOW
    // ═══════════════════════════════════════════════════════════════════════════

    log("PART 1: FACILITATOR ALPHA WORKFLOW (3 users)");
    log("─────────────────────────────────────────────");

    // ─── Step 1: Home Page ────────────────────────────────────────────────────
    log("Step 1: Navigating to Home page...");
    await page.goto(`${BASE_URL}/#!dashboard`);
    await pause(PAUSE_MS);

    log("Viewing assessment sessions panel...");
    await page.evaluate(() => window.scrollBy(0, 300));
    await pause(PAUSE_MS);

    // ─── Step 2: Create New Session ───────────────────────────────────────────
    log("Step 2: Creating new session 'Facilitator Alpha Workshop'...");
    const sessionInput = await page.$(
      'input[placeholder*="session"], input[placeholder*="New"]',
    );
    if (sessionInput) {
      await sessionInput.fill("Facilitator Alpha Workshop");
      await pause(PAUSE_MS);

      const createBtn = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        return btns.find((b) => b.textContent.toLowerCase().includes("create"));
      });

      if (createBtn) {
        await page.click(
          `button:has-text("Create"), button:has(i.material-icons:has-text("add"))`,
        );
        await pause(PAUSE_MS);
      }
    }

    log("Waiting for session to load...");
    await page.waitForTimeout(2000);
    await pause(PAUSE_MS);

    // ─── Step 3: Select Hazards ──────────────────────────────────────────────
    log("Step 3: Navigating to Hazards selection...");
    const hazardsLink = await page.evaluate(() => {
      const links = Array.from(
        document.querySelectorAll("a, [role='link'], button"),
      ) as HTMLAnchorElement[];
      return links.find(
        (l) => l.textContent.includes("Hazard") || l.href?.includes("hazard"),
      );
    });

    if (hazardsLink) {
      await page.click("text=Hazard");
      await pause(PAUSE_MS);
    } else {
      await page.goto(`${BASE_URL}/#!hazards`);
      await pause(PAUSE_MS);
    }

    log("Selecting hazard types...");
    const hazardCheckboxes = await page.$$("input[type='checkbox']");
    for (let i = 0; i < Math.min(4, hazardCheckboxes.length); i++) {
      await hazardCheckboxes[i].click();
      await pause(500);
    }
    await pause(PAUSE_MS);

    log("Scrolling through selected hazards...");
    await page.evaluate(() => window.scrollBy(0, 400));
    await pause(PAUSE_MS);

    // ─── Step 4: Select Capabilities ─────────────────────────────────────────
    log("Step 4: Navigating to Capabilities selection...");
    const capabilitiesLink = await page.evaluate(() => {
      const links = Array.from(
        document.querySelectorAll("a, [role='link'], button"),
      ) as HTMLAnchorElement[];
      return links.find(
        (l) =>
          l.textContent.includes("Capabilit") || l.href?.includes("overview"),
      );
    });

    if (capabilitiesLink) {
      await page.click("text=/Capabilit|Overview/");
      await pause(PAUSE_MS);
    } else {
      await page.goto(`${BASE_URL}/#!overview`);
      await pause(PAUSE_MS);
    }

    log("Selecting capability items...");
    const capabilityItems = await page.$$(".card, .chip, [data-capability]");
    for (let i = 0; i < Math.min(3, capabilityItems.length); i++) {
      await capabilityItems[i].click();
      await pause(500);
    }
    await pause(PAUSE_MS);

    log("Scrolling through selected capabilities...");
    await page.evaluate(() => window.scrollBy(0, 400));
    await pause(PAUSE_MS);

    // ─── Step 5: Open Collaboration Page ──────────────────────────────────────
    log("Step 5: Opening Collaboration page...");
    const collabLink = await page.evaluate(() => {
      const links = Array.from(
        document.querySelectorAll("a, [role='link'], button"),
      ) as HTMLAnchorElement[];
      return links.find(
        (l) =>
          l.textContent.includes("Collaborat") ||
          l.href?.includes("collaborate"),
      );
    });

    if (collabLink) {
      await page.click("text=Collaborat");
      await pause(PAUSE_MS);
    } else {
      await page.goto(`${BASE_URL}/#!collaborate`);
      await pause(PAUSE_MS);
    }

    // ─── Step 6: Set Up Facilitator Session ───────────────────────────────────
    log("Step 6: Setting up Facilitator Alpha session...");
    await page.evaluate(() => window.scrollTo(0, 0));
    await pause(PAUSE_MS);

    log("Entering facilitator name: " + facilitatorAlpha.facilitator.name);
    const nameInputs = await page.$$('input[type="text"]');
    if (nameInputs.length > 0) {
      await nameInputs[0].fill(facilitatorAlpha.facilitator.name);
      await pause(PAUSE_MS);
    }

    log("Scrolling to email field...");
    await page.evaluate(() => window.scrollBy(0, 150));
    await pause(500);

    log("Entering facilitator email: " + facilitatorAlpha.facilitator.email);
    const emailInputs = await page.$$('input[type="email"]');
    if (emailInputs.length > 0) {
      await emailInputs[0].fill(facilitatorAlpha.facilitator.email);
      await pause(PAUSE_MS);
    }

    log("Selecting collaboration modes (CA, SA, SC)...");
    const modeChips = await page.$$(".chip");
    const modesPerRow = Math.ceil(modeChips.length / 2);
    for (let i = 0; i < Math.min(3, modeChips.length); i++) {
      await modeChips[i].click();
      await pause(600);
    }
    await pause(PAUSE_MS);

    // ─── Step 7: Show Generated Invite ────────────────────────────────────────
    log("Step 7: Viewing generated invite configuration...");
    await page.evaluate(() => window.scrollBy(0, 300));
    await pause(PAUSE_MS);

    log("Facilitator Alpha invite URL generated with:");
    log("  - Hazards: " + facilitatorAlpha.selectedHazards.length);
    log("  - Capabilities: " + facilitatorAlpha.selectedCapabilities.length);
    log("  - Solutions: " + facilitatorAlpha.facilitatorSolutions.length);
    await pause(PAUSE_MS * 2);

    // ─── Step 8: Load User Responses ──────────────────────────────────────────
    log("Step 8: Loading user responses...");
    await page.evaluate(() => window.scrollTo(0, 0));
    await pause(PAUSE_MS);

    for (let i = 0; i < 3; i++) {
      log(`Loading user ${i + 1}/3 response...`);
      await page.goto(facilitatorAlpha.userRuns[i].patchUrl);
      await pause(PAUSE_MS);

      log("Scrolling through response data...");
      await page.evaluate(() => window.scrollBy(0, 500));
      await pause(PAUSE_MS);
    }

    // ─── Step 9: Display Merged Results ───────────────────────────────────────
    log("Step 9: Displaying merged results for Alpha (3 users aggregated)...");
    await page.evaluate(() => window.scrollTo(0, 0));
    await pause(PAUSE_MS);

    log("Showing capability assessments table...");
    await page.evaluate(() => window.scrollBy(0, 500));
    await pause(PAUSE_MS * 2);

    log("Showing solution assessments...");
    await page.evaluate(() => window.scrollBy(0, 400));
    await pause(PAUSE_MS * 2);

    // ═══════════════════════════════════════════════════════════════════════════
    // PART 2: FACILITATOR BRAVO WORKFLOW
    // ═══════════════════════════════════════════════════════════════════════════

    log("\n═════════════════════════════════════════════════════════════");
    log("PART 2: FACILITATOR BRAVO WORKFLOW (7 users with suggestions)");
    log("═════════════════════════════════════════════════════════════");

    log("Returning to home page to create second session...");
    await page.goto(`${BASE_URL}/#!dashboard`);
    await pause(PAUSE_MS);

    log("Creating new session 'Facilitator Bravo Workshop'...");
    const sessionInput2 = await page.$(
      'input[placeholder*="session"], input[placeholder*="New"]',
    );
    if (sessionInput2) {
      await sessionInput2.fill("Facilitator Bravo Workshop");
      await pause(PAUSE_MS);
      await page.click(
        `button:has-text("Create"), button:has(i.material-icons:has-text("add"))`,
      );
      await pause(PAUSE_MS);
    }

    log("Waiting for session to load...");
    await page.waitForTimeout(2000);
    await pause(PAUSE_MS);

    log("Navigating to Hazards...");
    await page.goto(`${BASE_URL}/#!hazards`);
    await pause(PAUSE_MS);

    log("Selecting hazards for Bravo scenario...");
    const hazardCheckboxes2 = await page.$$("input[type='checkbox']");
    for (let i = 0; i < Math.min(5, hazardCheckboxes2.length); i++) {
      await hazardCheckboxes2[i].click();
      await pause(400);
    }
    await pause(PAUSE_MS);

    log("Navigating to Capabilities...");
    await page.goto(`${BASE_URL}/#!overview`);
    await pause(PAUSE_MS);

    log("Selecting capabilities for Bravo scenario...");
    const capabilityItems2 = await page.$$(".card, .chip, [data-capability]");
    for (let i = 0; i < Math.min(4, capabilityItems2.length); i++) {
      await capabilityItems2[i].click();
      await pause(400);
    }
    await pause(PAUSE_MS);

    log("Opening Collaboration page for Bravo...");
    await page.goto(`${BASE_URL}/#!collaborate`);
    await pause(PAUSE_MS);

    log("Setting up Facilitator Bravo session (7 users)...");
    const nameInputs2 = await page.$$('input[type="text"]');
    if (nameInputs2.length > 0) {
      await nameInputs2[0].fill(facilitatorBravo.facilitator.name);
      await pause(PAUSE_MS);
    }

    log("Scrolling to email field...");
    await page.evaluate(() => window.scrollBy(0, 150));
    await pause(500);

    const emailInputs2 = await page.$$('input[type="email"]');
    if (emailInputs2.length > 0) {
      await emailInputs2[0].fill(facilitatorBravo.facilitator.email);
      await pause(PAUSE_MS);
    }

    log("Selecting modes (CA, SA, SC with user suggestions)...");
    const modeChips2 = await page.$$(".chip");
    for (let i = 0; i < Math.min(3, modeChips2.length); i++) {
      await modeChips2[i].click();
      await pause(600);
    }
    await pause(PAUSE_MS);

    log(
      "Viewing Bravo invite configuration (4 capabilities, 5 hazards, 3 solutions)...",
    );
    await page.evaluate(() => window.scrollBy(0, 300));
    await pause(PAUSE_MS * 2);

    log("Loading user responses (7 users)...");
    await page.evaluate(() => window.scrollTo(0, 0));
    await pause(PAUSE_MS);

    for (let i = 0; i < facilitatorBravo.userRuns.length; i++) {
      log(
        `Loading user ${i + 1}/${facilitatorBravo.userRuns.length} response...`,
      );
      await page.goto(facilitatorBravo.userRuns[i].patchUrl);
      await pause(PAUSE_MS);
    }

    log("Displaying merged results for Bravo (7 users + suggestions)...");
    await page.evaluate(() => window.scrollTo(0, 0));
    await pause(PAUSE_MS);

    log("Showing aggregated capability assessments...");
    await page.evaluate(() => window.scrollBy(0, 500));
    await pause(PAUSE_MS * 2);

    log("Showing solution assessments with user-suggested solutions...");
    await page.evaluate(() => window.scrollBy(0, 400));
    await pause(PAUSE_MS * 2);

    log("Demonstrating facilitator override capability...");
    await page.evaluate(() => window.scrollBy(0, -400));
    await pause(PAUSE_MS * 2);

    log("\n✅ DEMO COMPLETE!");
    log("Full workflow demonstrated:");
    log("  ✓ Created sessions from home page");
    log("  ✓ Selected hazards and capabilities");
    log("  ✓ Set up facilitator collaboration");
    log("  ✓ Loaded user responses (3 users, then 7 users)");
    log("  ✓ Displayed merged results and aggregations");
    log("\n💾 Stop your screen recording now.");
    log("Press Ctrl+C to close the browser.");
  } catch (error) {
    console.error("Error during demo:", error);
    process.exit(1);
  }
}

recordDemo();
