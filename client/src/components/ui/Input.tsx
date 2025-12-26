import React, { useState } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<Props> = ({ style, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  // Define base styles
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.9rem 1rem",
    fontSize: "1rem",
    borderRadius: "12px",
    border: "1px solid #dcdcdc",
    background: "#fafafa",
    outline: "none",
    transition: "border-color 0.2s ease, background 0.2s ease",
    // Note: Placeholder color must be handled via a different method (or CSS)
  };

  // Define focus styles (applied conditionally)
  const focusStyle: React.CSSProperties = {
    borderColor: "#1a1a1a",
    background: "#fff",
  };

  // Combine styles
  const combinedStyles: React.CSSProperties = {
    ...inputStyle,
    ...(isFocused ? focusStyle : {}), // Apply focus styles if focused
    ...style, // Merge user's inline styles
  };

  // Define focus handlers
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e); // Call original onFocus handler if it exists
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (props.onBlur) props.onBlur(e); // Call original onBlur handler if it exists
  };

  return (
    <input
      {...props}
      style={combinedStyles}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};

export default Input;
