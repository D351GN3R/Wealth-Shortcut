// 计算参数接口
export interface CalculationParams {
  currentAge: number;
  retirementAge: number;
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
  yearsToRetirement: number;
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
    console.log('📈 P值计算（投资收益率为0）:', {
      investmentReturnRate: `${investmentReturnRate}%`,
      yearsToRetirement,
      formula: `P = N = ${yearsToRetirement}`,
      result: yearsToRetirement
    });
    return yearsToRetirement;
  }
  
  // 计算期初年金终值系数：P = [(1+i)^N - 1] / i * (1+i)
  const pValue = ((Math.pow(1 + i, yearsToRetirement) - 1) / i) * (1 + i);
  
  console.log('📈 P值计算（期初年金终值系数）:', {
    investmentReturnRate: `${investmentReturnRate}%`,
    yearsToRetirement,
    formula: `[(1+${i})^${yearsToRetirement} - 1] / ${i} * (1+${i})`,
    result: pValue.toFixed(2)
  });
  
  return pValue;
}

// 主计算函数
export function calculateRetirementInvestment(params: CalculationParams): CalculationResult {
  // 单位转换：将"万元"转换为实际数值
  const currentAnnualExpenseActual = params.currentAnnualExpense * 10000;
  const currentPassiveIncomeActual = params.currentPassiveIncome * 10000;
  const expectedRetirementPassiveIncomeActual = params.expectedRetirementPassiveIncome * 10000;
  const currentInvestmentAssetsActual = params.currentInvestmentAssets * 10000;
  
  // 调试日志
  console.log('🔍 计算参数（单位转换后）:', {
    investmentReturn: params.investmentReturn,
    currentInvestmentAssets: `${params.currentInvestmentAssets}万 = ${currentInvestmentAssetsActual}元`,
    currentAnnualExpense: `${params.currentAnnualExpense}万 = ${currentAnnualExpenseActual}元`,
    yearsToRetirement: params.retirementAge - params.currentAge
  });
  
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
  
  // 调试日志
  console.log('💰 当前资产未来价值计算:', {
    currentAssets: `${params.currentInvestmentAssets}万 = ${currentInvestmentAssetsActual}元`,
    investmentReturn: params.investmentReturn,
    years: yearsToRetirement,
    formula: `${currentInvestmentAssetsActual} * (1 + ${params.investmentReturn}/100)^${yearsToRetirement}`,
    result: `${currentAssetsFutureValue}元 = ${(currentAssetsFutureValue/10000).toFixed(2)}万`
  });
  
  // 8. 资金缺口(D)
  const fundingGap = totalAssetsNeeded - currentAssetsFutureValue;
  
  console.log('📊 计算结果:', {
    totalAssetsNeeded: `${(totalAssetsNeeded/10000).toFixed(2)}万`,
    currentAssetsFutureValue: `${(currentAssetsFutureValue/10000).toFixed(2)}万`,
    fundingGap: `${(fundingGap/10000).toFixed(2)}万`
  });
  
  // 9. 获取P值（年金终值系数）
  const pValue = getPValue(params.investmentReturn, yearsToRetirement);
  
  // 10. 年度投资额(Y)
  const annualInvestmentNeeded = fundingGap / pValue;
  
  console.log('🎯 最终结果:', {
    pValue,
    annualInvestmentNeeded: `${(annualInvestmentNeeded/10000).toFixed(2)}万/年`
  });
  
  return {
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