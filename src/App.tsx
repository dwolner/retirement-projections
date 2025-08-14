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
import { DebouncedInput } from "./DebouncedInput";

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

  // Set html class and persist to localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);
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
  const [rentalIncome, setRentalIncome] = useState(() =>
    getInitialValue("rentalIncome", 0)
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
    age: number;
    startingPortfolio: number;
    netJobIncome: number;
    portfolioGrowth: number;
    rentalIncome: number;
    totalIncome: number;
    spendingNeed: number;
    charitableGiving: number;
    investmentExpenses: number;
    surplusDeficit: number;
  };
  const [data, setData] = useState<DataRow[]>([]);

  const totalSurplus = data.reduce((acc, curr) => acc + curr.surplusDeficit, 0);
  const totalCharitableGiving = data.reduce(
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
    setLocalStorageValue("rentalIncome", rentalIncome);
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
        return { age, ...calculateSurplusDeficit(age) };
      })
    );
  }, [
    startingPortfolio,
    netJobIncome,
    monthlyInvestment,
    rentalIncome,
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
    const rentalIncome = calculateRentalIncome(age);
    const totalIncome = netJobIncome + rentalIncome;
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

  const calculateRentalIncome = (age: number) => {
    // Rental income increases by 3% annually
    const growthRate = 1 + inflationRate;
    if (age < initialAge) return rentalIncome;
    const yearsOfGrowth = age - initialAge;
    return rentalIncome * Math.pow(growthRate, yearsOfGrowth);
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
            ? `${darkMode ? "text-rose-400" : "text-rose-600"}`
            : `${darkMode ? "text-green-400" : "text-green-600"}`
        }
      >
        {formatCurrency(total)}
      </span>
    );
  };

  const calculateSurplusDeficit = (age: number) => {
    // Calculate total income and expenses
    const netJobIncome = calculateNetJobIncome(age);
    const rentalIncome = calculateRentalIncome(age);
    const charitableGiving = calculateCharitableGiving(age);
    const spendingNeed = calculateSpendingNeed(age);
    const startingPortfolio = calculatePortfolioGrowth(age);
    const portfolioGrowth = startingPortfolio * annualGrowthRate;

    // Total income
    const totalIncome = netJobIncome + rentalIncome;
    const investmentExpenses = calculateMonthlyInvestment(age) * 12;
    // Total expenses
    const totalExpenses = spendingNeed + charitableGiving + investmentExpenses;

    // Surplus or deficit
    const surplusDeficit = totalIncome - totalExpenses;
    return {
      startingPortfolio,
      netJobIncome,
      portfolioGrowth,
      rentalIncome,
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
      "age",
      "startingPortfolio",
      "portfolioGrowth",
      "netJobIncome",
      "rentalIncome",
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
    return (
      <div
        className={
          `p-4 sm:p-8 min-h-screen font-sans ` +
          (darkMode
            ? "bg-slate-900 text-slate-100"
            : "bg-slate-50 text-slate-800")
        }
      >
        <div className="flex justify-end mb-4">
          <button
            className={
              `px-3 py-1 rounded border transition ` +
              (darkMode
                ? "bg-slate-700 text-slate-100 border-slate-600 hover:bg-slate-800"
                : "bg-slate-200 text-slate-800 border-slate-300 hover:bg-slate-300")
            }
            onClick={() => setDarkMode((d) => !d)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
        <div className={darkMode ? "mb-8 space-y-2" : "mb-8 space-y-2"}>
          <h1
            className={
              `text-3xl sm:text-4xl font-bold text-center ` +
              (darkMode ? "text-slate-100" : "text-slate-900")
            }
          >
            Retirement Projection Dashboard
          </h1>
          <p
            className={
              darkMode
                ? "text-center text-slate-300"
                : "text-center text-slate-600"
            }
          >
            A visual breakdown of your financial plan from age {initialAge} to{" "}
            {maxAge}.
          </p>
          <div
            className={
              darkMode
                ? "text-xs text-gray-400 text-center"
                : "text-xs text-gray-500 text-center"
            }
          >
            A couple of assumptions are made in this model:
            <ul>
              <li>All values are adjusted for inflation.</li>
              <li>Investment returns are compounded annually.</li>
              <li>Taxes and fees are not considered.</li>
              <li>Reduced expenses by 20% after retirement.</li>
              <li>No more portfolio contributions after retirement age.</li>
              <li>
                Charitable giving is 10% of income until retirement, then 20% of
                income.
              </li>
              <li>
                College costs are evenly distributed across the college years
                for all kids.
              </li>
            </ul>
          </div>
        </div>

        <div
          className={
            darkMode
              ? "flex flex-col mb-8 space-y-4 justify-center items-center"
              : "flex flex-col mb-8 space-y-4 justify-center items-center"
          }
        >
          <h6>Starting Values</h6>
          <div
            className={
              darkMode
                ? "flex flex-wrap gap-4 items-center"
                : "flex flex-wrap gap-4 items-center"
            }
          >
            <DebouncedInput
              label="Portfolio Value ($)"
              value={startingPortfolio}
              onChange={setStartingPortfolio}
              min={0}
              step={1000}
              darkMode={darkMode}
            />
            <DebouncedInput
              label="Annual Net Job Income ($)"
              value={netJobIncome}
              onChange={setNetJobIncome}
              min={0}
              step={1000}
              darkMode={darkMode}
            />
            <DebouncedInput
              label="Portfolio Investment / Mo ($)"
              value={monthlyInvestment}
              onChange={setMonthlyInvestment}
              min={0}
              step={100}
              darkMode={darkMode}
            />
            <DebouncedInput
              label="Passive Income ($)"
              value={rentalIncome}
              onChange={setRentalIncome}
              min={0}
              step={1000}
              darkMode={darkMode}
            />
            <DebouncedInput
              label="Annual Expenses ($)"
              value={spendingNeed}
              onChange={setSpendingNeed}
              min={0}
              step={1000}
              darkMode={darkMode}
            />
          </div>
          <div
            className={
              darkMode
                ? "flex flex-wrap gap-4 items-center"
                : "flex flex-wrap gap-4 items-center"
            }
          >
            <DebouncedInput
              label="Current Age"
              value={initialAge}
              onChange={setInitialAge}
              min={0}
              step={1}
              darkMode={darkMode}
            />
            <DebouncedInput
              label="Target Retirement Age"
              value={retirementAge}
              onChange={setRetirementAge}
              min={0}
              step={1}
              darkMode={darkMode}
            />
            <DebouncedInput
              label="Max Age"
              value={maxAge}
              onChange={setMaxAge}
              min={0}
              step={1}
              darkMode={darkMode}
            />
            <DebouncedInput
              label="Inflation Rate (%)"
              value={inflationRate}
              onChange={setInflationRate}
              min={0}
              step={0.01}
              darkMode={darkMode}
            />
            <DebouncedInput
              label="Annual Growth Rate (%)"
              value={annualGrowthRate}
              onChange={setAnnualGrowthRate}
              min={0}
              step={0.01}
              darkMode={darkMode}
            />
          </div>
          <div
            className={
              darkMode
                ? "flex flex-wrap gap-4 items-center"
                : "flex flex-wrap gap-4 items-center"
            }
          >
            <div className="flex items-center h-full">
              <label
                className="text-xs text-gray-600 mr-2"
                htmlFor="toggle-charitable-giving"
              >
                Charitable Giving
              </label>
              <input
                id="toggle-charitable-giving"
                type="checkbox"
                checked={charitableGivingEnabled}
                onChange={(e) => setCharitableGivingEnabled(e.target.checked)}
                className="accent-indigo-500 w-4 h-4"
              />
            </div>
            <div className="flex items-center h-full">
              <label
                className="text-xs text-gray-600 mr-2"
                htmlFor="toggle-college-costs"
              >
                College Costs
              </label>
              <input
                id="toggle-college-costs"
                type="checkbox"
                checked={collegeCostsEnabled}
                onChange={(e) => setCollegeCostsEnabled(e.target.checked)}
                className="accent-indigo-500 w-4 h-4"
              />
            </div>
            {collegeCostsEnabled && (
              <>
                <DebouncedInput
                  label="# of Kids (for college)"
                  value={numKids}
                  onChange={setNumKids}
                  min={0}
                  step={1}
                  darkMode={darkMode}
                />
                <DebouncedInput
                  label="College Cost per Kid/Year ($)"
                  value={collegeCost}
                  onChange={setCollegeCost}
                  min={0}
                  step={1000}
                  darkMode={darkMode}
                />
                <DebouncedInput
                  label="College Start Age (oldest)"
                  value={collegeStartAge}
                  onChange={setCollegeStartAge}
                  min={0}
                  step={1}
                  darkMode={darkMode}
                />
                <DebouncedInput
                  label="College End Age (youngest)"
                  value={collegeEndAge}
                  onChange={setCollegeEndAge}
                  min={collegeStartAge}
                  step={1}
                  darkMode={darkMode}
                />
                <DebouncedInput
                  label="College Duration (years)"
                  value={collegeDuration}
                  onChange={setCollegeDuration}
                  min={1}
                  step={1}
                  darkMode={darkMode}
                />
              </>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div
          className={
            `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 ` +
            (darkMode ? "" : "")
          }
        >
          <Card
            darkMode={darkMode}
            borderClassName="border-l-4 border-indigo-500"
          >
            <h3
              className={`text-lg font-semibold mb-2 ${
                darkMode ? "text-slate-200" : "text-slate-600"
              }`}
            >
              Total Surplus (31 years)
            </h3>
            <p
              className={`text-3xl font-bold ${
                darkMode ? "text-green-400" : "text-green-600"
              }`}
            >
              {formatCurrency(totalSurplus)}
            </p>
          </Card>
          <Card
            darkMode={darkMode}
            borderClassName="border-l-4 border-purple-500"
          >
            <h3
              className={`text-lg font-semibold mb-2 ${
                darkMode ? "text-slate-200" : "text-slate-600"
              }`}
            >
              Final Portfolio (Age 65)
            </h3>
            <p
              className={`text-3xl font-bold ${
                darkMode ? "text-slate-100" : "text-slate-800"
              }`}
            >
              {formatCurrency(finalPortfolio)}
            </p>
          </Card>
          <Card
            darkMode={darkMode}
            borderClassName="border-l-4 border-teal-500"
          >
            <h3
              className={`text-lg font-semibold mb-2 ${
                darkMode ? "text-slate-200" : "text-slate-600"
              }`}
            >
              Average Annual Surplus
            </h3>
            <p
              className={`text-3xl font-bold ${
                darkMode ? "text-green-400" : "text-green-600"
              }`}
            >
              {formatCurrency(totalSurplus / (maxAge - initialAge))}
            </p>
          </Card>
          <Card
            darkMode={darkMode}
            borderClassName="border-l-4 border-rose-500"
          >
            <h3
              className={`text-lg font-semibold mb-2 ${
                darkMode ? "text-slate-200" : "text-slate-600"
              }`}
            >
              Total Charitable Giving
            </h3>
            <p
              className={`text-3xl font-bold ${
                darkMode ? "text-rose-400" : "text-rose-600"
              }`}
            >
              {formatCurrency(totalCharitableGiving)}
            </p>
          </Card>
        </div>

        {/* Charts Section */}
        <div
          className={
            `grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 ` +
            (darkMode ? "" : "")
          }
        >
          {/* Portfolio Growth Chart */}
          <Card darkMode={darkMode}>
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
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
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
          <Card darkMode={darkMode}>
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
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
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
        <Card darkMode={darkMode} className="overflow-x-auto">
          <button
            onClick={exportToCSV}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Download CSV
          </button>
          <h3 className="text-lg font-semibold text-center mb-4">
            Detailed Financial Table
          </h3>
          {/* Data-driven table columns/rows */}
          {(() => {
            type Column = {
              label: string;
              key: keyof DataRow;
              className: (
                darkMode: boolean,
                row: DataRow,
                index: number
              ) => string;
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
              className: (darkMode) =>
                `px-6 py-4 whitespace-nowrap text-sm ${
                  colorClass
                    ? darkMode
                      ? colorClass.replace("text-", "text-")
                      : colorClass.replace("text-", "text-")
                    : darkMode
                    ? "text-slate-100"
                    : "text-gray-900"
                }`,
              headerClass:
                "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100",
              sortable: true,
              render: (row) => formatCurrency(row[key]),
            });

            const columns: Column[] = [
              {
                label: "Age",
                key: "age",
                className: (darkMode) =>
                  `px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    darkMode ? "text-slate-100" : "text-gray-900"
                  }`,
                headerClass:
                  "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                sortable: false,
              },
              {
                label: "Starting Portfolio",
                key: "startingPortfolio",
                className: (darkMode) =>
                  `px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`,
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
                            darkMode
                              ? "text-green-400 font-semibold"
                              : "text-green-600 font-semibold"
                          }
                        >
                          ({formatCurrency(portfolioDiff)})
                        </span>
                      ) : null}
                    </>
                  );
                },
              },
              standardCurrencyColumn("Portfolio Growth", "portfolioGrowth"),
              standardCurrencyColumn("Net Job Income", "netJobIncome"),
              standardCurrencyColumn("Rental Income", "rentalIncome"),
              standardCurrencyColumn("Total Income", "totalIncome"),
              standardCurrencyColumn(
                "Charitable Giving",
                "charitableGiving",
                "text-rose-400 font-semibold"
              ),
              standardCurrencyColumn("Spending Need", "spendingNeed"),
              standardCurrencyColumn(
                "Investment Expenses",
                "investmentExpenses"
              ),
              {
                label: "Surplus/Deficit",
                key: "surplusDeficit",
                className: (darkMode, row) =>
                  `px-6 py-4 whitespace-nowrap text-sm font-semibold ` +
                  (row.surplusDeficit < 0
                    ? darkMode
                      ? "text-rose-400"
                      : "text-rose-600"
                    : darkMode
                    ? "text-green-400"
                    : "text-green-600"),
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
                className={
                  `min-w-full divide-y ` +
                  (darkMode ? "divide-gray-700" : "divide-gray-200")
                }
              >
                <thead className={darkMode ? "bg-slate-900" : "bg-gray-50"}>
                  <tr className={darkMode ? "text-slate-100" : undefined}>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        scope="col"
                        className={col.headerClass}
                        onClick={
                          col.sortable ? () => sortData(col.key) : undefined
                        }
                        style={{ cursor: col.sortable ? "pointer" : undefined }}
                      >
                        <div className="flex items-center">
                          {col.label} {col.sortable && getSortIcon(col.key)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody
                  className={
                    darkMode
                      ? "bg-slate-900 divide-gray-700"
                      : "bg-white divide-gray-200"
                  }
                >
                  {data.map((row, index) => (
                    <tr
                      key={row.age}
                      className={
                        darkMode
                          ? index % 2 === 0
                            ? "bg-slate-900"
                            : "bg-slate-800"
                          : index % 2 === 0
                          ? "bg-white"
                          : "bg-gray-50"
                      }
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={col.className(darkMode, row, index)}
                        >
                          {col.render ? col.render(row, index) : row[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          })()}
        </Card>
      </div>
    );
  };

  return <Dashboard />;
}
