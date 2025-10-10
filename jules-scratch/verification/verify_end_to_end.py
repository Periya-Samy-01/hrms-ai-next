import re
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # --- Manager Flow: Approve a Goal ---
        print("--- Starting Manager Flow ---")

        # 1. Log in as manager
        page.goto("http://localhost:3000/login")
        page.get_by_label("Email").fill("manager@example.com")
        page.get_by_label("Password").fill("password123")
        page.get_by_role("button", name="Login").click()
        expect(page).to_have_url(re.compile(r".*/dashboard/manager"), timeout=10000)
        print("Manager logged in successfully.")

        # 2. Open modal for "John Smith"
        first_employee_card = page.get_by_text("John Smith").first
        expect(first_employee_card).to_be_visible(timeout=15000)
        first_employee_card.click()
        print("Performance modal opened.")

        # 3. Approve the 'Pending Approval' goal
        modal = page.get_by_role("dialog")
        expect(modal).to_be_visible()

        pending_goal_container = modal.locator("div.border:has(h3:text-is('Complete Next.js Advanced Tutorial'))")
        approve_button = pending_goal_container.get_by_role("button", name="Approve")
        expect(approve_button).to_be_visible()
        approve_button.click()

        # 4. Verify the status updates in the modal
        expect(pending_goal_container.get_by_text("Status: Active")).to_be_visible(timeout=10000)
        print("Goal approved successfully by manager.")

        # 5. Close the modal
        modal.get_by_role("button", name="×").click()
        expect(modal).not_to_be_visible()
        print("Modal closed.")

        # 6. Take a screenshot and log out
        page.screenshot(path="jules-scratch/verification/manager_view.png")
        page.get_by_role("button", name="Logout").click()
        expect(page).to_have_url(re.compile(r".*/login"))
        print("Manager logged out.")

        # --- Employee Flow: Verify Goal Status ---
        print("\n--- Starting Employee Flow ---")

        # 7. Log in as employee "John Smith"
        page.get_by_label("Email").fill("john.smith@example.com")
        page.get_by_label("Password").fill("password123")
        page.get_by_role("button", name="Login").click()
        expect(page).to_have_url(re.compile(r".*/dashboard/employee"), timeout=10000)
        print("Employee logged in successfully.")

        # 8. Verify the approved goal's status on the dashboard
        goal_container = page.locator("div.p-4:has-text('Complete Next.js Advanced Tutorial')")
        expect(goal_container).to_be_visible()

        status_span = goal_container.locator("span.font-semibold")
        expect(status_span).to_have_text("Active")
        print("Employee dashboard correctly shows 'Active' status.")

        # 9. Take a final screenshot for verification
        page.screenshot(path="jules-scratch/verification/employee_view.png")
        print("Screenshots saved successfully.")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/e2e_error.png")
        print("Error screenshot saved.")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)