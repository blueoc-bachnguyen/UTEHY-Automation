# Playwright Setup & Usage Guide (npm)

This document provides instructions for installing and running [Playwright](https://playwright.dev/) using **yarn**.

---

## 📦 Installation

### Install dependencies

```bash
yarn install
```

---

## ▶️ Running Tests

### Run all tests

```bash
yarn playwright test
```

### Run tests with a specific browser

```bash
yarn playwright test --project=chromium
yarn playwright test --project=firefox
yarn playwright test --project=webkit
```

### Run a single test file

```bash
yarn playwright test tests/example.spec.ts
```

### Open Playwright UI mode

```bash
yarn playwright test --ui
```

---

# Exercises

## Requirements

1. Clone this repository to your local machine:
   ```bash
   git clone git@github.com:blueoc-bachnguyen/UTEHY-Automation.git
   ```
2. Create a new branch from `main` following this format:
   ```bash
   git checkout -b exercises/{your_first_name}-{your_last_name}-{your-the-order-exercise} main
   ```
3. After completing the exercise, push your code to the branch you created:
   ```bash
   git add .
   git commit -m `your-message`
   git push
   ```

## Exercise

### Complete the excercise. SEE [HERE](exercise.md)


npm install
npm ci
npx playwright install
npm run test            # run tests headless
npm run test:headed     # run with visible browser
npm run test:report     # generate html report
npx playwright show-report
