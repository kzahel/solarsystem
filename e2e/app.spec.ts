import { test, expect } from '@playwright/test';

test('should load without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });

    page.on('pageerror', exception => {
        consoleErrors.push(`Uncaught exception: ${exception.message}`);
    });

    await page.goto('http://localhost:5173');

    // Wait a bit to ensure app loads
    await page.waitForTimeout(2000);

    if (consoleErrors.length > 0) {
        console.error('Console errors detected:', consoleErrors);
    }

    expect(consoleErrors).toEqual([]);

    // Also verify canvas exists
    await expect(page.locator('canvas')).toBeVisible();
});
