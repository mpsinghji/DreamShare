"use client";

import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { Mail, Lock } from "lucide-react";
import LoadingButton from "../Helper/LoadingButton";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Head>
        <title>Log in | SocialSync</title>
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
              Welcome back!
            </h1>
            <p className="text-[32px] text-[#374151]">Log in to your account</p>
          </div>
        </div>

        {/* Right side with login form */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-8">
          <div className="max-w-md w-full">
            <div className="text-center mb-10">
              <div className="md:hidden mb-6">
                <Image
                  src={"/images/Site_Logo.png"}
                  alt="SocialSync Logo"
                  width={300}
                  height={300}
                />
              </div>
              <h2 className="text-[32px] font-bold text-[#1f2937]">Log in</h2>
            </div>

            <form className="space-y-6">
              <div className="space-y-5">
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
                  <label
                    htmlFor="password"
                    className="block text-base font-medium text-[#374151] mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Password"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="remember"
                      className="ml-2 text-sm text-[#374151]"
                    >
                      Remember me
                    </label>
                  </div>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <LoadingButton
                isLoading={isLoading}
                className="w-full bg-[#3b82f6] text-white py-3 px-4 rounded-md text-base font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                type="submit"
              >
                Log in
              </LoadingButton>

              <div className="text-center">
                <p className="text-base text-[#374151]">
                  Don't have an account?{" "}
                  <a
                    href="/auth/signup"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Sign up
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

export default Login;
