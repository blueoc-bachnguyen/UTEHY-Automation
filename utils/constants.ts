export const USERS = {
  STANDARD: 'standard_user',
  LOCKED: 'locked_out_user',
  PROBLEM: 'problem_user',           // Check ảnh lỗi
  PERFORMANCE: 'performance_glitch_user', // Check tốc độ
  ERROR: 'error_user',               // Check lỗi logic checkout
  VISUAL: 'visual_user'              // Check giao diện lệch
};

export const PASSWORD = 'secret_sauce';

export const URLS = {
  BASE: '/',
  INVENTORY: '/inventory.html',
  CART: '/cart.html',
  CHECKOUT_ONE: '/checkout-step-one.html',
  CHECKOUT_TWO: '/checkout-step-two.html',
  FINISH: '/checkout-complete.html'
};

export const MESSAGES = {
  LOGIN_FAIL: 'Epic sadface: Username and password do not match any user in this service',
  LOCKED: 'Epic sadface: Sorry, this user has been locked out.',
  MISSING_NAME: 'Error: First Name is required',
  REQ_LOGIN: "Epic sadface: You can only access '/inventory.html' when you are logged in.",
  SUCCESS_ORDER: 'Thank you for your order!'
};