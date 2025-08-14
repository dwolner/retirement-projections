import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  borderClassName?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  borderClassName = "",
}) => {
  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 ${borderClassName} ${className}`}
    >
      {children}
    </div>
  );
};
