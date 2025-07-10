import React from "react";
import type {InputHTMLAttributes} from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
}   
const Input: React.FC<InputProps> = ({className, ...props}) => {
    return (
        <input
            className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            {...props}
        />
    );
};

export default Input;
// This Input component is a styled input field that accepts all standard HTML input attributes.