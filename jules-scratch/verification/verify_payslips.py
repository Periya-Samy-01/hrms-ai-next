from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Log in as an employee
    page.goto("http://localhost:3000/login")
    page.get_by_label("Email").fill("john.smith@example.com")
    page.get_by_label("Password").fill("password123")
    page.get_by_role("button", name="Login").click()

    # Wait for navigation to the dashboard
    page.wait_for_url("**/dashboard/employee")

    # Navigate to the payslips page
    page.get_by_role("link", name="View Payslips").click()
    page.wait_for_url("**/dashboard/employee/payslips")

    # Wait for the payslips to load and take a screenshot
    page.wait_for_selector("text=My Payslips")
    page.screenshot(path="jules-scratch/verification/payslips_page.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
