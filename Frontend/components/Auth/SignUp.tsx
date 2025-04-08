"use client";
import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { Mail, User } from "lucide-react";
import PasswordInput from "../Helper/PasswordInput";
import LoadingButton from "../Helper/LoadingButton";

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <Head>
        <title>Sign Up | SocialSync</title>
      </Head>
      <div className="min-h-screen flex">
        {/* Left side with branding */}
        <div className="w-1/2 hidden md:flex items-center justify-center bg-gray-50">
          <div className="text-center space-y-6">
            <Image
              src={"/images/Site_Logo.png"}
              alt="SocialSync Logo"
              width={300}
              height={300}
            />
            <h1 className="text-[48px] font-bold text-[#1f2937] mt-6">
              Welcome!
            </h1>
            <p className="text-[32px] text-[#374151]">Create your account</p>
          </div>
        </div>
        {/* Right side with signup form */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-8">
          <div className="max-w-md w-full">
            <div className="text-center mb-10">
              <div className="md:hidden mb-6">
                <Image
                  src={"/images/Site_Logo.png"}
                  alt="SocialSync Logo"
                  width={100}
                  height={100}
                />
              </div>
              <h2 className="text-[32px] font-bold text-[#1f2937]">Sign up</h2>
            </div>
            <form className="space-y-6">
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-base font-medium text-[#374151] mb-2"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Choose a username"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-base font-medium text-[#374151] mb-2"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Email address"
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <PasswordInput
                      name="password"
                      placeholder="Enter Password"
                      label="Password"
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <PasswordInput
                      name="confirmPassword"
                      label="Confirm Password"
                      placeholder="Confirm Password"
                    />
                  </div>
                </div>
              </div>
              <LoadingButton
                isLoading={isLoading}
                className="w-full mt-3"
                size="lg"
                type="submit"
              >
                Sign Up
              </LoadingButton>
              <div className="text-center">
                <p className="text-base text-[#374151]">
                  Already have an account?{" "}
                  <a
                    href="/auth/login"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Log in
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default SignUp;
