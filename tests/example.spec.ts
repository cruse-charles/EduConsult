import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

// @ts-ignore
async function loginAsConsultant(page) {
  await page.goto("/");

  const loginLink = page.getByRole("link", { name: "Log In" });
  await expect(loginLink).toBeVisible();

  await Promise.all([
    page.waitForURL("**/login"),
    loginLink.click(),
  ]);

  await expect(page).toHaveURL(/login/);

  // Wait for email input to be visible
  await page.waitForSelector('input[name="email"]');

  // Wait for email input to be visible
  await page.waitForSelector('input[name="email"]');

  // Fill in email and password
  await page.locator('input[name="email"]').fill(process.env.TEST_EMAIL!);
  await page.locator('input[name="password"]').fill(process.env.TEST_PASSWORD!);

  // Click login button
  await page.getByRole("button", { name: /login/i }).click();

  // Assert successful login
  await expect(page).toHaveURL(/dashboard/);
}

// test("login button navigates to login page and can login", async ({ page }) => {
//   await loginAsConsultant(page);
// });

test("create a student", async ({ page }) => {
  await loginAsConsultant(page);

  // Click Add Student button
  await page.getByRole("button", { name: "Add Student" }).click();

  // Wait for modal to open
  await page.waitForSelector('.create-student-modal');

  // Fill Student Account Form
  // await page.locator('input[name="email"]').nth(1).fill('teststudent99@example.com'); // Second email input in modal
  await page.locator('input[name="email"]').fill('teststudent99@example.com'); // Second email input in modal
  await page.locator('input[name="password"]').fill('password');

  // Fill Personal Info
  await page.locator('input[name="firstName"]').fill('John');
  await page.locator('input[name="lastName"]').fill('Doe');
  await page.locator('input[name="phone"]').fill('123-456-7890');
  await page.locator('input[name="other"]').fill('Other info');
  await page.locator('textarea[name="notes"]').fill('Test notes');

  // Fill Academic Info
  await page.locator('input[name="currentSchool"]').fill('Test High School');
  await page.locator('input[name="grade"]').fill('12');
  await page.locator('input[name="gpa"]').fill('3.8');
  await page.locator('input[name="sat"]').fill('1400');
  await page.locator('input[name="toefl"]').fill('100');
  await page.locator('input[name="targetSchools"]').fill('Harvard, MIT');
  await page.locator('input[name="act"]').fill('30');
  await page.locator('input[name="ielts"]').fill('7.0');
  await page.locator('input[name="intendedMajor"]').fill('Business');

  // Fill Goals and Notes (assuming additional fields)
  // If there are more, add here

  // Click Submit
  await page.getByRole("button", { name: "submit" }).click();

  // Wait for modal to close or success message
  await page.waitForSelector('.create-student-modal', { state: 'hidden' });

  // Optionally, check for success toast or student in list
  await expect(page.getByText('Student Account Created')).toBeVisible();
});