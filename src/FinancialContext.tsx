import type { ReactNode } from "react";
import type { FinancialContextType } from "./FinancialContextTypes";
import { FinancialContext } from "./FinancialContextInstance";

// Define the provider props interface
interface FinancialProviderProps {
  children: ReactNode;
  value: FinancialContextType;
}

// Create the provider component
export const FinancialProvider: React.FC<FinancialProviderProps> = ({ children, value }) => {
  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
};
