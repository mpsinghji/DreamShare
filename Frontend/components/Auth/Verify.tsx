"use client";
import React, { useRef, useEffect, useState } from "react";
import { MailCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import LoadingButton from "../Helper/LoadingButton";

const Verify = () => {
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters

    // Move to next input if value entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-sm">
        {/* Back Button */}
        <Link href={"/auth/login"}>
          <button className="flex items-center text-gray-600 hover:text-gray-800 mb-6">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
        </Link>

        {/* Verification Icon */}
        <div className="text-center mb-8">
          <MailCheck className="w-20 h-20 text-blue-600 mx-auto" />
        </div>

        {/* Title and Description */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            OTP Verification
          </h1>
          <p className="text-gray-600">
            We have sent a verification code to your email
          </p>
        </div>

        {/* OTP Input Form */}
        <form className="space-y-6">
          <div className="flex justify-center space-x-2">
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          {/* Submit Button */}
          {}
          <LoadingButton
            isLoading={isLoading}
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Verify OTP
          </LoadingButton>

          {/* Resend OTP Link */}
          <div className="text-center">
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Resend OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Verify;
