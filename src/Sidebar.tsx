import React from "react";
import { ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react";
import { DebouncedInput } from "./DebouncedInput";
import { useFinancial } from "./useFinancial";

export const Sidebar: React.FC = () => {
  const {
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
  } = useFinancial();

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white dark:bg-slate-800 shadow-lg transition-all duration-300 z-10 ${
        sidebarCollapsed ? "w-12" : "w-80"
      } overflow-y-auto`}
    >
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute right-2 top-4 p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        )}
      </button>

      <div className={`p-4 ${sidebarCollapsed ? "hidden" : "block"}`}>
        <div className="flex mb-4 space-x-6 items-center justify-between pr-8">
          <h2 className="text-lg font-semibold dark:text-slate-100">
            Projection Inputs
          </h2>
          <button
            className="flex p-2 rounded border transition bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-600 hover:bg-slate-300 dark:hover:bg-slate-800"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          >
            <Sun className="hidden dark:inline w-4 h-4 text-slate-600 dark:text-slate-300" />
            <Moon className="inline dark:hidden w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium dark:text-slate-300">
              Financial Inputs
            </h3>
            <DebouncedInput
              label="Portfolio Value ($)"
              value={startingPortfolio}
              onChange={setStartingPortfolio}
              min={0}
              step={1000}
            />
            <DebouncedInput
              label="Annual Net Job Income ($)"
              value={netJobIncome}
              onChange={setNetJobIncome}
              min={0}
              step={1000}
            />
            <DebouncedInput
              label="Portfolio Investment / Mo ($)"
              value={monthlyInvestment}
              onChange={setMonthlyInvestment}
              min={0}
              step={100}
            />
            <DebouncedInput
              label="Passive Income ($)"
              value={passiveIncome}
              onChange={setPassiveIncome}
              min={0}
              step={1000}
            />
            <DebouncedInput
              label="Annual Expenses ($)"
              value={spendingNeed}
              onChange={setSpendingNeed}
              min={0}
              step={1000}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium dark:text-slate-300">
              Age Parameters
            </h3>
            <DebouncedInput
              label="Current Age"
              value={initialAge}
              onChange={setInitialAge}
              min={0}
              step={1}
            />
            <DebouncedInput
              label="Target Retirement Age"
              value={retirementAge}
              onChange={setRetirementAge}
              min={0}
              step={1}
            />
            <DebouncedInput
              label="Max Age"
              value={maxAge}
              onChange={setMaxAge}
              min={0}
              step={1}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium dark:text-slate-300">
              Rate Parameters
            </h3>
            <DebouncedInput
              label="Inflation Rate (%)"
              value={inflationRate}
              onChange={setInflationRate}
              min={0}
              step={0.01}
            />
            <DebouncedInput
              label="Annual Growth Rate (%)"
              value={annualGrowthRate}
              onChange={setAnnualGrowthRate}
              min={0}
              step={0.01}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium dark:text-slate-300">
              Additional Options
            </h3>
            <div className="flex items-center">
              <input
                id="toggle-charitable-giving"
                type="checkbox"
                checked={charitableGivingEnabled}
                onChange={(e) => setCharitableGivingEnabled(e.target.checked)}
                className="accent-indigo-500 w-4 h-4"
              />
              <label
                className="text-xs dark:text-gray-300 text-gray-600 ml-2"
                htmlFor="toggle-charitable-giving"
              >
                Charitable Giving
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="toggle-college-costs"
                type="checkbox"
                checked={collegeCostsEnabled}
                onChange={(e) => setCollegeCostsEnabled(e.target.checked)}
                className="accent-indigo-500 w-4 h-4"
              />
              <label
                className="text-xs dark:text-gray-300 text-gray-600 ml-2"
                htmlFor="toggle-college-costs"
              >
                College Costs
              </label>
            </div>
          </div>

          {collegeCostsEnabled && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium dark:text-slate-300">
                College Parameters
              </h3>
              <DebouncedInput
                label="# of Kids (for college)"
                value={numKids}
                onChange={setNumKids}
                min={0}
                step={1}
              />
              <DebouncedInput
                label="College Cost per Kid/Year ($)"
                value={collegeCost}
                onChange={setCollegeCost}
                min={0}
                step={1000}
              />
              <DebouncedInput
                label="College Start Age (oldest)"
                value={collegeStartAge}
                onChange={setCollegeStartAge}
                min={0}
                step={1}
              />
              <DebouncedInput
                label="College End Age (youngest)"
                value={collegeEndAge}
                onChange={setCollegeEndAge}
                min={collegeStartAge}
                step={1}
              />
              <DebouncedInput
                label="College Duration (years)"
                value={collegeDuration}
                onChange={setCollegeDuration}
                min={1}
                step={1}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
