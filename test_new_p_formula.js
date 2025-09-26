// 测试新的P值计算公式
// 直接实现P值计算函数来验证

// P值计算函数 - 新公式
// 公式：P = [(1+i)^(n+1) - 1]*10
function getPValue(investmentReturnRate, yearsToRetirement) {
  const i = investmentReturnRate / 100;
  
  if (i === 0) {
    return (yearsToRetirement + 1) * 10;
  }
  
  const pValue = (Math.pow(1 + i, yearsToRetirement + 1) - 1) * 10;
  return pValue;
}

// 用户提供的测试数据
const testData = {
  currentAge: 25,
  retirementAge: 50,
  currentAnnualExpenses: 180000,
  currentPassiveIncome: 0,
  currentAssets: 0,
  inflationRate: 3,
  investmentReturnRate: 10,
  postRetirementExpenseRatio: 70,
  withdrawalRate: 4
};

console.log('=== 测试新的P值计算公式 ===');
console.log('测试数据:', testData);
console.log('');

// 计算参数
const i = testData.investmentReturnRate / 100; // 0.1
const n = testData.retirementAge - testData.currentAge; // 25年

// 手动计算P值验证
const expectedP = (Math.pow(1 + i, n + 1) - 1) * 10;

console.log('手动计算P值:');
console.log(`公式: P = [(1+${i})^(${n}+1) - 1]*10`);
console.log(`计算: P = [(1.1)^26 - 1]*10`);
console.log(`1.1^26 = ${Math.pow(1.1, 26).toFixed(6)}`);
console.log(`(1.1^26 - 1) = ${(Math.pow(1.1, 26) - 1).toFixed(6)}`);
console.log(`结果: P = ${expectedP.toFixed(2)}`);
console.log('');

// 使用函数计算
const calculatedP = getPValue(testData.investmentReturnRate, n);
console.log('函数计算P值:');
console.log(`结果: P = ${calculatedP.toFixed(2)}`);
console.log('');

// 验证P值是否接近用户期望的109
console.log('=== P值对比 ===');
console.log(`用户期望P值: 109`);
console.log(`新公式计算P值: ${calculatedP.toFixed(2)}`);
console.log(`差异: ${Math.abs(109 - calculatedP).toFixed(2)}`);
console.log(`差异百分比: ${(Math.abs(109 - calculatedP) / 109 * 100).toFixed(2)}%`);

// 测试不同的投资收益率
console.log('');
console.log('=== 不同投资收益率的P值 ===');
const rates = [8, 9, 10, 11, 12];
rates.forEach(rate => {
  const p = getPValue(rate, 25);
  console.log(`${rate}%收益率，25年: P = ${p.toFixed(2)}`);
});