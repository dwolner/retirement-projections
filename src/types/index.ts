export type Inputs = {
  portfolioValue: number;
  netJobIncome: number;
  monthlyInvestment: number;
  passiveIncome: number;
  spendingNeed: number;
  initialAge: number;
  retirementAge: number;
  maxAge: number;
  inflationRate: number;
  annualGrowthRate: number;
  charitableGivingEnabled: boolean;
  collegeCostsEnabled: boolean;
  numKids: number;
  collegeCost: number;
  collegeStartAge: number;
  collegeEndAge: number;
  collegeDuration: number;
};

export type DataRow = {
  year: number;
  age: number;
  portfolioValue: number;
  netJobIncome: number;
  portfolioGrowth: number;
  passiveIncome: number;
  totalIncome: number;
  spendingNeed: number;
  charitableGiving: number;
  investmentExpenses: number;
  surplusDeficit: number;
};

export type DataRowKey = keyof DataRow;

export type SortConfig = {
  key: string | null;
  direction: "ascending" | "descending";
};
