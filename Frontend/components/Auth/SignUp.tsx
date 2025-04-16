"use client";
import React, { FormEvent, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { Mail, User } from "lucide-react";
import PasswordInput from "../Helper/PasswordInput";
import LoadingButton from "../Helper/LoadingButton";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { handleAuthRequest } from "../utils/apiRequest";
import { toast } from "sonner";

interface ApiResponse {
  data: {
    data: {
      user: any;
    };
    message: string;
  };
}

interface FormData {
  name: string;
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const requestData = {
      name: formData.name.trim(),
      username: formData.username.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      passwordConfirm: formData.passwordConfirm
    };
    
    const signupReq = async () => {
      return await axios.post(`${BASE_API_URL}/users/signup`, requestData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    };
    
    try {
      const result = await handleAuthRequest<ApiResponse>(signupReq, setIsLoading);
      if(result){
        console.log("Signup successful:", result.data.data.user);
        toast.success(result.data.message);
        
        // TODO:
        // Redirect to home page
        // Add user to redux store
      }
    } catch (error: any) {
      if (error.response?.data?.message === "User already exists") {
        toast.error("Email already registered. Please use a different email or login.");
      } else {
        toast.error(error.response?.data?.message || "An unexpected error occurred");
      }
    }
  };

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
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-base font-medium text-[#374151] mb-2"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
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
                      value={formData.username}
                      onChange={handleChange}
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
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <PasswordInput
                      name="password"
                      placeholder="Enter Password"
                      label="Password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <PasswordInput
                      name="passwordConfirm"
                      label="Confirm Password"
                      placeholder="Confirm Password"
                      value={formData.passwordConfirm}
                      onChange={handleChange}
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
