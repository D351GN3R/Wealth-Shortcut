// 计算模式枚举
export enum CalculationMode {
  CALCULATE_INVESTMENT = 'calculate_investment',
  CALCULATE_RETIREMENT_AGE = 'calculate_retirement_age'
}

// 计算参数接口
export interface CalculationParams {
  currentAge: number;
  retirementAge?: number; // 算投资金额模式必填
  monthlyInvestment?: number; // 算退休年龄模式必填
  currentAnnualExpense: number;
  currentPassiveIncome: number;
  expectedRetirementPassiveIncome: number;
  currentInvestmentAssets: number;
  inflationRate: number;
  investmentReturn: number;
  retirementExpenseRatio: number;
  withdrawalRate: number;
}

// 计算结果接口
export interface CalculationResult {
  mode: CalculationMode;
  yearsToRetirement: number;
  calculatedRetirementAge?: number; // 算退休年龄模式结果
  inflationFactor: number;
  retirementAnnualExpense: number;
  retirementPassiveIncome: number;
  investmentNeededToCoverExpense: number;
  totalAssetsNeeded: number;
  currentAssetsFutureValue: number;
  fundingGap: number;
  pValue: number;
  annualInvestmentNeeded: number;
}

// P值计算函数 - 期初年金终值系数
// 公式：P = [(1+i)^N - 1] / i * (1+i)
// 其中 i 是投资收益率，N 是投资年限
function getPValue(investmentReturnRate: number, yearsToRetirement: number): number {
  // 将百分比转换为小数
  const i = investmentReturnRate / 100;
  
  // 特殊情况：如果投资收益率为0，则P = N（没有复利效应）
  if (i === 0) {
    return yearsToRetirement;
  }
  
  // 计算期初年金终值系数：P = [(1+i)^N - 1] / i * (1+i)
  const pValue = ((Math.pow(1 + i, yearsToRetirement) - 1) / i) * (1 + i);
  
  return pValue;
}

// 正向计算函数（算投资金额模式）
function calculateInvestmentAmount(params: CalculationParams): CalculationResult {
  if (!params.retirementAge) {
    throw new Error('退休年龄是必填项');
  }
  // 单位转换：将"万元"转换为实际数值
  const currentAnnualExpenseActual = params.currentAnnualExpense * 10000;
  const currentPassiveIncomeActual = params.currentPassiveIncome * 10000;
  const expectedRetirementPassiveIncomeActual = params.expectedRetirementPassiveIncome * 10000;
  const currentInvestmentAssetsActual = params.currentInvestmentAssets * 10000;
  

  
  // 1. 退休年数(N)
  const yearsToRetirement = params.retirementAge - params.currentAge;
  
  // 2. 通胀因子(INF)
  const inflationFactor = Math.pow(1 + params.inflationRate / 100, yearsToRetirement);
  
  // 3. 退休时年开支
  const retirementAnnualExpense = currentAnnualExpenseActual * inflationFactor * (params.retirementExpenseRatio / 100);
  
  // 4. 退休时被动收入
  const retirementPassiveIncome = (currentPassiveIncomeActual * inflationFactor) + expectedRetirementPassiveIncomeActual;
  
  // 5. 需投资覆盖开支
  const investmentNeededToCoverExpense = retirementAnnualExpense - retirementPassiveIncome;
  
  // 6. 退休所需总资产(F)
  const totalAssetsNeeded = investmentNeededToCoverExpense / (params.withdrawalRate / 100);
  
  // 7. 当前资产未来价值
  const currentAssetsFutureValue = currentInvestmentAssetsActual * Math.pow(1 + params.investmentReturn / 100, yearsToRetirement);
  

  
  // 8. 资金缺口(D)
  const fundingGap = totalAssetsNeeded - currentAssetsFutureValue;
  

  
  // 9. 获取P值（年金终值系数）
  const pValue = getPValue(params.investmentReturn, yearsToRetirement);
  
  // 10. 年度投资额(Y)
  const annualInvestmentNeeded = fundingGap / pValue;
  

  
  return {
    mode: CalculationMode.CALCULATE_INVESTMENT,
    yearsToRetirement,
    inflationFactor,
    retirementAnnualExpense,
    retirementPassiveIncome,
    investmentNeededToCoverExpense,
    totalAssetsNeeded,
    currentAssetsFutureValue,
    fundingGap,
    pValue,
    annualInvestmentNeeded
  };
}

// 反向计算函数（算退休年龄模式）
function calculateRetirementAge(params: CalculationParams): CalculationResult {
  if (!params.monthlyInvestment) {
    throw new Error('每月投资金额是必填项');
  }
  
  // 单位转换：monthlyInvestment现在是"元"单位，直接计算年投资额
  const targetAnnualInvestment = params.monthlyInvestment * 12;
  
  // 使用二分查找法求解退休年数
  let minYears = 1;
  let maxYears = 100;
  let bestYears = maxYears; // 初始化为最大值，避免过早收敛到最小值
  const tolerance = 0.01; // 容差
  const maxIterations = 100;
  let iterations = 0;
  

  
  while (maxYears - minYears > tolerance && iterations < maxIterations) {
    const midYears = (minYears + maxYears) / 2;
    const testRetirementAge = params.currentAge + midYears;
    
    // 使用当前年数计算所需投资额
    const testParams = {
      ...params,
      retirementAge: testRetirementAge
    };
    
    const result = calculateInvestmentAmount(testParams);
    

    
    // 处理负数情况：如果所需投资额为负数，说明当前资产已经足够，可以更早退休
    if (result.annualInvestmentNeeded <= targetAnnualInvestment) {
      // 所需投资额小于等于目标（包括负数情况），当前年数足够，尝试更早退休
      maxYears = midYears;
      bestYears = midYears;
      console.log(`✅ 当前年数足够，尝试更早退休，新范围: ${minYears.toFixed(2)}-${maxYears.toFixed(2)}年`);
    } else {
      // 所需投资额大于目标，当前年数不够，需要延后退休
      minYears = midYears;
      console.log(`❌ 当前年数不够，需要延后退休，新范围: ${minYears.toFixed(2)}-${maxYears.toFixed(2)}年`);
    }
    
    iterations++;
  }
  

  
  const calculatedRetirementAge = params.currentAge + bestYears;
  
  // 使用最终结果重新计算完整数据
  const finalParams = {
    ...params,
    retirementAge: calculatedRetirementAge
  };
  
  const finalResult = calculateInvestmentAmount(finalParams);
  
  return {
    ...finalResult,
    mode: CalculationMode.CALCULATE_RETIREMENT_AGE,
    calculatedRetirementAge: Math.round(calculatedRetirementAge)
  };
}

// 统一计算入口函数
export function calculate(params: CalculationParams, mode: CalculationMode): CalculationResult {
  switch (mode) {
    case CalculationMode.CALCULATE_INVESTMENT:
      return calculateInvestmentAmount(params);
    case CalculationMode.CALCULATE_RETIREMENT_AGE:
      return calculateRetirementAge(params);
    default:
      throw new Error('未知的计算模式');
  }
}

// 向后兼容的主计算函数
export function calculateRetirementInvestment(params: CalculationParams): CalculationResult {
  return calculateInvestmentAmount(params);
}

// 默认参数（注意：金额单位为"万元"）
export const DEFAULT_PARAMS: CalculationParams = {
  currentAge: NaN,
  retirementAge: NaN,
  currentAnnualExpense: NaN,
  currentPassiveIncome: NaN,
  expectedRetirementPassiveIncome: 4,
  currentInvestmentAssets: NaN,
  inflationRate: 4,
  investmentReturn: NaN,
  retirementExpenseRatio: 80,
  withdrawalRate: 4
};

// 格式化数字为货币格式
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

// 格式化数字为百分比格式
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

// 格式化数字为普通数字格式
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('zh-CN').format(Math.round(value));
}