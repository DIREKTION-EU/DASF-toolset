# Collaboration E2E Scripts

This folder contains Bun + TypeScript helpers for real-world collaboration flow testing.

The scripts generate two facilitator workshop scenarios:

- Facilitator Alpha with 3 users
- Facilitator Bravo with 7 users

Both scenarios include selected hazards, selected capabilities, facilitator-provided solutions, user capability feedback, and merged outputs. The Bravo scenario also includes user-suggested solutions.

## Commands

From this folder:

- `bun run facilitator` prints a basic single facilitator scenario.
- `bun run invitee` prints a basic invitee patch scenario.
- `bun run roundtrip` prints the full multi-facilitator real-world scenario output.
- `bun run real-world` alias for `bun run roundtrip`.
- `bun run record-demo` **Launches an interactive browser demo for screen recording**

## Screen Recording Demo

To record a video of the full collaboration flow:

### Prerequisites

Install Playwright (required for the automated demo script):

```bash
bun add -d @playwright/test playwright
```

### Recording Instructions

1. **Ensure the dev server is running:**

   ```bash
   pnpm start  # from project root
   ```

2. **Open your screen recording tool** (OBS, macOS Screenshot, ScreenFlow, etc.) and prepare to record.

3. **Run the demo script:**

   ```bash
   bun run record-demo
   ```

4. **Start recording** in your screen recording tool, then watch the browser as the script automatically:
   - **Facilitator Alpha session** (3 users)
     - Enters facilitator name & email
     - Selects collaboration modes (CA, SA, SC)
     - Views generated invite configuration (hazards, capabilities, solutions)
     - Loads user 1, 2, 3 responses sequentially
     - Displays merged results with aggregated capability scores and solution assessments
   - **Facilitator Bravo session** (7 users with user suggestions)
     - Enters facilitator name & email
     - Selects collaboration modes
     - Views invite configuration
     - Loads all 7 user responses
     - Displays merged results with user-suggested solutions
     - Demonstrates facilitator override feature

5. **Stop recording** once the script completes and the console shows ✅ Demo complete.

6. The browser stays open (headless=false) so you can inspect results. **Press Ctrl+C** to close.

### Recording Tips

- Use **1280×720 resolution** for optimal video quality
- Allow **3-second pauses** between major steps (built-in for narration/review)
- Watch the **console output** (left side) to follow along with what's happening
- Adjust `PAUSE_MS` in `src/record-demo.ts` if you need more time between steps

### Alternative: Manual Browser Recording

If you prefer not to install Playwright, you can manually record the flow:

1. Open <http://localhost:65533/#!collaborate> in your browser
2. Record your screen with your preferred tool
3. Manually fill in the facilitator form, select modes, and navigate through the user responses using the generated URLs from `bun run real-world`

## Browser testing

Use the generated scenario URLs with browser automation to verify facilitator setup, invitee contributions, patch loading, aggregation, and facilitator override behavior.

## Screenshots

Store milestone screenshots under:

- `e2e/collaboration/screenshots`
