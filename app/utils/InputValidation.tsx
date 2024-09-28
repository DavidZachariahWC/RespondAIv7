export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validatePassword = (password: string): boolean => {
    // Require at least 7 characters
    return password.length >= 7;
  };
  
  export const validateName = (name: string): boolean => {
    return name.trim().length >= 2;
  };