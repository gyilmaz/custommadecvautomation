export const TestData = {
  users: {
    validUser: {
      email: 'pwrighttest@playwrighttest.com',
      password: 'BNB,m#%B6=d]m+#',
      firstName: 'John',
      lastName: 'Doe',
      phone: '555-123-4567',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA',
      },
    },
    invalidUser: {
      email: 'invalid-email',
      password: '123',
      firstName: '',
      lastName: '',
      phone: '123',
      address: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
      },
    },
  },

  products: {
    laptop: {
      name: 'MacBook Pro 16"',
      price: 2499.99,
      category: 'Electronics',
      sku: 'MBP-16-2023',
      stock: 50,
      description: 'Latest MacBook Pro with M3 chip',
    },
    phone: {
      name: 'iPhone 15 Pro',
      price: 999.99,
      category: 'Electronics',
      sku: 'IP15-PRO-128',
      stock: 100,
      description: 'Latest iPhone with titanium design',
    },
    book: {
      name: 'Clean Code',
      price: 39.99,
      category: 'Books',
      sku: 'BOOK-CC-001',
      stock: 200,
      description: 'A Handbook of Agile Software Craftsmanship',
    },
  },

  creditCards: {
    valid: {
      number: '4242424242424242',
      name: 'John Doe',
      expiry: '12/25',
      cvv: '123',
    },
    invalid: {
      number: '1234567890123456',
      name: '',
      expiry: '00/00',
      cvv: '000',
    },
  },

  urls: {
    production: 'https://example.com',
    staging: 'https://staging.example.com',
    development: 'http://localhost:3000',
    api: {
      v1: 'https://api.example.com/v1',
      v2: 'https://api.example.com/v2',
    },
  },

  timeouts: {
    short: 5000,
    medium: 10000,
    long: 30000,
    extraLong: 60000,
  },

  messages: {
    success: {
      login: 'Successfully logged in',
      logout: 'Successfully logged out',
      purchase: 'Thank you for your purchase!',
      update: 'Profile updated successfully',
      delete: 'Item deleted successfully',
    },
    error: {
      invalidCredentials: 'Invalid email or password',
      requiredField: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      networkError: 'Network error. Please try again.',
      serverError: 'Internal server error',
      notFound: 'Page not found',
    },
    validation: {
      minLength: 'Minimum length is',
      maxLength: 'Maximum length is',
      pattern: 'Invalid format',
      required: 'Required field',
    },
  },

  selectors: {
    common: {
      submitButton: 'button[type="submit"]',
      cancelButton: '[data-testid="cancel-button"]',
      loader: '[data-testid="loader"]',
      errorMessage: '[data-testid="error-message"]',
      successMessage: '[data-testid="success-message"]',
      modal: '[data-testid="modal"]',
      modalClose: '[data-testid="modal-close"]',
    },
    forms: {
      emailInput: '#email',
      passwordInput: 'input[name="password"]',
      firstNameInput: '[data-testid="firstname-input"]',
      lastNameInput: '[data-testid="lastname-input"]',
      phoneInput: '[data-testid="phone-input"]',
      addressInput: '[data-testid="address-input"]',
    },
    navigation: {
      mainMenu: '[data-testid="main-menu"]',
      sidebar: '[data-testid="sidebar"]',
      breadcrumb: '[data-testid="breadcrumb"]',
      pagination: '[data-testid="pagination"]',
    },
  },

  api: {
    endpoints: {
      auth: {
        login: '/auth/login',
        logout: '/auth/logout',
        register: '/auth/register',
        resetPassword: '/auth/reset-password',
      },
      users: {
        profile: '/users/profile',
        update: '/users/update',
        delete: '/users/delete',
        list: '/users',
      },
      products: {
        list: '/products',
        detail: '/products/:id',
        create: '/products/create',
        update: '/products/update/:id',
        delete: '/products/delete/:id',
      },
    },
    headers: {
      contentType: 'application/json',
      accept: 'application/json',
      authorization: 'Bearer ',
    },
  },
};
