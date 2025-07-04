# 🔐 IAR-OTP: Secure OTP Verification Sign-In Page

## 🌐 Live Demo
- 🔗 [Frontend (GitHub Pages)](https://kiran-8287.github.io/IAR-OTP/)
- 🔗 [Backend (Render)](https://iar-otp-backend.onrender.com)

---

## ✅ Features Completed

- 🎨 Fully Functional Sign-In Page with OTP Verification using:
  - **Frontend**: HTML, CSS, JavaScript
  - **Backend**: Node.js + Express + Nodemailer
- 💬 Real-Time OTP System
  - Sends OTP to entered email using Gmail SMTP
  - OTP expires after **5 minutes**
  - Allows maximum of **3 login attempts per OTP**
  - Resend OTP functionality with **30s cooldown**
- 🖌 Clean & Responsive UI  
  - Yellow-white-black theme with subtle orange highlights  
  - Inspired by IIT Palakkad’s design system
- 🧩 Modular Components:
  - 📧 Validated email input
  - 📨 "Send OTP" triggers live email from Render backend
  - 🔢 OTP auto-formatting input
  - 🔓 Login with success redirect
- ✨ UI Features:
  - Smooth transitions, loaders, and toast-style success messages
  - Fully mobile responsive using only vanilla JavaScript & CSS
  - Accessible error handling and keyboard input support

---

## ⚠ Issues Faced

- 📱 Responsive spacing tweaks across screen sizes
- 🔐 Balancing user experience vs. security for OTP resend & retry logic
- ⚙️ Managing backend environment variables securely for Gmail credentials
- 📤 Render deployment required correct `Root Directory` setup

---

## 🚀 Suggestions for Future Enhancements

- 🧠 Use JWT-based sessions instead of OTP-only for authentication
- 📦 Store OTPs and login attempts in a real database (e.g., MongoDB)
- 🔁 Add retry rate-limiting and email verification history
- 🧑‍🎓 Link login system to actual user profile data
- ✅ Implement domain whitelisting (e.g., restrict to `@iitpkd.ac.in`)
- 🛡 Add CAPTCHA or throttling to prevent spam
- 📊 Admin dashboard for monitoring email activity

---

## 🛠 Tech Stack Used

| Layer        | Technology                                |
|--------------|--------------------------------------------|
| **Frontend** | HTML, CSS, JavaScript (Vanilla)            |
| **Backend**  | Node.js, Express.js, Nodemailer            |
| **Email**    | Gmail SMTP (App Password)                  |
| **Hosting**  | Frontend: GitHub Pages                     |
|              | Backend: Render (free Node.js hosting)     |

---
