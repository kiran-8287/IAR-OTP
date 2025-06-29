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
        // Form elements
        this.emailInput = document.getElementById('email');
        this.otpInput = document.getElementById('otp');
        this.sendOtpBtn = document.getElementById('sendOtpBtn');
        this.loginBtn = document.getElementById('loginBtn');
        this.resendBtn = document.getElementById('resendBtn');
        
        // Sections
        this.otpSection = document.getElementById('otpSection');
        this.successMessage = document.getElementById('successMessage');
        this.signinForm = document.getElementById('signinForm');
        
        // Error elements
        this.emailError = document.getElementById('emailError');
        this.otpError = document.getElementById('otpError');
        
        // Loaders
        this.otpLoader = document.getElementById('otpLoader');
        this.loginLoader = document.getElementById('loginLoader');
    }
    
    bindEvents() {
        this.sendOtpBtn.addEventListener('click', () => this.handleSendOTP());
        this.loginBtn.addEventListener('click', () => this.handleLogin());
        this.resendBtn.addEventListener('click', () => this.handleResendOTP());
        
        // Input validation
        this.emailInput.addEventListener('input', () => this.clearError('email'));
        this.otpInput.addEventListener('input', (e) => {
            this.clearError('otp');
            this.formatOTPInput(e);
        });
        
        // Enter key handling
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
        console.log('📧 Enter your institutional email to begin');
        console.log('💡 Generated OTP codes will be displayed in this console');
    }
    
    formatOTPInput(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 6) value = value.slice(0, 6);
        e.target.value = value;
        
        // Auto-submit when 6 digits are entered
        if (value.length === 6) {
            setTimeout(() => this.handleLogin(), 300);
        }
    }
    
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const iitpkdRegex = /^[^\s@]+@iitpkd\.ac\.in$/;
        
        if (!emailRegex.test(email)) {
            return { valid: false, message: 'Please enter a valid email address' };
        }
        
        // Suggest IIT Palakkad email but don't enforce it for demo purposes
        if (!iitpkdRegex.test(email)) {
            console.log('💡 Note: For actual IIT Palakkad systems, use your @iitpkd.ac.in email');
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
    
    showLoader(button, loader) {
        button.classList.add('loading');
        button.disabled = true;
    }
    
    hideLoader(button, loader) {
        button.classList.remove('loading');
        button.disabled = false;
    }
    
    async handleSendOTP() {
        const email = this.emailInput.value.trim();
        
        // Validate email
        if (!email) {
            this.showError('email', 'Please enter your email address');
            this.emailInput.focus();
            return;
        }
        
        const validation = this.validateEmail(email);
        if (!validation.valid) {
            this.showError('email', validation.message);
            this.emailInput.focus();
            return;
        }
        
        // Show loading state
        this.showLoader(this.sendOtpBtn, this.otpLoader);
        
        // Simulate API call delay
        await this.delay(2000);
        
        // Generate OTP
        this.generatedOTP = this.generateOTP();
        this.otpExpiry = Date.now() + (5 * 60 * 1000); // 5 minutes expiry
        
        // Log OTP to console with IIT Palakkad branding
        console.log('═══════════════════════════════════════');
        console.log('🏛️ IIT PALAKKAD - OTP GENERATED');
        console.log('═══════════════════════════════════════');
        console.log(`🔐 Generated OTP: ${this.generatedOTP}`);
        console.log(`📧 Email: ${email}`);
        console.log(`⏰ Valid until: ${new Date(this.otpExpiry).toLocaleTimeString()}`);
        console.log(`🔒 Security: 6-digit code, 5-minute expiry`);
        console.log(`🎯 Max attempts: ${this.maxAttempts}`);
        console.log('═══════════════════════════════════════');
        
        // Hide loader and show OTP section
        this.hideLoader(this.sendOtpBtn, this.otpLoader);
        this.showOTPSection();
        
        // Start resend timer
        this.startResendTimer();
        
        // Focus on OTP input
        setTimeout(() => this.otpInput.focus(), 300);
    }
    
    async handleLogin() {
        const enteredOTP = this.otpInput.value.trim();
        
        // Validate OTP input
        if (!enteredOTP) {
            this.showError('otp', 'Please enter the OTP sent to your email');
            this.otpInput.focus();
            return;
        }
        
        if (enteredOTP.length !== 6) {
            this.showError('otp', 'OTP must be exactly 6 digits');
            this.otpInput.focus();
            return;
        }
        
        // Check if OTP has expired
        if (Date.now() > this.otpExpiry) {
            this.showError('otp', 'OTP has expired. Please request a new one.');
            return;
        }
        
        // Show loading state
        this.showLoader(this.loginBtn, this.loginLoader);
        
        // Simulate API call delay
        await this.delay(1500);
        
        // Verify OTP
        if (enteredOTP === this.generatedOTP) {
            console.log('═══════════════════════════════════════');
            console.log('✅ IIT PALAKKAD - LOGIN SUCCESSFUL');
            console.log('═══════════════════════════════════════');
            console.log(`👤 User: ${this.emailInput.value}`);
            console.log(`🕐 Login time: ${new Date().toLocaleString()}`);
            console.log(`🎓 Welcome to IIT Palakkad Portal!`);
            console.log('═══════════════════════════════════════');
            this.showSuccessMessage();
        } else {
            this.currentAttempts++;
            
            if (this.currentAttempts >= this.maxAttempts) {
                console.log('🚫 Maximum login attempts exceeded');
                this.showError('otp', 'Maximum attempts exceeded. Please request a new OTP.');
                this.resetForm();
            } else {
                const remainingAttempts = this.maxAttempts - this.currentAttempts;
                console.log(`❌ Invalid OTP attempt ${this.currentAttempts}/${this.maxAttempts}`);
                this.showError('otp', `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`);
                this.otpInput.value = '';
                this.otpInput.focus();
            }
        }
        
        this.hideLoader(this.loginBtn, this.loginLoader);
    }
    
    async handleResendOTP() {
        if (this.resendBtn.disabled) return;
        
        this.clearError('otp');
        this.currentAttempts = 0;
        
        // Generate new OTP
        this.generatedOTP = this.generateOTP();
        this.otpExpiry = Date.now() + (5 * 60 * 1000);
        
        // Log new OTP to console
        console.log('═══════════════════════════════════════');
        console.log('🔄 IIT PALAKKAD - NEW OTP GENERATED');
        console.log('═══════════════════════════════════════');
        console.log(`🔐 New OTP: ${this.generatedOTP}`);
        console.log(`📧 Email: ${this.emailInput.value}`);
        console.log(`⏰ Valid until: ${new Date(this.otpExpiry).toLocaleTimeString()}`);
        console.log('═══════════════════════════════════════');
        
        // Clear OTP input
        this.otpInput.value = '';
        this.otpInput.focus();
        
        // Start resend timer
        this.startResendTimer();
        
        // Show success feedback
        this.showTemporaryMessage('New OTP sent successfully!');
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
    
    showOTPSection() {
        this.otpSection.classList.add('active');
        this.sendOtpBtn.textContent = 'OTP Sent ✓';
        this.sendOtpBtn.disabled = true;
        this.emailInput.disabled = true;
    }
    
    showSuccessMessage() {
        this.signinForm.style.display = 'none';
        this.successMessage.classList.add('active');
        
        // Clear sensitive data
        this.generatedOTP = null;
        this.otpExpiry = null;
        
        // Add countdown timer for redirect
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
                
                // Redirect to profile page
                console.log('🎓 Redirecting to IIT Palakkad Alumni Profile...');
                window.location.href = 'index1.html';
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
        
        console.log('🔄 Form reset - ready for new authentication attempt');
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new IITPalakkadOTPSignIn();
});

// Add additional CSS for temporary messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { 
            opacity: 0; 
            transform: translateX(100px); 
        }
        to { 
            opacity: 1; 
            transform: translateX(0); 
        }
    }
    
    @keyframes slideOut {
        from { 
            opacity: 1; 
            transform: translateX(0); 
        }
        to { 
            opacity: 0; 
            transform: translateX(100px); 
        }
    }
`;
document.head.appendChild(style);