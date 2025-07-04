class IITPalakkadOTPSignIn {
    constructor() {
        this.generatedOTP = null;
        this.otpExpiry = null;
        this.resendTimeout = null;
        this.maxAttempts = 3;
        this.currentAttempts = 0;

        this.initializeElements();
        this.bindEvents();
        this.displayWelcomeMessage();
    }

    initializeElements() {
        this.emailInput = document.getElementById('email');
        this.otpInput = document.getElementById('otp');
        this.sendOtpBtn = document.getElementById('sendOtpBtn');
        this.loginBtn = document.getElementById('loginBtn');
        this.resendBtn = document.getElementById('resendBtn');
        this.otpSection = document.getElementById('otpSection');
        this.successMessage = document.getElementById('successMessage');
        this.signinForm = document.getElementById('signinForm');
        this.emailError = document.getElementById('emailError');
        this.otpError = document.getElementById('otpError');
        this.otpLoader = document.getElementById('otpLoader');
        this.loginLoader = document.getElementById('loginLoader');
    }

    bindEvents() {
        this.sendOtpBtn.addEventListener('click', () => this.handleSendOTP());
        this.loginBtn.addEventListener('click', () => this.handleLogin());
        this.resendBtn.addEventListener('click', () => this.handleResendOTP());
        this.emailInput.addEventListener('input', () => this.clearError('email'));
        this.otpInput.addEventListener('input', (e) => {
            this.clearError('otp');
            this.formatOTPInput(e);
        });

        this.emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSendOTP();
        });

        this.otpInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });
    }

    displayWelcomeMessage() {
        console.log('🏛️ IIT Palakkad Authentication System');
        console.log('🔐 Secure OTP-based Sign-In Portal');
    }

    formatOTPInput(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 6) value = value.slice(0, 6);
        e.target.value = value;
        if (value.length === 6) setTimeout(() => this.handleLogin(), 300);
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const iitpkdRegex = /^[^\s@]+@iitpkd\.ac\.in$/;

        if (!emailRegex.test(email)) {
            return { valid: false, message: 'Please enter a valid email address' };
        }

        if (!iitpkdRegex.test(email)) {
            console.log('💡 Note: Use @iitpkd.ac.in for institutional access');
        }

        return { valid: true };
    }

    showError(field, message) {
        const errorElement = field === 'email' ? this.emailError : this.otpError;
        errorElement.textContent = message;
        errorElement.classList.add('active');
    }

    clearError(field) {
        const errorElement = field === 'email' ? this.emailError : this.otpError;
        errorElement.classList.remove('active');
        errorElement.textContent = '';
    }

    showLoader(button) {
        button.classList.add('loading');
        button.disabled = true;
    }

    hideLoader(button) {
        button.classList.remove('loading');
        button.disabled = false;
    }

    async handleSendOTP() {
        const email = this.emailInput.value.trim();
        if (!email) {
            this.showError('email', 'Please enter your email address');
            return;
        }

        const validation = this.validateEmail(email);
        if (!validation.valid) {
            this.showError('email', validation.message);
            return;
        }

        this.showLoader(this.sendOtpBtn);

        try {
            const response = await fetch('https://iar-otp-backend.onrender.com/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                this.hideLoader(this.sendOtpBtn);
                this.showOTPSection();
                this.startResendTimer();
                setTimeout(() => this.otpInput.focus(), 300);
                this.currentEmail = email;
            } else {
                this.showError('email', 'Failed to send OTP. Try again.');
                this.hideLoader(this.sendOtpBtn);
            }
        } catch (err) {
            console.error('Send OTP Error:', err);
            this.showError('email', 'Network error. Try again.');
            this.hideLoader(this.sendOtpBtn);
        }
    }

    async handleLogin() {
        const enteredOTP = this.otpInput.value.trim();
        const email = this.currentEmail || this.emailInput.value.trim();

        if (!enteredOTP || enteredOTP.length !== 6) {
            this.showError('otp', 'OTP must be exactly 6 digits');
            return;
        }

        this.showLoader(this.loginBtn);

        try {
            const response = await fetch('https://iar-otp-backend.onrender.com/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: enteredOTP })
            });

            const result = await response.json();
            if (result.success) {
                this.showSuccessMessage();
            } else {
                this.currentAttempts++;
                if (this.currentAttempts >= this.maxAttempts) {
                    this.showError('otp', 'Max attempts reached. Request new OTP.');
                    this.resetForm();
                } else {
                    const left = this.maxAttempts - this.currentAttempts;
                    this.showError('otp', `Invalid OTP. ${left} attempt(s) left.`);
                    this.otpInput.value = '';
                    this.otpInput.focus();
                }
            }
        } catch (err) {
            console.error('Login Error:', err);
            this.showError('otp', 'Network error. Try again.');
        }

        this.hideLoader(this.loginBtn);
    }

    async handleResendOTP() {
        if (this.resendBtn.disabled) return;
        this.clearError('otp');
        this.currentAttempts = 0;

        const email = this.currentEmail || this.emailInput.value.trim();

        try {
            const response = await fetch('https://iar-otp-backend.onrender.com/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                this.otpInput.value = '';
                this.otpInput.focus();
                this.startResendTimer();
                this.showTemporaryMessage('New OTP sent successfully!');
            } else {
                this.showError('otp', 'Failed to resend OTP. Try again.');
            }
        } catch (err) {
            console.error('Resend Error:', err);
            this.showError('otp', 'Network error. Try again.');
        }
    }

    showOTPSection() {
        this.otpSection.classList.add('active');
        this.sendOtpBtn.textContent = 'OTP Sent ✓';
        this.sendOtpBtn.disabled = true;
        this.emailInput.disabled = true;
    }

    showSuccessMessage() {
        this.signinForm.style.display = 'none';
        this.successMessage.classList.add('active');
        this.generatedOTP = null;
        this.otpExpiry = null;

        let countdown = 3;
        const successText = this.successMessage.querySelector('p');
        const originalText = successText.textContent;

        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                successText.textContent = `Welcome to IIT Palakkad Alumni Portal. Redirecting in ${countdown} second${countdown > 1 ? 's' : ''}...`;
            } else {
                clearInterval(countdownInterval);
                successText.textContent = 'Redirecting to Alumni Portal...';
                window.location.href = 'index1.html';
            }
        }, 1000);
    }

    showTemporaryMessage(message) {
        const tempMessage = document.createElement('div');
        tempMessage.className = 'temp-message';
        tempMessage.textContent = message;
        tempMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            font-weight: 600;
            z-index: 1000;
            box-shadow: 0 8px 24px rgba(40, 167, 69, 0.3);
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(tempMessage);
        setTimeout(() => {
            tempMessage.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => tempMessage.remove(), 300);
        }, 3000);
    }

    startResendTimer() {
        let timeLeft = 30;
        this.resendBtn.disabled = true;
        this.resendBtn.textContent = `Resend OTP (${timeLeft}s)`;

        this.resendTimeout = setInterval(() => {
            timeLeft--;
            this.resendBtn.textContent = `Resend OTP (${timeLeft}s)`;

            if (timeLeft <= 0) {
                clearInterval(this.resendTimeout);
                this.resendBtn.disabled = false;
                this.resendBtn.textContent = 'Resend OTP';
            }
        }, 1000);
    }

    resetForm() {
        this.generatedOTP = null;
        this.otpExpiry = null;
        this.currentAttempts = 0;

        this.emailInput.disabled = false;
        this.emailInput.value = '';
        this.otpInput.value = '';
        this.sendOtpBtn.disabled = false;
        this.sendOtpBtn.textContent = 'Send OTP';
        this.otpSection.classList.remove('active');

        this.clearError('email');
        this.clearError('otp');

        if (this.resendTimeout) {
            clearInterval(this.resendTimeout);
            this.resendBtn.disabled = false;
            this.resendBtn.textContent = 'Resend OTP';
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new IITPalakkadOTPSignIn();
});

// CSS Animations for temporary messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { opacity: 0; transform: translateX(100px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100px); }
    }
`;
document.head.appendChild(style);
