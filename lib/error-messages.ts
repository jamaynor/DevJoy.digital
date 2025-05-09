// Map of error codes/messages to user-friendly messages
const errorMessages: Record<string, string> = {
  // Authentication errors
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-disabled": "This account has been disabled. Please contact support.",
  "auth/user-not-found": "No account found with this email address.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password is too weak. Please use a stronger password.",
  "auth/invalid-login-credentials": "Invalid login credentials. Please try again.",

  // Form validation errors
  "form/required-field": "This field is required.",
  "form/invalid-email": "Please enter a valid email address.",
  "form/password-mismatch": "Passwords do not match.",
  "form/invalid-phone": "Please enter a valid phone number.",

  // Database errors
  "db/connection-error": "Unable to connect to the database. Please try again later.",
  "db/query-error": "There was an error processing your request.",
  "db/not-found": "The requested resource was not found.",
  "db/permission-denied": "You do not have permission to access this resource.",

  // API errors
  "api/rate-limit": "Too many requests. Please try again later.",
  "api/server-error": "Server error. Please try again later.",

  // Default error
  default: "An error occurred. Please try again later.",
}

export function getErrorMessage(errorCode: string): string {
  return errorMessages[errorCode] || errorMessages["default"]
}

export function mapErrorMessage(error: Error | string): string {
  const errorMessage = typeof error === "string" ? error : error.message

  // Check if the error message contains any of our known error codes
  for (const [code, message] of Object.entries(errorMessages)) {
    if (errorMessage.includes(code)) {
      return message
    }
  }

  // If no mapping is found, return the original error message
  return errorMessage
}
