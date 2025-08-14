import { useContext } from "react";
import { FinancialContext } from "./FinancialContextInstance";
import type { FinancialContextType } from "./FinancialContextTypes";

// Custom hook to use the financial context
export const useFinancial = (): FinancialContextType => {
  const context = useContext(FinancialContext);
  if (context === undefined) {
    throw new Error("useFinancial must be used within a FinancialProvider");
  }
  return context;
};
