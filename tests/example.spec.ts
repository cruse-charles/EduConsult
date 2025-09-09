import { test, expect } from '@playwright/test';

// test('has title', async ({ page }) => {
//   await page.goto('/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle("EduConsult Pro");
// });


test("login button navigates to login page and can login", async ({ page }) => {
  await page.goto("/");

  const loginLink = page.getByRole("link", { name: "Log In" });

  await expect(loginLink).toBeVisible();

  await Promise.all([
    page.waitForURL("**/login"),
    loginLink.click(),
  ]);

  await expect(page).toHaveURL(/login/);

  // Fill in email and password
  await page.locator('input[name="email"]').fill(process.env.TEST_EMAIL!);
  await page.locator('input[name="password"]').fill(process.env.TEST_PASSWORD!);

  // Click login button
  await page.getByRole("button", { name: /login/i }).click();

  // For successful login
  await expect(page).toHaveURL(/dashboard/);
});