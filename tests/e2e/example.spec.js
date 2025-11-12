import { test, expect } from '@playwright/test';

test.describe('Basic Navigation', () => {
  test('should load the home page', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Check for common elements that should be present
    const pageTitle = await page.title();
    expect(pageTitle).toBeTruthy();
    
    // Check for common elements (adjust these selectors based on your app)
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'test-results/screenshot.png' });
    
    // Output some debug information
    console.log('Page title:', pageTitle);
    console.log('Body content length:', bodyText?.length || 0);
  });
});
