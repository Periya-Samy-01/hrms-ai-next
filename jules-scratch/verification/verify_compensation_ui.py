from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Log in as HR user
        page.goto("http://localhost:3000/login")
        page.get_by_label("Email").fill("hr@example.com")
        page.get_by_label("Password").fill("password123")
        page.get_by_role("button", name="Login").click()

        # Wait for navigation to the HR dashboard
        expect(page).to_have_url("http://localhost:3000/dashboard/hr")

        # Navigate to the Employee Directory
        page.get_by_role("link", name="Employee Directory").click()
        expect(page).to_have_url("http://localhost:3000/dashboard/hr/directory")

        # Click on the first employee in the list (John Smith)
        page.get_by_text("John Smith").click()

        # Wait for the profile page to load and find the employeeId from the URL
        expect(page).to_contain_text("Personal Details")

        # Verify the Compensation tab is visible and click it
        compensation_tab = page.get_by_role("button", name="Compensation")
        expect(compensation_tab).to_be_visible()
        compensation_tab.click()

        # Check if the compensation form is loaded
        expect(page.get_by_role("heading", name="Manage Compensation")).to_be_visible()

        # Fill out and submit the form
        page.get_by_label("Base Salary").fill("90000")
        page.get_by_label("Pay Frequency").select_option("Monthly")
        page.get_by_label("Effective Date").fill("2025-11-01")
        page.get_by_role("button", name="Save Compensation").click()

        # Check for success message
        expect(page.get_by_text("Compensation details saved successfully!")).to_be_visible()

        # Take a screenshot of the successful form submission
        page.screenshot(path="jules-scratch/verification/compensation_ui_verification.png")
        print("Screenshot taken successfully.")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error_screenshot.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)