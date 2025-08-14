/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "./Card";
import { Sidebar } from "./Sidebar";
import { FinancialProvider } from "./FinancialContext";

// Helper function to format numbers as currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Main App component
export default function App() {
  // Dark mode state with localStorage persistence
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("darkMode");
      if (stored !== null) return stored === "true";
      // Default: match system preference
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  
  // Sidebar collapsed state with localStorage persistence
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sidebarCollapsed");
      if (stored !== null) return stored === "true";
    }
    return false;
  });

  // Set html class and persist to localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);
  
  // Persist sidebar collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Load initial values from localStorage or use defaults
  const getInitialValue = <T,>(key: string, defaultValue: T): T => {
    const stored = localStorage.getItem(key);
    if (stored !== null) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  };

  const setLocalStorageValue = <T,>(key: string, value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const [startingPortfolio, setStartingPortfolio] = useState(() =>
    getInitialValue("startingPortfolio", 0)
  );
  const [netJobIncome, setNetJobIncome] = useState(() =>
    getInitialValue("netJobIncome", 0)
  );
  const [monthlyInvestment, setMonthlyInvestment] = useState(() =>
    getInitialValue("monthlyInvestment", 0)
  );
  const [passiveIncome, setPassiveIncome] = useState(() =>
    getInitialValue("passiveIncome", 0)
  );
  const [spendingNeed, setSpendingNeed] = useState(() =>
    getInitialValue("spendingNeed", 0)
  );
  const [initialAge, setInitialAge] = useState(() =>
    getInitialValue("initialAge", 18)
  );
  const [retirementAge, setRetirementAge] = useState(() =>
    getInitialValue("retirementAge", 67)
  );
  const [maxAge, setMaxAge] = useState(() => getInitialValue("maxAge", 92));
  const [inflationRate, setInflationRate] = useState(() =>
    getInitialValue("inflationRate", 0.03)
  );
  const [annualGrowthRate, setAnnualGrowthRate] = useState(() =>
    getInitialValue("annualGrowthRate", 0.05)
  );
  const [charitableGivingEnabled, setCharitableGivingEnabled] = useState(() =>
    getInitialValue("charitableGivingEnabled", true)
  );

  // College cost controls
  const [collegeCostsEnabled, setCollegeCostsEnabled] = useState(() =>
    getInitialValue("collegeCostsEnabled", false)
  );
  const [numKids, setNumKids] = useState(() => getInitialValue("numKids", 2));
  const [collegeCost, setCollegeCost] = useState(() =>
    getInitialValue("collegeCost", 50000)
  );
  const [collegeStartAge, setCollegeStartAge] = useState(() =>
    getInitialValue("collegeStartAge", 0)
  );
  const [collegeEndAge, setCollegeEndAge] = useState(() =>
    getInitialValue("collegeEndAge", 0)
  );
  const [collegeDuration, setCollegeDuration] = useState(() =>
    getInitialValue("collegeDuration", 4)
  );

  type DataRow = {
    year: number;
    age: number;
    startingPortfolio: number;
    netJobIncome: number;
    portfolioGrowth: number;
    passiveIncome: number;
    totalIncome: number;
    spendingNeed: number;
    charitableGiving: number;
    investmentExpenses: number;
    surplusDeficit: number;
  };
  const [data, setData] = useState<DataRow[]>([]);

  const lifetimeSurplus = data.reduce(
    (acc, curr) => acc + curr.surplusDeficit,
    0
  );
  const lifetimeCharitableGiving = data.reduce(
    (acc, curr) => acc + curr.charitableGiving,
    0
  );
  const finalPortfolio = !data.length
    ? 0
    : data[data.length - 1].startingPortfolio +
      data[data.length - 1].surplusDeficit;

  type SortConfig = {
    key: string | null;
    direction: "ascending" | "descending";
  };
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ascending",
  });

  useEffect(() => {
    // Persist values to localStorage on change
    setLocalStorageValue("startingPortfolio", startingPortfolio);
    setLocalStorageValue("netJobIncome", netJobIncome);
    setLocalStorageValue("monthlyInvestment", monthlyInvestment);
    setLocalStorageValue("passiveIncome", passiveIncome);
    setLocalStorageValue("spendingNeed", spendingNeed);
    setLocalStorageValue("initialAge", initialAge);
    setLocalStorageValue("retirementAge", retirementAge);
    setLocalStorageValue("maxAge", maxAge);
    setLocalStorageValue("inflationRate", inflationRate);
    setLocalStorageValue("annualGrowthRate", annualGrowthRate);
    setLocalStorageValue("charitableGivingEnabled", charitableGivingEnabled);
    setLocalStorageValue("collegeCostsEnabled", collegeCostsEnabled);
    setLocalStorageValue("collegeCost", collegeCost);
    setLocalStorageValue("collegeStartAge", collegeStartAge);
    setLocalStorageValue("collegeEndAge", collegeEndAge);
    setLocalStorageValue("collegeDuration", collegeDuration);

    setData(
      Array.from({ length: maxAge - initialAge }, (_, i) => {
        const age = initialAge + i;
        const currentYear = new Date().getFullYear();
        const year = currentYear + i;
        return { year, age, ...calculateSurplusDeficit(age) };
      })
    );
  }, [
    startingPortfolio,
    netJobIncome,
    monthlyInvestment,
    passiveIncome,
    spendingNeed,
    initialAge,
    retirementAge,
    maxAge,
    inflationRate,
    annualGrowthRate,
    charitableGivingEnabled,
    collegeCostsEnabled,
    collegeCost,
    collegeStartAge,
    collegeEndAge,
    collegeDuration,
  ]);

  // Define a function to calculate the charitable giving for each year based on the new plan
  const calculateCharitableGiving = (age: number) => {
    if (!charitableGivingEnabled) return 0;
    if (age < initialAge) return 0;
    const netJobIncome = calculateNetJobIncome(age);
    const passiveIncome = calculatePassiveIncome(age);
    const totalIncome = netJobIncome + passiveIncome;
    const percentage = age < retirementAge ? 0.1 : 0.2;
    return totalIncome * percentage;
  };

  // Define a function to calculate the net job income with a 3% annual increase
  const calculateNetJobIncome = (age: number) => {
    // Starting net job income at age 35
    const initialIncome = netJobIncome;
    // 3% annual increase
    const growthRate = 1 + inflationRate;
    if (age < initialAge) return 0;
    // Assume retirement at age 54, so no job income from this age onwards
    if (age >= retirementAge) return 0;
    const yearsOfGrowth = age - initialAge;
    return initialIncome * Math.pow(growthRate, yearsOfGrowth);
  };

  const calculatePassiveIncome = (age: number) => {
    // Passive income increases by 3% annually
    const growthRate = 1 + inflationRate;
    if (age < initialAge) return passiveIncome;
    const yearsOfGrowth = age - initialAge;
    return passiveIncome * Math.pow(growthRate, yearsOfGrowth);
  };

  const calculateSpendingNeed = (age: number) => {
    // Spending need starts at $150,000 at age 35 and increases by 3% annually
    const growthRate = 1 + inflationRate;
    if (age < initialAge) return spendingNeed;
    const yearsOfGrowth = age - initialAge;
    let newSpendingNeed = spendingNeed * Math.pow(growthRate, yearsOfGrowth);
    //adjust spending need after retirement
    if (age >= retirementAge) {
      newSpendingNeed *= 0.8; // Reduce spending need by 20% after retirement
    }

    if (collegeCostsEnabled) {
      // Calculate the total number of college-years for all kids
      const start = Math.min(collegeStartAge, collegeEndAge);
      const end = Math.max(collegeStartAge, collegeEndAge);
      const collegeYearsSet = new Set<number>();
      for (let kid = 0; kid < numKids; kid++) {
        const kidStart = collegeStartAge + kid;
        for (let yr = 0; yr < collegeDuration; yr++) {
          const year = kidStart + yr;
          if (year >= start && year < end) {
            collegeYearsSet.add(year);
          }
        }
      }
      const yearsWithCollege = Array.from(collegeYearsSet);
      const evenCollegeCost =
        (numKids * collegeCost * collegeDuration) / yearsWithCollege.length;
      if (yearsWithCollege.includes(age)) {
        newSpendingNeed += evenCollegeCost;
      }
    }
    return newSpendingNeed;
  };

  const calculateMonthlyInvestment = (age: number) => {
    const initialInvestment = monthlyInvestment;
    const growthRate = 1 + inflationRate;
    if (age < initialAge) return initialInvestment;
    if (age >= retirementAge) {
      // const rentalIncome = calculateRentalIncome(age);
      // const spendingNeed = calculateSpendingNeed(age);
      // const charitableGiving = calculateCharitableGiving(age);
      // return (rentalIncome - spendingNeed - charitableGiving) / 12;
      return 0;
    }
    const yearsOfGrowth = age - initialAge;
    return initialInvestment * Math.pow(growthRate, yearsOfGrowth);
  };

  const calculatePortfolioGrowth = (age: number) => {
    const initialPortfolio = startingPortfolio;
    const years = age - initialAge;

    let portfolioValue = initialPortfolio;
    for (let i = 0; i < years; i++) {
      if (initialAge + i < retirementAge) {
        portfolioValue += calculateMonthlyInvestment(initialAge + i) * 12;
      } else {
        // const annualDistribution = calculateSpendingNeed(initialAge + i);
        // portfolioValue -= annualDistribution;
      }
      portfolioValue *= 1 + annualGrowthRate;
    }
    return portfolioValue;
  };

  const cummulativeSurplusDeficit = (age: number) => {
    let total = 0;
    for (let i = initialAge; i <= age; i++) {
      total += calculateSurplusDeficit(i).surplusDeficit;
    }
    return (
      <span
        className={
          total < 0
            ? `dark:text-rose-400 text-rose-600`
            : `dark:text-green-400 text-green-600`
        }
      >
        {formatCurrency(total)}
      </span>
    );
  };

  const calculateSurplusDeficit = (age: number) => {
    // Calculate total income and expenses
    const netJobIncome = calculateNetJobIncome(age);
    const passiveIncome = calculatePassiveIncome(age);
    const charitableGiving = calculateCharitableGiving(age);
    const spendingNeed = calculateSpendingNeed(age);
    const startingPortfolio = calculatePortfolioGrowth(age);
    const portfolioGrowth = startingPortfolio * annualGrowthRate;

    // Total income
    const totalIncome = netJobIncome + passiveIncome;
    const investmentExpenses = calculateMonthlyInvestment(age) * 12;
    // Total expenses
    const totalExpenses = spendingNeed + charitableGiving + investmentExpenses;

    // Surplus or deficit
    const surplusDeficit = totalIncome - totalExpenses;
    return {
      startingPortfolio,
      netJobIncome,
      portfolioGrowth,
      passiveIncome,
      totalIncome,
      investmentExpenses,
      spendingNeed,
      charitableGiving,
      surplusDeficit,
    };
  };

  // export tableData to csv
  const exportToCSV = () => {
    const csvRows = [];
    type DataRowKey = keyof DataRow;
    const headers: DataRowKey[] = [
      "year",
      "age",
      "startingPortfolio",
      "portfolioGrowth",
      "netJobIncome",
      "passiveIncome",
      "totalIncome",
      "charitableGiving",
      "spendingNeed",
      "investmentExpenses",
      "surplusDeficit",
    ];
    csvRows.push(headers.join(","));
    for (const row of data) {
      csvRows.push(
        headers.map((field) => JSON.stringify(row[field])).join(",")
      );
    }
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "retirement_projection.csv");
    a.click();
  };

  // Helper function to handle sorting
  const sortData = (key: keyof DataRow) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    setData(sortedData);
  };

  // Function to render sort icons
  const getSortIcon = (key: string | null) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "ascending" ? (
      <ArrowUp size={16} />
    ) : (
      <ArrowDown size={16} />
    );
  };

  // Dashboard component
  const Dashboard = () => {
    // Create the financial context value object
    const financialContextValue = {
      startingPortfolio,
      setStartingPortfolio,
      netJobIncome,
      setNetJobIncome,
      monthlyInvestment,
      setMonthlyInvestment,
      passiveIncome,
      setPassiveIncome,
      spendingNeed,
      setSpendingNeed,
      initialAge,
      setInitialAge,
      retirementAge,
      setRetirementAge,
      maxAge,
      setMaxAge,
      inflationRate,
      setInflationRate,
      annualGrowthRate,
      setAnnualGrowthRate,
      charitableGivingEnabled,
      setCharitableGivingEnabled,
      collegeCostsEnabled,
      setCollegeCostsEnabled,
      numKids,
      setNumKids,
      collegeCost,
      setCollegeCost,
      collegeStartAge,
      setCollegeStartAge,
      collegeEndAge,
      setCollegeEndAge,
      collegeDuration,
      setCollegeDuration,
      darkMode,
      setDarkMode,
      sidebarCollapsed,
      setSidebarCollapsed,
    };

    return (
      <div className="min-h-screen font-sans bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
        {/* Wrap the entire dashboard with FinancialProvider */}
        <FinancialProvider value={financialContextValue}>
          {/* Sidebar for inputs - no props needed */}
          <Sidebar />

          {/* Main content area with padding to account for sidebar */}
          <div className={`p-4 sm:p-8 transition-all duration-300 ${sidebarCollapsed ? 'ml-12' : 'ml-0 md:ml-80'}`}>
            <div className="mb-8 space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 dark:text-slate-100">
                Retirement Projection Dashboard
              </h1>
              <p className="text-center text-slate-600 dark:text-slate-300">
                A visual breakdown of your financial plan from age {initialAge}{" "}
                to {maxAge}.
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                A couple of assumptions are made in this model:
                <ul>
                  <li>All values are adjusted for inflation.</li>
                  <li>Investment returns are compounded annually.</li>
                  <li>Taxes and fees are not considered.</li>
                  <li>Reduced expenses by 20% after retirement.</li>
                  <li>No more portfolio contributions after retirement age.</li>
                  <li>
                    Charitable giving is 10% of income until retirement, then
                    20% of income.
                  </li>
                  <li>
                    College costs are evenly distributed across the college
                    years for all kids.
                  </li>
                </ul>
              </div>
            </div>

            {/* Summary Cards */}
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12`}
            >
              <Card borderClassName="border-l-4 border-indigo-500">
                <h3
                  className={`text-lg font-semibold mb-2 dark:text-slate-200 text-slate-600`}
                >
                  Lifetime Surplus (31 years)
                </h3>
                <p
                  className={`text-3xl font-bold dark:text-green-400 text-green-600`}
                >
                  {formatCurrency(lifetimeSurplus)}
                </p>
              </Card>
              <Card borderClassName="border-l-4 border-teal-500">
                <h3
                  className={`text-lg font-semibold mb-2 dark:text-slate-200 text-slate-600`}
                >
                  Average Annual Surplus
                </h3>
                <p
                  className={`text-3xl font-bold dark:text-green-400 text-green-600`}
                >
                  {formatCurrency(lifetimeSurplus / (maxAge - initialAge))}
                </p>
              </Card>
              <Card borderClassName="border-l-4 border-purple-500">
                <h3
                  className={`text-lg font-semibold mb-2 dark:text-slate-200 text-slate-600`}
                >
                  Final Portfolio (Age {maxAge})
                </h3>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                  {formatCurrency(finalPortfolio)}
                </p>
              </Card>
              <Card borderClassName="border-l-4 border-rose-500">
                <h3
                  className={`text-lg font-semibold mb-2 dark:text-slate-200 text-slate-600`}
                >
                  Lifetime Charitable Giving
                </h3>
                <p className="text-3xl font-bold dark:text-rose-400 text-rose-600">
                  {formatCurrency(lifetimeCharitableGiving)}
                </p>
              </Card>
            </div>

            {/* Charts Section */}
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12`}>
              {/* Portfolio Growth Chart */}
              <Card>
                <h3 className="text-lg font-semibold text-center mb-4">
                  Portfolio Growth
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis
                      tickFormatter={(value) =>
                        `$${(value / 1000000).toFixed(1)}M`
                      }
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                      contentStyle={
                        darkMode
                          ? {
                              backgroundColor: "#1e293b", // slate-800
                              border: "1px solid #334155", // slate-700
                              color: "#f1f5f9", // slate-100
                            }
                          : undefined
                      }
                      labelStyle={darkMode ? { color: "#f1f5f9" } : undefined}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="startingPortfolio"
                      stroke="#8884d8"
                      name="Starting Portfolio"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Surplus/Deficit Chart */}
              <Card>
                <h3 className="text-lg font-semibold text-center mb-4">
                  Annual Surplus / Deficit
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis
                      tickFormatter={(value) =>
                        `$${(value / 1000).toFixed(0)}K`
                      }
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                      contentStyle={
                        darkMode
                          ? {
                              backgroundColor: "#1e293b", // slate-800
                              border: "1px solid #334155", // slate-700
                              color: "#f1f5f9", // slate-100
                            }
                          : undefined
                      }
                      labelStyle={darkMode ? { color: "#f1f5f9" } : undefined}
                    />
                    <Legend />
                    <Bar
                      dataKey="surplusDeficit"
                      fill="#10b981"
                      name="Surplus/Deficit"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Data Table Section */}
            <Card>
              <button
                onClick={exportToCSV}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Download CSV
              </button>
              <h3 className="text-lg font-semibold text-center mb-4">
                Detailed Financial Table
              </h3>
              <div className="overflow-x-auto">
                {/* Data-driven table columns/rows */}
                {(() => {
                  type Column = {
                    label: string;
                    key: keyof DataRow;
                    className: (row: DataRow, index: number) => string;
                    headerClass: string;
                    sortable: boolean;
                    render?: (row: DataRow, index: number) => React.ReactNode;
                  };

                  // Helper for standard currency columns
                  const standardCurrencyColumn = (
                    label: string,
                    key: keyof DataRow,
                    colorClass?: string
                  ): Column => ({
                    label,
                    key,
                    className: () =>
                      `px-6 py-4 whitespace-nowrap text-sm ${
                        colorClass
                          ? colorClass.replace("text-", "dark:text-")
                          : "dark:text-slate-100 text-slate-900"
                      }`,
                    headerClass:
                      "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100",
                    sortable: true,
                    render: (row) => formatCurrency(row[key]),
                  });

                  const columns: Column[] = [
                    {
                      label: "Year",
                      key: "year",
                      className: () =>
                        `px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-slate-100 text-gray-900`,
                      headerClass:
                        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100",
                      sortable: true,
                      render: (row) => row.year,
                    },
                    {
                      label: "Age",
                      key: "age",
                      className: () =>
                        `px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-slate-100 text-gray-900`,
                      headerClass:
                        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                      sortable: false,
                    },
                    {
                      label: "Starting Portfolio",
                      key: "startingPortfolio",
                      className: () =>
                        `px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-300 text-gray-500`,
                      headerClass:
                        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100",
                      sortable: true,
                      render: (row, index) => {
                        const portfolioDiff =
                          row.startingPortfolio -
                          (data[index - 1]?.startingPortfolio ?? 0);
                        return (
                          <>
                            {formatCurrency(row.startingPortfolio)}{" "}
                            {portfolioDiff ? (
                              <span
                                className={
                                  "dark:text-green-400 text-green-600 font-semibold"
                                }
                              >
                                ({formatCurrency(portfolioDiff)})
                              </span>
                            ) : null}
                          </>
                        );
                      },
                    },
                    standardCurrencyColumn(
                      "Portfolio Growth",
                      "portfolioGrowth"
                    ),
                    standardCurrencyColumn("Net Job Income", "netJobIncome"),
                    standardCurrencyColumn("Passive Income", "passiveIncome"),
                    standardCurrencyColumn("Total Income", "totalIncome"),
                    standardCurrencyColumn(
                      "Charitable Giving",
                      "charitableGiving",
                      "dark:text-rose-400 text-rose-600 font-semibold"
                    ),
                    standardCurrencyColumn("Spending Need", "spendingNeed"),
                    standardCurrencyColumn(
                      "Investment Expenses",
                      "investmentExpenses"
                    ),
                    {
                      label: "Surplus/Deficit",
                      key: "surplusDeficit",
                      className: (row) =>
                        `px-6 py-4 whitespace-nowrap text-sm font-semibold ` +
                        (row.surplusDeficit < 0
                          ? "dark:text-rose-400 text-rose-600"
                          : "dark:text-green-400 text-green-600"),
                      headerClass:
                        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100",
                      sortable: true,
                      render: (row) => (
                        <>
                          {formatCurrency(row.surplusDeficit)} (
                          {cummulativeSurplusDeficit(row.age)})
                        </>
                      ),
                    },
                  ];
                  return (
                    <table
                      className={`min-w-full divide-y dark:divide-gray-700 divide-gray-200`}
                    >
                      <thead className="dark:bg-slate-900 bg-gray-50">
                        <tr className={"dark:text-slate-100 text-slate-900"}>
                          {columns.map((col) => (
                            <th
                              key={col.key}
                              scope="col"
                              className={col.headerClass}
                              onClick={
                                col.sortable
                                  ? () => sortData(col.key)
                                  : undefined
                              }
                              style={{
                                cursor: col.sortable ? "pointer" : undefined,
                              }}
                            >
                              <div className="flex items-center">
                                {col.label}{" "}
                                {col.sortable && getSortIcon(col.key)}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="dark:bg-slate-900 bg-white divide-gray-200">
                        {data.map((row, index) => (
                          <tr
                            key={row.age}
                            className={
                              index % 2 === 0
                                ? "dark:bg-slate-900 bg-white"
                                : "dark:bg-slate-800 bg-gray-50"
                            }
                          >
                            {columns.map((col) => (
                              <td
                                key={col.key}
                                className={col.className(row, index)}
                              >
                                {col.render
                                  ? col.render(row, index)
                                  : row[col.key]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                })()}
              </div>
            </Card>
          </div>
        </FinancialProvider>
      </div>
    );
  };

  return <Dashboard />;
}
