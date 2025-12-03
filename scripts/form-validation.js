// Form validation and error handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formInputs = {
        name: contactForm.querySelector('#name'),
        email: contactForm.querySelector('#email'),
        subject: contactForm.querySelector('#subject'),
        message: contactForm.querySelector('#message')
    };

    // Validation rules
    const validationRules = {
        name: {
            validate: (value) => value.trim().length >= 2,
            error: 'Name must be at least 2 characters long'
        },
        email: {
            validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            error: 'Please enter a valid email address'
        },
        subject: {
            validate: (value) => value.trim().length >= 3,
            error: 'Subject must be at least 3 characters long'
        },
        message: {
            validate: (value) => value.trim().length >= 10,
            error: 'Message must be at least 10 characters long'
        }
    };

    // Create error element for field
    function createErrorElement(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-field-error';
        errorDiv.textContent = message;
        return errorDiv;
    }

    // Clear previous errors
    function clearFieldErrors(field) {
        const existingError = field.parentElement.querySelector('.form-field-error');
        if (existingError) {
            existingError.remove();
        }
        field.classList.remove('error');
    }

    // Show field error
    function showFieldError(field, message) {
        clearFieldErrors(field);
        field.classList.add('error');
        const errorElement = createErrorElement(field, message);
        field.parentElement.appendChild(errorElement);
    }

    // Validate single field
    function validateField(fieldName) {
        const field = formInputs[fieldName];
        const rule = validationRules[fieldName];
        
        if (!rule.validate(field.value)) {
            showFieldError(field, rule.error);
            return false;
        } else {
            clearFieldErrors(field);
            return true;
        }
    }

    // Real-time validation on input
    Object.entries(formInputs).forEach(([fieldName, field]) => {
        field.addEventListener('blur', () => {
            validateField(fieldName);
        });

        field.addEventListener('input', () => {
            if (field.classList.contains('error')) {
                validateField(fieldName);
            }
        });
    });

    // Validate entire form
    function validateForm() {
        let isValid = true;
        Object.keys(validationRules).forEach(fieldName => {
            if (!validateField(fieldName)) {
                isValid = false;
            }
        });
        return isValid;
    }

    // Override form submission with validation
    const originalSubmit = contactForm.onsubmit;
    contactForm.addEventListener('submit', (e) => {
        if (!validateForm()) {
            e.preventDefault();
            const firstError = contactForm.querySelector('.form-field-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
});
