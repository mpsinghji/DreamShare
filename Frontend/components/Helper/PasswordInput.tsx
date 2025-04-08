"use client";

import React, { ChangeEvent, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  inputClassName?: string;
  labelClassName?: string;
  iconClassName?: string;
}

const PasswordInput = ({
  name,
  label,
  placeholder,
  value,
  onChange,
  inputClassName = "",
  labelClassName = "",
  iconClassName = "h-5 w-5 text-gray-400 hover:text-gray-500",
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {label && (
        <label
          className={`block text-base font-medium text-[#374151] mb-2 ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className={iconClassName} />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full pl-10 px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${inputClassName}`}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={toggleVisibility}
        >
          {showPassword ? (
            <EyeOff className={iconClassName} />
          ) : (
            <Eye className={iconClassName} />
          )}
        </button>
      </div>
    </>
  );
};

export default PasswordInput;
