import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const ENGLISH_MESSAGES_FILE = path.join(__dirname, '../../packages/gui/src/services/lang/en.ts');

// Read English messages
const enFileContent = fs.readFileSync(ENGLISH_MESSAGES_FILE, 'utf8');

// Extract all translation keys from en.ts
const translationKeys = new Set<string>();
const keyRegex = /^  "([^"]+)":/gm;
let match;
while ((match = keyRegex.exec(enFileContent)) !== null) {
  translationKeys.add(match[1]);
}

// Also check for object properties like HOME, ABOUT, etc.
const objectRegex = /^  ([A-Z_]+):/gm;
while ((match = objectRegex.exec(enFileContent)) !== null) {
  translationKeys.add(match[1]);
}

console.log(`Found ${translationKeys.size} translation keys in en.ts`);

async function checkPage() {
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext();
  const page = await context.getPage();

  try {
    await page.goto('http://localhost:65533/#!/beoordeling/Mit-RA-01', { waitUntil: 'networkidle' });
    await page.waitForSelector('body', { timeout: 5000 });

    // Get all visible text content
    const bodyText = await page.evaluate(() => {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null
      );

      const texts: string[] = [];
      let node;
      while ((node = walker.nextNode())) {
        const text = node.nodeValue?.trim() || '';
        // Skip empty text and text in script/style tags
        if (text.length > 0 && !text.includes('{') && !text.includes('}')) {
          texts.push(text);
        }
      }
      return texts;
    });

    console.log('\n=== Text content found on page ===');
    console.log(bodyText.join('\n'));

    // Take a screenshot
    await page.screenshot({ path: '/tmp/assessment-page.png' });
    console.log('\nScreenshot saved to /tmp/assessment-page.png');

    // Get the HTML content to analyze
    const htmlContent = await page.evaluate(() => {
      return document.body.innerHTML;
    });

    // Look for translation keys that might be missing (text that looks like it should be translated)
    const potentialMissing: string[] = [];
    const knownKeys = Array.from(translationKeys);

    // Check for common patterns
    for (const key of knownKeys) {
      if (key.endsWith('_desc') || key.endsWith('_title') || key.endsWith('_step')) {
        // Try to find these in the text
        const englishText = (enFileContent as any)[key];
        if (englishText) {
          // Check if this text appears on page (would indicate it's translated)
          // or if key appears (would indicate missing translation)
        }
      }
    }

    console.log('\n=== Analysis ===');
    console.log('Checking for missing translation patterns...');

    // Look for text that looks like untranslated keys
    const textContent = await page.textContent('body');
    if (textContent) {
      // Check for common untranslated patterns
      const patterns = [
        /Step \d+/g,
        /Capability Gap/g,
        /Solution/g,
        /Roadmap/g,
        /Goal/g,
        /Aspect/g,
        /Performance/g,
        /Assessment/g,
        /Description/g,
        /Name/g,
        /Title/g,
      ];

      for (const pattern of patterns) {
        const matches = textContent.match(pattern);
        if (matches) {
          console.log(`Found ${matches.length} matches for pattern: ${pattern}`);
        }
      }
    }

    // Check for specific keys that might be missing based on the URL path
    console.log('\n=== URL Analysis ===');
    console.log('URL contains "beoordeling" which is Dutch for "assessment"');
    console.log('If English is selected, it should show "assessment" instead');

    await page.waitForTimeout(2000);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

checkPage().catch(console.error);
