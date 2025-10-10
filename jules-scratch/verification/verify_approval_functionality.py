import re
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # 1. Navigate to the login page and log in
        page.goto("http://localhost:3000/login")
        page.get_by_label("Email").fill("manager@example.com")
        page.get_by_label("Password").fill("password123")
        page.get_by_role("button", name="Login").click()
        expect(page).to_have_url(re.compile(r".*/dashboard/manager"), timeout=10000)

        # 2. Open the performance modal for the first employee
        first_employee_card = page.get_by_text("John Smith").first
        expect(first_employee_card).to_be_visible(timeout=15000)
        first_employee_card.click()

        # 3. Find the 'Pending Approval' goal and click 'Approve'
        modal = page.get_by_role("dialog")
        expect(modal).to_be_visible()

        # Find the specific goal container using a more precise locator
        pending_goal_container = modal.locator("div.border:has(h3:text-is('Complete Next.js Advanced Tutorial'))")

        # Verify it's pending before clicking
        expect(pending_goal_container.get_by_text("Status: Pending Approval")).to_be_visible()

        approve_button = pending_goal_container.get_by_role("button", name="Approve")
        expect(approve_button).to_be_visible()
        approve_button.click()

        # 4. Wait for the status to update within the same container
        # The modal re-fetches data on action. We wait for the old status to disappear
        # and the new status to appear.
        expect(pending_goal_container.get_by_text("Status: Pending Approval")).not_to_be_visible(timeout=10000)
        expect(pending_goal_container.get_by_text("Status: Active")).to_be_visible()

        print("Goal status successfully updated to 'Active'.")

        # 5. Take a final screenshot for verification
        page.screenshot(path="jules-scratch/verification/approval_success.png")
        print("Screenshot saved to jules-scratch/verification/approval_success.png")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/approval_error.png")
        print("Error screenshot saved to jules-scratch/verification/approval_error.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)