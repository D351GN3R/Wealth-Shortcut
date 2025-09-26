// 测试FVIFA计算的正确性
function testFVIFACalculation() {
  console.log('=== 测试年金终值系数（FVIFA）计算 ===\n');
  
  // 根据用户提供的公式：FVIFA = [(1+r)^n - 1] / r
  function calculateFVIFA(rate, years) {
    if (rate === 0) {
      return years; // 当利率为0时，FVIFA = n
    }
    return (Math.pow(1 + rate, years) - 1) / rate;
  }
  
  // 测试不同投资收益率下的FVIFA值（20年期）
  const testRates = [0.06, 0.08, 0.10, 0.12];
  const years = 20;
  
  console.log('投资收益率\t年数\tFVIFA值');
  console.log('----------------------------------------');
  
  testRates.forEach(rate => {
    const fvifa = calculateFVIFA(rate, years);
    console.log(`${(rate * 100).toFixed(0)}%\t\t${years}\t${fvifa.toFixed(2)}`);
  });
  
  // 验证用户提供的P值表中的数据
  console.log('\n=== 验证用户提供的P值表 ===');
  console.log('根据用户表格，20年期对应的P值应该是64');
  
  // 计算10%收益率下20年的FVIFA
  const fvifa_10_20 = calculateFVIFA(0.10, 20);
  console.log(`10%收益率，20年期的FVIFA计算值: ${fvifa_10_20.toFixed(2)}`);
  
  // 这个值应该接近64，如果不是，说明用户的表格可能有其他假设
  if (Math.abs(fvifa_10_20 - 64) < 5) {
    console.log('✅ 计算结果与用户表格基本一致');
  } else {
    console.log('❌ 计算结果与用户表格差异较大');
    console.log(`差异: ${Math.abs(fvifa_10_20 - 64).toFixed(2)}`);
    console.log('可能的原因：');
    console.log('1. 用户表格使用了不同的投资收益率假设');
    console.log('2. 用户表格可能包含了其他调整因子');
    console.log('3. 用户表格可能使用了不同的计算方法');
  }
  
  // 测试用户表格中的其他数据点
  console.log('\n=== 测试用户表格中的其他数据点 ===');
  const tableData = [
    { years: 40, expectedP: 488 },
    { years: 35, expectedP: 299 },
    { years: 30, expectedP: 182 },
    { years: 25, expectedP: 109 },
    { years: 20, expectedP: 64 },
    { years: 15, expectedP: 36 },
    { years: 10, expectedP: 18.5 },
    { years: 5, expectedP: 7.7 }
  ];
  
  console.log('年数\t用户表格P值\t10%收益率FVIFA\t差异');
  console.log('------------------------------------------------');
  
  tableData.forEach(({ years, expectedP }) => {
    const calculatedFVIFA = calculateFVIFA(0.10, years);
    const difference = Math.abs(calculatedFVIFA - expectedP);
    console.log(`${years}\t${expectedP}\t\t${calculatedFVIFA.toFixed(2)}\t\t${difference.toFixed(2)}`);
  });
}

// 模拟计算器函数进行测试
function simulateCalculatorTest() {
  console.log('\n\n=== 模拟计算器测试（验证投资收益率影响）===\n');
  
  // FVIFA计算函数
  function calculateFVIFA(rate, years) {
    if (rate === 0) return years;
    return (Math.pow(1 + rate, years) - 1) / rate;
  }
  
  // 基础参数
  const baseParams = {
    currentAge: 25,
    retirementAge: 45,
    currentAnnualExpense: 18, // 万元
    currentPassiveIncome: 0,  // 万元
    expectedRetirementPassiveIncome: 4, // 万元
    currentInvestmentAssets: 11, // 万元
    inflationRate: 4, // %
    retirementExpenseRatio: 80, // %
    withdrawalRate: 4 // %
  };
  
  // 测试不同投资收益率
  const testRates = [6, 8, 10, 12]; // 百分比
  
  console.log('投资收益率\t当前资产未来价值\t资金缺口\t\tP值(FVIFA)\t年度投资额');
  console.log('------------------------------------------------------------------------');
  
  testRates.forEach(rate => {
    const years = baseParams.retirementAge - baseParams.currentAge;
    
    // 计算当前资产未来价值
    const currentAssetsFutureValue = baseParams.currentInvestmentAssets * Math.pow(1 + rate / 100, years);
    
    // 简化的资金缺口计算（这里只是为了演示）
    const inflationFactor = Math.pow(1 + baseParams.inflationRate / 100, years);
    const retirementExpense = baseParams.currentAnnualExpense * inflationFactor * (baseParams.retirementExpenseRatio / 100);
    const retirementIncome = baseParams.expectedRetirementPassiveIncome;
    const investmentNeeded = retirementExpense - retirementIncome;
    const totalAssetsNeeded = investmentNeeded / (baseParams.withdrawalRate / 100);
    const fundingGap = totalAssetsNeeded - currentAssetsFutureValue;
    
    // 计算P值（FVIFA）
    const pValue = calculateFVIFA(rate / 100, years);
    
    // 计算年度投资额
    const annualInvestment = fundingGap / pValue;
    
    console.log(`${rate}%\t\t${currentAssetsFutureValue.toFixed(2)}万\t\t${fundingGap.toFixed(2)}万\t\t${pValue.toFixed(2)}\t\t${annualInvestment.toFixed(2)}万`);
  });
  
  console.log('\n预期结果：');
  console.log('1. 投资收益率越高，当前资产未来价值越高');
  console.log('2. 投资收益率越高，资金缺口越小');
  console.log('3. 投资收益率越高，P值（FVIFA）越大');
  console.log('4. 投资收益率越高，年度投资额越小（因为P值更大）');
}

// 运行测试
testFVIFACalculation();
simulateCalculatorTest();