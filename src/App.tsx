import { ArrowDown, ArrowUp } from "lucide-react";
import React, { useState } from "react";
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
  // Define a function to calculate the charitable giving for each year based on the new plan
  const calculateCharitableGiving = (age: number) => {
    if (age < 35) return 0;
    if (age <= 55) {
      // Linear ramp-up: $30,000 at age 35, increasing by $2,000 per year
      const years = age - 35;
      return 30000 + years * 2000;
    }
    // After age 55, giving stays at the age 55 amount ($70,000)
    return 70000;
  };

  // Define a function to calculate the net job income with a 3% annual increase
  const calculateNetJobIncome = (age: number) => {
    // Starting net job income at age 35
    const initialIncome = 128771;
    // 3% annual increase
    const growthRate = 1.03;
    if (age < 35) return 0;
    // Assume retirement at age 56, so no job income from this age onwards
    if (age >= 56) return 0;
    const yearsOfGrowth = age - 35;
    return initialIncome * Math.pow(growthRate, yearsOfGrowth);
  };

  const initialData = [
    {
      age: 35,
      startingPortfolio: 908000,
      netJobIncome: 128771,
      monthlyInvestments: 132000,
      portfolioIncome: 45400,
      rentalIncome: 133400,
      spendingNeed: 150000,
    },
    {
      age: 36,
      startingPortfolio: 1197571,
      netJobIncome: 128771,
      monthlyInvestments: 132000,
      portfolioIncome: 59879,
      rentalIncome: 136735,
      spendingNeed: 153750,
    },
    {
      age: 37,
      startingPortfolio: 1481206,
      netJobIncome: 128771,
      monthlyInvestments: 132000,
      portfolioIncome: 74060,
      rentalIncome: 140154,
      spendingNeed: 157594,
    },
    {
      age: 38,
      startingPortfolio: 1758597,
      netJobIncome: 128771,
      monthlyInvestments: 132000,
      portfolioIncome: 87930,
      rentalIncome: 143658,
      spendingNeed: 161534,
    },
    {
      age: 39,
      startingPortfolio: 2030391,
      netJobIncome: 128771,
      monthlyInvestments: 132000,
      portfolioIncome: 101520,
      rentalIncome: 147250,
      spendingNeed: 165577,
    },
    {
      age: 40,
      startingPortfolio: 2296355,
      netJobIncome: 128771,
      monthlyInvestments: 132000,
      portfolioIncome: 114818,
      rentalIncome: 150931,
      spendingNeed: 169766,
    },
    {
      age: 41,
      startingPortfolio: 2558109,
      netJobIncome: 128771,
      monthlyInvestments: 132000,
      portfolioIncome: 127905,
      rentalIncome: 154704,
      spendingNeed: 174096,
    },
    {
      age: 42,
      startingPortfolio: 2814993,
      netJobIncome: 128771,
      monthlyInvestments: 132000,
      portfolioIncome: 140750,
      rentalIncome: 158572,
      spendingNeed: 178590,
    },
    {
      age: 43,
      startingPortfolio: 3067896,
      netJobIncome: 128771,
      monthlyInvestments: 132000,
      portfolioIncome: 153395,
      rentalIncome: 162536,
      spendingNeed: 183050,
    },
    {
      age: 44,
      startingPortfolio: 3321548,
      netJobIncome: 128771,
      monthlyInvestments: 132000,
      portfolioIncome: 166077,
      rentalIncome: 166600,
      spendingNeed: 187640,
    },
    {
      age: 45,
      startingPortfolio: 3577356,
      netJobIncome: 128771,
      monthlyInvestments: 132000,
      portfolioIncome: 178868,
      rentalIncome: 170765,
      spendingNeed: 192331,
    },
    {
      age: 46,
      startingPortfolio: 3837029,
      netJobIncome: 128771,
      monthlyInvestments: 132000,
      portfolioIncome: 191851,
      rentalIncome: 175034,
      spendingNeed: 197144,
    },
    {
      age: 47,
      startingPortfolio: 4100522,
      netJobIncome: 128771,
      monthlyInvestments: 132000,
      portfolioIncome: 204996,
      rentalIncome: 179409,
      spendingNeed: 202079,
    },
    {
      age: 48,
      startingPortfolio: 4367519,
      netJobIncome: 128771,
      monthlyInvestments: 132000,
      portfolioIncome: 218376,
      rentalIncome: 183894,
      spendingNeed: 207130,
    },
    {
      age: 49,
      startingPortfolio: 4639030,
      netJobIncome: 128771,
      monthlyInvestments: 132000,
      portfolioIncome: 231951,
      rentalIncome: 188492,
      spendingNeed: 212309,
    },
    {
      age: 50,
      startingPortfolio: 4914874,
      netJobIncome: 128771,
      monthlyInvestments: 132000,
      portfolioIncome: 245744,
      rentalIncome: 193204,
      spendingNeed: 217632,
    },
    {
      age: 51,
      startingPortfolio: 5195961,
      netJobIncome: 128771,
      monthlyInvestments: 132000,
      portfolioIncome: 259837,
      rentalIncome: 198034,
      spendingNeed: 223120,
    },
    {
      age: 52,
      startingPortfolio: 5483433,
      netJobIncome: 128771,
      monthlyInvestments: 132000,
      portfolioIncome: 274172,
      rentalIncome: 202985,
      spendingNeed: 330041,
    },
    {
      age: 53,
      startingPortfolio: 5731320,
      netJobIncome: 128771,
      monthlyInvestments: 132000,
      portfolioIncome: 286566,
      rentalIncome: 208060,
      spendingNeed: 339674,
    },
    {
      age: 54,
      startingPortfolio: 5987043,
      netJobIncome: 128771,
      monthlyInvestments: 132000,
      portfolioIncome: 299352,
      rentalIncome: 213261,
      spendingNeed: 349783,
    },
    {
      age: 55,
      startingPortfolio: 6250644,
      netJobIncome: 128771,
      monthlyInvestments: 132000,
      portfolioIncome: 312532,
      rentalIncome: 218593,
      spendingNeed: 464893,
    },
    {
      age: 56,
      startingPortfolio: 6437547,
      netJobIncome: 0,
      monthlyInvestments: 0,
      portfolioIncome: 321877,
      rentalIncome: 224059,
      spendingNeed: 476815,
    },
    {
      age: 57,
      startingPortfolio: 6506668,
      netJobIncome: 0,
      monthlyInvestments: 0,
      portfolioIncome: 325333,
      rentalIncome: 229659,
      spendingNeed: 395914,
    },
    {
      age: 58,
      startingPortfolio: 6665746,
      netJobIncome: 0,
      monthlyInvestments: 0,
      portfolioIncome: 333287,
      rentalIncome: 235400,
      spendingNeed: 304245,
    },
    {
      age: 59,
      startingPortfolio: 6930188,
      netJobIncome: 0,
      monthlyInvestments: 0,
      portfolioIncome: 346509,
      rentalIncome: 241285,
      spendingNeed: 285846,
    },
    {
      age: 60,
      startingPortfolio: 7232136,
      netJobIncome: 0,
      monthlyInvestments: 0,
      portfolioIncome: 361607,
      rentalIncome: 247317,
      spendingNeed: 292992,
    },
    {
      age: 61,
      startingPortfolio: 7548068,
      netJobIncome: 0,
      monthlyInvestments: 0,
      portfolioIncome: 377403,
      rentalIncome: 253500,
      spendingNeed: 300317,
    },
    {
      age: 62,
      startingPortfolio: 7878654,
      netJobIncome: 0,
      monthlyInvestments: 0,
      portfolioIncome: 393933,
      rentalIncome: 259838,
      spendingNeed: 307825,
    },
    {
      age: 63,
      startingPortfolio: 8224599,
      netJobIncome: 0,
      monthlyInvestments: 0,
      portfolioIncome: 411230,
      rentalIncome: 266334,
      spendingNeed: 315520,
    },
    {
      age: 64,
      startingPortfolio: 8586643,
      netJobIncome: 0,
      monthlyInvestments: 0,
      portfolioIncome: 429332,
      rentalIncome: 272992,
      spendingNeed: 323408,
    },
    {
      age: 65,
      startingPortfolio: 8965559,
      netJobIncome: 0,
      monthlyInvestments: 0,
      portfolioIncome: 448278,
      rentalIncome: 279817,
      spendingNeed: 331495,
    },
  ];

  const updatedData = initialData.map((row) => {
    const charitableGiving = calculateCharitableGiving(row.age);
    const netJobIncome = calculateNetJobIncome(row.age);
    // Recalculate surplusDeficit to account for charitable giving
    const totalIncome =
      netJobIncome +
      row.monthlyInvestments +
      row.portfolioIncome +
      row.rentalIncome;
    const totalExpenses = row.spendingNeed + charitableGiving;
    const surplusDeficit = totalIncome - totalExpenses;
    return { ...row, netJobIncome, charitableGiving, surplusDeficit };
  });

  const [data, setData] = useState(updatedData);
  type SortConfig = {
    key: string | null;
    direction: "ascending" | "descending";
  };
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ascending",
  });

  type DataRow = {
    age: number;
    startingPortfolio: number;
    netJobIncome: number;
    monthlyInvestments: number;
    portfolioIncome: number;
    rentalIncome: number;
    spendingNeed: number;
    charitableGiving: number;
    surplusDeficit: number;
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
    const totalSurplus = data.reduce(
      (acc, curr) => acc + curr.surplusDeficit,
      0
    );
    const totalCharitableGiving = data.reduce(
      (acc, curr) => acc + curr.charitableGiving,
      0
    );
    const finalPortfolio =
      data[data.length - 1].startingPortfolio +
      data[data.length - 1].surplusDeficit;

    return (
      <div className="p-4 sm:p-8 bg-slate-50 min-h-screen text-slate-800 font-sans">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center text-slate-900">
          Retirement Projection Dashboard
        </h1>
        <p className="text-center text-slate-600 mb-8">
          A visual breakdown of your financial plan from age 35 to 65.
        </p>

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
              {formatCurrency(totalSurplus / 31)}
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
                  onClick={() => sortData("netJobIncome")}
                >
                  <div className="flex items-center">Net Job Income</div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => sortData("portfolioIncome")}
                >
                  <div className="flex items-center">
                    Portfolio Income {getSortIcon("portfolioIncome")}
                  </div>
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
                  onClick={() => sortData("surplusDeficit")}
                >
                  <div className="flex items-center">
                    Surplus/Deficit {getSortIcon("surplusDeficit")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row) => (
                <tr key={row.age}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(row.startingPortfolio)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(row.netJobIncome)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(row.portfolioIncome)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(row.rentalIncome)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-rose-600 font-semibold">
                    {formatCurrency(row.charitableGiving)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(row.spendingNeed)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                    {formatCurrency(row.surplusDeficit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return <Dashboard />;
}
