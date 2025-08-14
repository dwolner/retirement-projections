// Define the financial context types
export interface FinancialContextType {
  // Financial values
  startingPortfolio: number;
  setStartingPortfolio: (value: number) => void;
  netJobIncome: number;
  setNetJobIncome: (value: number) => void;
  monthlyInvestment: number;
  setMonthlyInvestment: (value: number) => void;
  passiveIncome: number;
  setPassiveIncome: (value: number) => void;
  spendingNeed: number;
  setSpendingNeed: (value: number) => void;

  // Age parameters
  initialAge: number;
  setInitialAge: (value: number) => void;
  retirementAge: number;
  setRetirementAge: (value: number) => void;
  maxAge: number;
  setMaxAge: (value: number) => void;

  // Rate parameters
  inflationRate: number;
  setInflationRate: (value: number) => void;
  annualGrowthRate: number;
  setAnnualGrowthRate: (value: number) => void;

  // Additional options
  charitableGivingEnabled: boolean;
  setCharitableGivingEnabled: (value: boolean) => void;

  // College parameters
  collegeCostsEnabled: boolean;
  setCollegeCostsEnabled: (value: boolean) => void;
  numKids: number;
  setNumKids: (value: number) => void;
  collegeCost: number;
  setCollegeCost: (value: number) => void;
  collegeStartAge: number;
  setCollegeStartAge: (value: number) => void;
  collegeEndAge: number;
  setCollegeEndAge: (value: number) => void;
  collegeDuration: number;
  setCollegeDuration: (value: number) => void;

  // Dark mode
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  
  // UI state
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
}
