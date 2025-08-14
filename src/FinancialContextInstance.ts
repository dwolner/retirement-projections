import { createContext } from "react";
import type { FinancialContextType } from "./FinancialContextTypes";

// Create the context
export const FinancialContext = createContext<FinancialContextType | undefined>(undefined);
