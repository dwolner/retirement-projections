import React, { useEffect } from "react";
import { ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "./ui/button";

interface Inputs {
  startingPortfolio: number;
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
}

interface SidebarProps {
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
  initialAge: number;
  setInitialAge: (value: number) => void;
  retirementAge: number;
  setRetirementAge: (value: number) => void;
  maxAge: number;
  setMaxAge: (value: number) => void;
  inflationRate: number;
  setInflationRate: (value: number) => void;
  annualGrowthRate: number;
  setAnnualGrowthRate: (value: number) => void;
  charitableGivingEnabled: boolean;
  setCharitableGivingEnabled: (value: boolean) => void;
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
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
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
}: SidebarProps) => {
  const { register, handleSubmit, watch, setValue } = useForm<Inputs>();
  const formValues = watch();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setStartingPortfolio(data.startingPortfolio);
    setNetJobIncome(data.netJobIncome);
    setMonthlyInvestment(data.monthlyInvestment);
    setPassiveIncome(data.passiveIncome);
    setSpendingNeed(data.spendingNeed);
    setInitialAge(data.initialAge);
    setRetirementAge(data.retirementAge);
    setMaxAge(data.maxAge);
    setInflationRate(data.inflationRate);
    setAnnualGrowthRate(data.annualGrowthRate);
    setCharitableGivingEnabled(data.charitableGivingEnabled);
    setCollegeCostsEnabled(data.collegeCostsEnabled);
    setNumKids(data.numKids);
    setCollegeCost(data.collegeCost);
    setCollegeStartAge(data.collegeStartAge);
    setCollegeEndAge(data.collegeEndAge);
    setCollegeDuration(data.collegeDuration);
  };

  // Set initial form values
  useEffect(() => {
    setValue("startingPortfolio", startingPortfolio);
    setValue("netJobIncome", netJobIncome);
    setValue("monthlyInvestment", monthlyInvestment);
    setValue("passiveIncome", passiveIncome);
    setValue("spendingNeed", spendingNeed);
    setValue("initialAge", initialAge);
    setValue("retirementAge", retirementAge);
    setValue("maxAge", maxAge);
    setValue("inflationRate", inflationRate);
    setValue("annualGrowthRate", annualGrowthRate);
    setValue("charitableGivingEnabled", charitableGivingEnabled);
    setValue("collegeCostsEnabled", collegeCostsEnabled);
    setValue("numKids", numKids);
    setValue("collegeCost", collegeCost);
    setValue("collegeStartAge", collegeStartAge);
    setValue("collegeEndAge", collegeEndAge);
    setValue("collegeDuration", collegeDuration);
  }, []);

  // Define inputs as a data structure
  const inputsConfig = [
    {
      name: "startingPortfolio",
      label: "Portfolio Value ($)",
      min: 0,
      max: 10000000,
      step: 1000,
    },
    {
      name: "netJobIncome",
      label: "Annual Net Job Income ($)",
      min: 0,
      max: 10000000,
      step: 1000,
    },
    {
      name: "monthlyInvestment",
      label: "Portfolio Investment / Mo ($)",
      min: 0,
      max: 10000000,
      step: 100,
    },
    {
      name: "passiveIncome",
      label: "Passive Income ($)",
      min: 0,
      max: 10000000,
      step: 1000,
    },
    {
      name: "spendingNeed",
      label: "Annual Expenses ($)",
      min: 0,
      max: 10000000,
      step: 1000,
    },
    {
      name: "initialAge",
      label: "Current Age",
      min: 0,
      max: 120,
      step: 1,
    },
    {
      name: "retirementAge",
      label: "Retirement Age",
      min: 0,
      max: 120,
      step: 1,
    },
    {
      name: "maxAge",
      label: "Max Age",
      min: 0,
      max: 120,
      step: 1,
    },
    {
      name: "inflationRate",
      label: "Inflation Rate (%)",
      min: 0,
      max: 100,
      step: 0.01,
    },
    {
      name: "annualGrowthRate",
      label: "Annual Growth Rate (%)",
      min: 0,
      max: 100,
      step: 0.01,
    },
    {
      name: "numKids",
      label: "Number of Kids",
      min: 0,
      max: 120,
      step: 1,
    },
    {
      name: "collegeCost",
      label: "College Cost per Kid/Year ($)",
      min: 0,
      max: 10000000,
      step: 1000,
    },
    {
      name: "collegeStartAge",
      label: "College Start Age (oldest)",
      min: 0,
      max: 120,
      step: 1,
    },
    {
      name: "collegeEndAge",
      label: "College End Age (youngest)",
      min: 0,
      max: 120,
      step: 1,
    },
    {
      name: "collegeDuration",
      label: "College Duration (years)",
      min: 0,
      max: 120,
      step: 1,
    },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-full flex flex-col bg-white dark:bg-slate-800 shadow-lg transition-all duration-300 z-10 ${
        sidebarCollapsed ? "w-12" : "w-80"
      }`}
    >
      <Button
        variant="default"
        size="icon"
        onClick={() => {
          const newValue = !sidebarCollapsed;
          setSidebarCollapsed(newValue);
        }}
        className="absolute right-2 top-4 p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        )}
      </Button>

      <div className={`p-4 ${sidebarCollapsed ? "hidden" : "block"}`}>
        <div className="flex mb-4 space-x-6 items-center justify-between pr-8">
          <h2 className="text-lg font-semibold dark:text-slate-100">
            Projection Inputs
          </h2>
          <Button
            variant="default"
            className="rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            size="icon"
            onClick={() => {
              const newValue = !darkMode;
              setDarkMode(newValue);
            }}
            aria-label="Toggle dark mode"
          >
            <Sun className="hidden dark:inline w-4 h-4 text-slate-600 dark:text-slate-300" />
            <Moon className="inline dark:hidden w-4 h-4 text-slate-600 dark:text-slate-300" />
          </Button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Button
            variant="default"
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded w-full hover:bg-indigo-600"
          >
            Submit
          </Button>

          <div
            className="space-y-4 overflow-y-auto h-full p-2 rounded border border-slate-200 dark:border-slate-700"
            style={{ height: "calc(100vh - 150px)" }}
          >
            <div className="space-y-4">
              <h3 className="text-sm font-medium dark:text-slate-300">
                Additional Options
              </h3>
              <div className="flex items-center">
                <input
                  id="toggle-charitable-giving"
                  type="checkbox"
                  {...register("charitableGivingEnabled")}
                  className="accent-indigo-500 w-4 h-4"
                />
                <label
                  className="text-xs dark:text-gray-300 text-gray-600 ml-2"
                  htmlFor="toggle-charitable-giving"
                >
                  Charitable Giving Enabled
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="toggle-college-costs"
                  type="checkbox"
                  {...register("collegeCostsEnabled")}
                  className="accent-indigo-500 w-4 h-4"
                />
                <label
                  className="text-xs dark:text-gray-300 text-gray-600 ml-2"
                  htmlFor="toggle-college-costs"
                >
                  College Costs Enabled
                </label>
              </div>
            </div>

            <h3 className="text-sm font-medium dark:text-slate-300">
              Financial Inputs
            </h3>
            {inputsConfig.slice(0, 5).map((input) => (
              <div key={input.name}>
                <label
                  className={`block text-xs dark:text-gray-300 text-gray-600`}
                >
                  {input.label}
                </label>
                <input
                  type="number"
                  className={`border rounded px-2 py-1 w-full shadow-md dark:border-gray-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-gray-500 border-gray-200 bg-white text-slate-900 placeholder:text-gray-400`}
                  min={input.min}
                  max={input.max}
                  step={input.step}
                  {...register(input.name as keyof Inputs, {
                    valueAsNumber: true,
                  })}
                />
              </div>
            ))}

            <div className="space-y-4">
              <h3 className="text-sm font-medium dark:text-slate-300">
                Age Parameters
              </h3>
              {inputsConfig.slice(5, 8).map((input) => (
                <div key={input.name}>
                  <label
                    className={`block text-xs dark:text-gray-300 text-gray-600`}
                  >
                    {input.label}
                  </label>
                  <input
                    type="number"
                    className={`border rounded px-2 py-1 w-full shadow-md dark:border-gray-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-gray-500 border-gray-200 bg-white text-slate-900 placeholder:text-gray-400`}
                    min={input.min}
                    max={input.max}
                    step={input.step}
                    {...register(input.name as keyof Inputs, {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium dark:text-slate-300">
                Rate Parameters
              </h3>
              {inputsConfig.slice(8, 10).map((input) => (
                <div key={input.name}>
                  <label
                    className={`block text-xs dark:text-gray-300 text-gray-600`}
                  >
                    {input.label}
                  </label>
                  <input
                    type="number"
                    className={`border rounded px-2 py-1 w-full shadow-md dark:border-gray-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-gray-500 border-gray-200 bg-white text-slate-900 placeholder:text-gray-400`}
                    min={input.min}
                    max={input.max}
                    step={input.step}
                    {...register(input.name as keyof Inputs, {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              ))}
            </div>

            {formValues.collegeCostsEnabled && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium dark:text-slate-300">
                  College Parameters
                </h3>
                {inputsConfig.slice(10).map((input) => (
                  <div key={input.name}>
                    <label
                      className={`block text-xs dark:text-gray-300 text-gray-600`}
                    >
                      {input.label}
                    </label>
                    <input
                      type="number"
                      className={`border rounded px-2 py-1 w-full shadow-md dark:border-gray-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-gray-500 border-gray-200 bg-white text-slate-900 placeholder:text-gray-400`}
                      min={input.min}
                      max={input.max}
                      step={input.step}
                      {...register(input.name as keyof Inputs, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* <div className="space-y-4">
          <h3 className="text-sm font-medium dark:text-slate-300">
            Financial Inputs
          </h3>
          <DebouncedInput
            label="Portfolio Value ($)"
            value={startingPortfolio}
            onChange={(value) => {
              setStartingPortfolio(value);
            }}
            min={0}
            step={1000}
          />
          <DebouncedInput
            label="Annual Net Job Income ($)"
            value={netJobIncome}
            onChange={(value) => {
              setNetJobIncome(value);
            }}
            min={0}
            step={1000}
          />
          <DebouncedInput
            label="Portfolio Investment / Mo ($)"
            value={monthlyInvestment}
            onChange={(value) => {
              setMonthlyInvestment(value);
            }}
            min={0}
            step={100}
          />
          <DebouncedInput
            label="Passive Income ($)"
            value={passiveIncome}
            onChange={(value) => {
              setPassiveIncome(value);
            }}
            min={0}
            step={1000}
          />
          <DebouncedInput
            label="Annual Expenses ($)"
            value={spendingNeed}
            onChange={(value) => {
              setSpendingNeed(value);
            }}
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
            onChange={(value) => {
              setInitialAge(value);
            }}
            min={0}
            step={1}
          />
          <DebouncedInput
            label="Target Retirement Age"
            value={retirementAge}
            onChange={(value) => {
              setRetirementAge(value);
            }}
            min={0}
            step={1}
          />
          <DebouncedInput
            label="Max Age"
            value={maxAge}
            onChange={(value) => {
              setMaxAge(value);
            }}
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
            onChange={(value) => {
              setInflationRate(value);
            }}
            min={0}
            step={0.01}
          />
          <DebouncedInput
            label="Annual Growth Rate (%)"
            value={annualGrowthRate}
            onChange={(value) => {
              setAnnualGrowthRate(value);
            }}
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
              onChange={(e) => {
                const value = e.target.checked;
                setCharitableGivingEnabled(value);
              }}
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
              onChange={(e) => {
                const value = e.target.checked;
                setCollegeCostsEnabled(value);
              }}
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
              onChange={(value) => {
                setNumKids(value);
              }}
              min={0}
              step={1}
            />
            <DebouncedInput
              label="College Cost per Kid/Year ($)"
              value={collegeCost}
              onChange={(value) => {
                setCollegeCost(value);
              }}
              min={0}
              step={1000}
            />
            <DebouncedInput
              label="College Start Age (oldest)"
              value={collegeStartAge}
              onChange={(value) => {
                setCollegeStartAge(value);
              }}
              min={0}
              step={1}
            />
            <DebouncedInput
              label="College End Age (youngest)"
              value={collegeEndAge}
              onChange={(value) => {
                setCollegeEndAge(value);
              }}
              min={collegeStartAge}
              step={1}
            />
            <DebouncedInput
              label="College Duration (years)"
              value={collegeDuration}
              onChange={(value) => {
                setCollegeDuration(value);
              }}
              min={1}
              step={1}
            />
          </div>
        )} */}
      </div>
    </div>
  );
};
