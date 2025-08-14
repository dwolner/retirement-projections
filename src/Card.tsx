import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  darkMode?: boolean;
  borderClassName?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  darkMode = false,
  borderClassName = "",
}) => {
  return (
    <div
      className={
        `rounded-xl shadow-lg p-6 ${borderClassName} ` +
        (darkMode ? "bg-slate-800" : "bg-white") +
        (className ? ` ${className}` : "")
      }
    >
      {children}
    </div>
  );
};
