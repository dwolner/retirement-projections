import { ArrowDown, ArrowUp } from "lucide-react";
import React, { useEffect, useState } from "react";
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
  const [startingPortfolio, setStartingPortfolio] = useState(740000);
  const [netJobIncome, setNetJobIncome] = useState(128771);
  const [monthlyInvestment, setMonthlyInvestment] = useState(8000);
  const [rentalIncome, setRentalIncome] = useState(133400);
  const [spendingNeed, setSpendingNeed] = useState(130000);
  const [initialAge, setInitialAge] = useState(36);
  const [retirementAge, setRetirementAge] = useState(68);
  const [maxAge, setMaxAge] = useState(92);
  const [inflationRate, setInflationRate] = useState(0.03);
  const [annualGrowthRate, setAnnualGrowthRate] = useState(0.05);

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
    setData(
      Array.from({ length: maxAge - initialAge }, (_, i) => {
        const age = initialAge + i;
        const {
          startingPortfolio,
          netJobIncome,
          portfolioGrowth,
          rentalIncome,
          totalIncome,
          investmentExpenses,
          spendingNeed,
          charitableGiving,
          surplusDeficit,
        } = calculateSurplusDeficit(age);
        return {
          age,
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
  ]);

  // Define a function to calculate the charitable giving for each year based on the new plan
  const calculateCharitableGiving = (age: number) => {
    if (age < initialAge) return 0;
    // const yearsOfGrowth = age - initialAge;
    // const yearsOfGrowth =
    //   age <= retirementAge ? age - initialAge : retirementAge - initialAge;
    // const growthRate = 1 + 0.04;
    // return charitableGiving * Math.pow(growthRate, yearsOfGrowth);

    // giving should be 10% of income
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

    // Adjust spending need for college costs
    // 1st kid goes to college at age 52, second kid goes to college at 55
    // add college costs to spending need
    const collegeCost = 50000; // Assume $50,000 per year for college
    if (age > 51 && age < 55) {
      newSpendingNeed += collegeCost;
    }
    if (age > 54 && age < 58) {
      newSpendingNeed += collegeCost;
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
      <span className={total < 0 ? "text-rose-600" : "text-green-600"}>
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
      <div className="p-4 sm:p-8 bg-slate-50 min-h-screen text-slate-800 font-sans">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center text-slate-900">
          Retirement Projection Dashboard
        </h1>
        <p className="text-center text-slate-600 mb-8">
          A visual breakdown of your financial plan from age {initialAge} to{" "}
          {maxAge}.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <div>
            <label className="block text-xs text-gray-600">
              Starting Portfolio
            </label>
            <input
              type="number"
              className="border-gray-200 border rounded px-2 py-1 bg-white w-full shadow-md"
              value={startingPortfolio}
              onChange={(e) => setStartingPortfolio(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">
              Net Job Income
            </label>
            <input
              type="number"
              className="border-gray-200 border rounded px-2 py-1 bg-white w-full shadow-md"
              value={netJobIncome}
              onChange={(e) => setNetJobIncome(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">
              Monthly Investment
            </label>
            <input
              type="number"
              step="100"
              className="border-gray-200 border rounded px-2 py-1 bg-white w-full shadow-md"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">Rental Income</label>
            <input
              type="number"
              className="border-gray-200 border rounded px-2 py-1 bg-white w-full shadow-md"
              value={rentalIncome}
              onChange={(e) => setRentalIncome(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">Spending Need</label>
            <input
              type="number"
              step="1000"
              className="border-gray-200 border rounded px-2 py-1 bg-white w-full shadow-md"
              value={spendingNeed}
              onChange={(e) => setSpendingNeed(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">Initial Age</label>
            <input
              type="number"
              className="border-gray-200 border rounded px-2 py-1 bg-white w-full shadow-md"
              value={initialAge}
              onChange={(e) => setInitialAge(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">
              Retirement Age
            </label>
            <input
              type="number"
              className="border-gray-200 border rounded px-2 py-1 bg-white w-full shadow-md"
              value={retirementAge}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">Max Age</label>
            <input
              type="number"
              className="border-gray-200 border rounded px-2 py-1 bg-white w-full shadow-md"
              value={maxAge}
              onChange={(e) => setMaxAge(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">
              Inflation Rate
            </label>
            <input
              type="number"
              step="0.01"
              className="border-gray-200 border rounded px-2 py-1 bg-white w-full shadow-md"
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">
              Annual Growth Rate
            </label>
            <input
              type="number"
              step="0.01"
              className="border-gray-200 border rounded px-2 py-1 bg-white w-full shadow-md"
              value={annualGrowthRate}
              onChange={(e) => setAnnualGrowthRate(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              Total Surplus (31 years)
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(totalSurplus)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              Final Portfolio (Age 65)
            </h3>
            <p className="text-3xl font-bold text-slate-800">
              {formatCurrency(finalPortfolio)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-teal-500">
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              Average Annual Surplus
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(totalSurplus / (maxAge - initialAge))}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-rose-500">
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              Total Charitable Giving
            </h3>
            <p className="text-3xl font-bold text-rose-600">
              {formatCurrency(totalCharitableGiving)}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Portfolio Growth Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
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
          </div>

          {/* Surplus/Deficit Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
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
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
          <button
            onClick={exportToCSV}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Download CSV
          </button>
          <h3 className="text-lg font-semibold text-center mb-4">
            Detailed Financial Table
          </h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Age
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => sortData("startingPortfolio")}
                >
                  <div className="flex items-center">
                    Starting Portfolio {getSortIcon("startingPortfolio")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => sortData("portfolioGrowth")}
                >
                  <div className="flex items-center">
                    Portfolio Growth {getSortIcon("portfolioGrowth")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => sortData("netJobIncome")}
                >
                  <div className="flex items-center">Net Job Income</div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => sortData("rentalIncome")}
                >
                  <div className="flex items-center">
                    Rental Income {getSortIcon("rentalIncome")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => sortData("totalIncome")}
                >
                  <div className="flex items-center">
                    Total Income {getSortIcon("totalIncome")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => sortData("charitableGiving")}
                >
                  <div className="flex items-center">
                    Charitable Giving {getSortIcon("charitableGiving")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => sortData("spendingNeed")}
                >
                  <div className="flex items-center">
                    Spending Need {getSortIcon("spendingNeed")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => sortData("investmentExpenses")}
                >
                  <div className="flex items-center">
                    Investment Expenses {getSortIcon("investmentExpenses")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => sortData("surplusDeficit")}
                >
                  <div className="flex items-center">
                    Surplus/Deficit {getSortIcon("surplusDeficit")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, index) => {
                const portfolioDiff =
                  row.startingPortfolio - data[index - 1]?.startingPortfolio;
                return (
                  <tr key={row.age}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.age}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(row.startingPortfolio)}
                      {` `}
                      {portfolioDiff ? (
                        <span className="text-green-600 font-semibold">
                          ({formatCurrency(portfolioDiff)})
                        </span>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(row.portfolioGrowth)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(row.netJobIncome)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(row.rentalIncome)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(row.totalIncome)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-rose-600 font-semibold">
                      {formatCurrency(row.charitableGiving)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(row.spendingNeed)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(row.investmentExpenses)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm  font-semibold">
                      <span
                        className={
                          row.surplusDeficit < 0
                            ? "text-rose-600"
                            : "text-green-600"
                        }
                      >
                        {formatCurrency(row.surplusDeficit)}
                        {` `}
                      </span>
                      ({cummulativeSurplusDeficit(row.age)})
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return <Dashboard />;
}
