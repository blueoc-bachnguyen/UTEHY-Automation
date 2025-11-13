# Final Project – E-Commerce Test Automation

**Website demo**: [https://www.saucedemo.com](https://www.saucedemo.com/)

---

## 🎯 Project Goals

- Build an **end-to-end automated test suite** using **Playwright + TypeScript**
- Apply **Page Object Model (POM)** for code organization
- Integrate with **CI/CD pipeline** (GitHub Actions/GitLab/Jenkins)
- Provide **comprehensive reporting** (Allure or HTML with screenshots & videos)

---

## 🔑 Requirements

### 1. Authentication Tests

- Valid login with standard user
- Invalid login (wrong username/password)
- Locked-out user scenario
- Logout test (verify redirect to login page)
- Session persistence after page reload

### 2. Product & Cart Tests

- Add multiple products to cart and verify cart count
- Remove product from cart
- Add → remove → add again, verify consistency
- Verify product details (name, description, price) match between listing and detail page
- Verify product sorting (Price low→high, Price high→low, A→Z, Z→A)
- Verify product images load correctly
- Attempt to add item without login (should not be possible)

### 3. Checkout Flow Tests

- Complete checkout process with valid user info
- Negative case: missing required fields (e.g., postal code, name)
- Checkout with multiple items and verify total price calculation
- Verify order confirmation page and summary
- Validate tax calculation on checkout page
- Cancel checkout and ensure cart remains preserved

### 4. Visual & UI Tests

- Verify menu items visible (All Items, About, Logout, Reset App State)
- Responsive layout test (desktop vs. mobile viewport)
- Verify UI elements enabled/disabled depending on state (e.g., Checkout button disabled if cart empty)
- Validate image dimensions are consistent

### 5. Error Handling & Edge Cases

- Handle flaky selectors with retry/wait strategies
- Validate error messages on failed login/checkout
- Attempt checkout with empty cart (should block checkout)
- Try accessing checkout page directly without login (should redirect to login)
- Simulate network delay and verify stability

### 6. Reporting

- Generate test reports (Allure or HTML)
- Include screenshots & video recordings for failed tests

### 7. CI/CD Pipeline Integration (Optional)

- Set up GitHub Actions or GitLab CI or Jenkins pipeline:
  - Install dependencies
  - Run tests in headless mode
  - Generate & upload test report as an artifact

---

## 🌟 Extra (Bonus Challenges)

- Parallel execution of test suites to reduce runtime
- Cross-browser testing (Chrome, Firefox, WebKit)
- Retry mechanism for flaky tests

---

## 📊 Evaluation Criteria (Suggested Rubric)

- **45%**: Functional coverage (auth, product, cart, checkout)
- **20%**: Code quality (POM, reusable methods, modular structure)
- **20%**: Debugging & reporting (screenshots, logs, reports)
- **5%**: CI/CD pipeline integration
- **10%**: Bonus challenges (parallel run, cross-browser, data-driven tests)

---

## 📦 Deliverables

- Source code in a GitHub/GitLab repository
- README.md with instructions to run tests locally and in CI/CD
- Test reports (screenshots, videos, HTML/Allure reports)
- Pipeline configuration file (.yml or Jenkinsfile)
