import { AxiosError } from "axios";
import { toast } from "sonner";

interface ApiErrorResponse {
  message: string;
  error?: string;
  errors?: string[];
  status?: string;
  statusCode?: number;
}

const extractErrorMessage = (error: any): string => {
  // If it's an HTML error response
  if (typeof error === 'string' && error.includes('<!DOCTYPE html>')) {
    const match = error.match(/Error: (.*?)<br>/);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  // If it's a regular error response
  if (error?.response?.data) {
    // Handle authentication errors (401, 403)
    if (error.response.status === 401 || error.response.status === 403) {
      return error.response.data.message || "Invalid credentials. Please try again.";
    }
    
    // Handle validation errors
    if (error.response.data.errors) {
      return error.response.data.errors.join(", ");
    }
    
    // Handle single error message
    if (error.response.data.error) {
      return error.response.data.error;
    }
    
    // Handle message field
    if (error.response.data.message) {
      return error.response.data.message;
    }
  }
  
  // Handle network errors
  if (error?.message === "Network Error") {
    return "Unable to connect to the server. Please check your internet connection.";
  }
  
  return "An unexpected error occurred. Please try again.";
};

export const handleAuthRequest = async <T>(
  requestCallback: () => Promise<T>,
  setLoading: (loading: boolean) => void
): Promise<T | null> => {
  if (setLoading) {
    setLoading(true);
  }
  try {
    const response = await requestCallback();
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    console.log("Full error response:", axiosError.response?.data);
    
    const errorMessage = extractErrorMessage(axiosError);
    toast.error(errorMessage);
    
    return null;
  } finally {
    if (setLoading) {
      setLoading(false);
    }
  }
};
