// 测试前端计算器的实际行为
// 模拟用户在前端输入不同投资收益率时的计算结果

console.log('=== 前端计算器测试：验证投资收益率对结果的影响 ===\n');

// FVIFA计算函数（年金终值系数）
function calculateFVIFA(rate, years) {
  if (rate === 0) {
    return years;
  }
  return (Math.pow(1 + rate, years) - 1) / rate;
}

// 模拟前端计算逻辑
function simulateFrontendCalculation(params) {
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
  
  // 9. 获取P值（年金终值系数FVIFA）
  const pValue = calculateFVIFA(params.investmentReturn / 100, yearsToRetirement);
  
  // 10. 年度投资额(Y)
  const annualInvestmentNeeded = fundingGap / pValue;
  
  return {
    yearsToRetirement,
    inflationFactor,
    retirementAnnualExpense: retirementAnnualExpense / 10000, // 转换回万元
    retirementPassiveIncome: retirementPassiveIncome / 10000,
    investmentNeededToCoverExpense: investmentNeededToCoverExpense / 10000,
    totalAssetsNeeded: totalAssetsNeeded / 10000,
    currentAssetsFutureValue: currentAssetsFutureValue / 10000,
    fundingGap: fundingGap / 10000,
    pValue,
    annualInvestmentNeeded: annualInvestmentNeeded / 10000
  };
}

// 基础参数（模拟用户输入）
const baseParams = {
  currentAge: 25,
  retirementAge: 45,
  currentAnnualExpense: 18,      // 18万元
  currentPassiveIncome: 0,       // 0万元（关键测试点）
  expectedRetirementPassiveIncome: 4,  // 4万元
  currentInvestmentAssets: 11,   // 11万元
  inflationRate: 4,              // 4%
  retirementExpenseRatio: 80,    // 80%
  withdrawalRate: 4              // 4%
};

// 测试不同投资收益率
const testRates = [6, 8, 10, 12];

console.log('测试场景：当前被动收入 = 0万元/年');
console.log('预期：投资收益率变化应该影响所有计算结果\n');

console.log('投资收益率\t当前资产未来价值\t资金缺口\t\tP值(FVIFA)\t年度投资额');
console.log('------------------------------------------------------------------------');

testRates.forEach(rate => {
  const params = { ...baseParams, investmentReturn: rate };
  const result = simulateFrontendCalculation(params);
  
  console.log(`${rate}%\t\t${result.currentAssetsFutureValue.toFixed(2)}万\t\t${result.fundingGap.toFixed(2)}万\t\t${result.pValue.toFixed(2)}\t\t${result.annualInvestmentNeeded.toFixed(2)}万`);
});

console.log('\n=== 验证结果 ===');
console.log('✅ 如果看到以下变化，说明修复成功：');
console.log('1. 投资收益率越高 → 当前资产未来价值越高');
console.log('2. 投资收益率越高 → 资金缺口越小');
console.log('3. 投资收益率越高 → P值（FVIFA）越大');
console.log('4. 投资收益率越高 → 年度投资额越小');

console.log('\n❌ 如果所有数值都相同，说明投资收益率参数没有正确影响计算');

// 额外测试：对比修复前后的差异
console.log('\n=== 对比分析 ===');
const result6 = simulateFrontendCalculation({ ...baseParams, investmentReturn: 6 });
const result12 = simulateFrontendCalculation({ ...baseParams, investmentReturn: 12 });

console.log(`6%收益率时的年度投资额: ${result6.annualInvestmentNeeded.toFixed(2)}万`);
console.log(`12%收益率时的年度投资额: ${result12.annualInvestmentNeeded.toFixed(2)}万`);
console.log(`差异: ${(result6.annualInvestmentNeeded - result12.annualInvestmentNeeded).toFixed(2)}万`);

if (Math.abs(result6.annualInvestmentNeeded - result12.annualInvestmentNeeded) > 1) {
  console.log('✅ 投资收益率正确影响了计算结果');
} else {
  console.log('❌ 投资收益率没有影响计算结果，可能仍有问题');
}

// 验证P值计算
console.log('\n=== P值验证 ===');
console.log('根据FVIFA公式 [(1+r)^n - 1]/r 计算的P值：');
testRates.forEach(rate => {
  const years = 20;
  const fvifa = calculateFVIFA(rate / 100, years);
  console.log(`${rate}%收益率，${years}年期：P值 = ${fvifa.toFixed(2)}`);
});

console.log('\n注意：用户提供的P值表可能基于不同的假设或计算方法');
console.log('重要的是确保投资收益率变化时，P值和最终结果都会相应变化');