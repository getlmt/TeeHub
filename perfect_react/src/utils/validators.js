

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^(\+84|84|0)[1-9][0-9]{8,9}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password) => {
  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  return value && value.length <= maxLength;
};

export const validateNumeric = (value) => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};

export const validatePositiveNumber = (value) => {
  return validateNumeric(value) && parseFloat(value) > 0;
};

export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; 
  return validTypes.includes(file.type) && file.size <= maxSize;
};


export const validationSchemas = {
  login: {
    email: [
      { validator: validateRequired, message: 'Email is required' },
      { validator: validateEmail, message: 'Please enter a valid email' }
    ],
    password: [
      { validator: validateRequired, message: 'Password is required' },
      { validator: (value) => validateMinLength(value, 6), message: 'Password must be at least 6 characters' }
    ]
  },
  
  register: {
    name: [
      { validator: validateRequired, message: 'Name is required' },
      { validator: (value) => validateMinLength(value, 2), message: 'Name must be at least 2 characters' }
    ],
    email: [
      { validator: validateRequired, message: 'Email is required' },
      { validator: validateEmail, message: 'Please enter a valid email' }
    ],
    phone: [
      { validator: validateRequired, message: 'Phone is required' },
      { validator: validatePhone, message: 'Please enter a valid phone number' }
    ],
    password: [
      { validator: validateRequired, message: 'Password is required' },
      { validator: validatePassword, message: 'Password must be at least 8 characters with uppercase, lowercase and number' }
    ]
  },
  
  checkout: {
    fullName: [
      { validator: validateRequired, message: 'Full name is required' },
      { validator: (value) => validateMinLength(value, 2), message: 'Name must be at least 2 characters' }
    ],
    email: [
      { validator: validateRequired, message: 'Email is required' },
      { validator: validateEmail, message: 'Please enter a valid email' }
    ],
    phone: [
      { validator: validateRequired, message: 'Phone is required' },
      { validator: validatePhone, message: 'Please enter a valid phone number' }
    ],
    address: [
      { validator: validateRequired, message: 'Address is required' },
      { validator: (value) => validateMinLength(value, 10), message: 'Address must be at least 10 characters' }
    ]
  }
};


export const validateField = (value, validators) => {
  for (const { validator, message } of validators) {
    if (!validator(value)) {
      return { isValid: false, message };
    }
  }
  return { isValid: true, message: '' };
};


export const validateForm = (data, schema) => {
  const errors = {};
  let isValid = true;

  for (const [field, validators] of Object.entries(schema)) {
    const result = validateField(data[field], validators);
    if (!result.isValid) {
      errors[field] = result.message;
      isValid = false;
    }
  }

  return { isValid, errors };
};
