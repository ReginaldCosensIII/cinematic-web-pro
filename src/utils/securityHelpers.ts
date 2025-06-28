
// Security utility functions for input validation and sanitization

export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeUserInput = (input: string, maxLength: number = 1000): string => {
  return sanitizeHtml(input).substring(0, maxLength);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Rate limiting helper (client-side basic implementation)
export class ClientRateLimit {
  private attempts: Map<string, number[]> = new Map();
  
  constructor(private maxAttempts: number = 5, private windowMs: number = 15 * 60 * 1000) {}
  
  canAttempt(key: string): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || [];
    
    // Remove attempts outside the time window
    const validAttempts = userAttempts.filter(attempt => now - attempt < this.windowMs);
    
    this.attempts.set(key, validAttempts);
    
    return validAttempts.length < this.maxAttempts;
  }
  
  recordAttempt(key: string): void {
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || [];
    userAttempts.push(now);
    this.attempts.set(key, userAttempts);
  }
  
  getRemainingAttempts(key: string): number {
    const userAttempts = this.attempts.get(key) || [];
    const now = Date.now();
    const validAttempts = userAttempts.filter(attempt => now - attempt < this.windowMs);
    return Math.max(0, this.maxAttempts - validAttempts.length);
  }
}

export const contactFormRateLimit = new ClientRateLimit(3, 10 * 60 * 1000); // 3 attempts per 10 minutes
