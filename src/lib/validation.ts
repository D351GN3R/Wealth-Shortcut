import { CalculationParams } from './calculator';

// 验证错误类型
export interface ValidationErrors {
  [key: string]: string | null;
}

// 验证规则接口
interface ValidationRule {
  field: keyof CalculationParams;
  validate: (value: number, params: CalculationParams) => string | null;
}

// 验证规则定义
const VALIDATION_RULES: ValidationRule[] = [
  {
    field: 'currentAge',
    validate: (value) => {
      if (isNaN(value) || value < 18 || value > 100) {
        return '当前年龄必须在18-100岁之间';
      }
      return null;
    }
  },
  {
    field: 'retirementAge',
    validate: (value, params) => {
      if (isNaN(value)) {
        return '请输入有效的退休年龄';
      }
      if (value <= params.currentAge) {
        return '退休年龄必须大于当前年龄';
      }
      if (value > 100) {
        return '退休年龄不能超过100岁';
      }
      return null;
    }
  },
  {
    field: 'currentAnnualExpense',
    validate: (value) => {
      if (isNaN(value) || value < 0) {
        return '年生活开支不能为负数';
      }
      return null;
    }
  },
  {
    field: 'currentPassiveIncome',
    validate: (value) => {
      if (isNaN(value) || value < 0) {
        return '被动收入不能为负数';
      }
      return null;
    }
  },
  {
    field: 'expectedRetirementPassiveIncome',
    validate: (value) => {
      if (isNaN(value) || value < 0) {
        return '退休后被动收入不能为负数';
      }
      return null;
    }
  },
  {
    field: 'currentInvestmentAssets',
    validate: (value) => {
      if (isNaN(value) || value < 0) {
        return '当前投资资产不能为负数';
      }
      return null;
    }
  },
  {
    field: 'inflationRate',
    validate: (value) => {
      if (isNaN(value) || value < 0 || value > 20) {
        return '通胀率应在0-20%之间';
      }
      return null;
    }
  },
  {
    field: 'investmentReturn',
    validate: (value) => {
      if (isNaN(value) || value < 0 || value > 30) {
        return '投资收益率应在0-30%之间';
      }
      return null;
    }
  },
  {
    field: 'retirementExpenseRatio',
    validate: (value) => {
      if (isNaN(value) || value < 0 || value > 200) {
        return '退休后开支比例应在0-200%之间';
      }
      return null;
    }
  },
  {
    field: 'withdrawalRate',
    validate: (value) => {
      if (isNaN(value) || value < 0 || value > 10) {
        return '资产提取率应在0-10%之间';
      }
      return null;
    }
  }
];

// 验证单个字段
export function validateField(
  field: keyof CalculationParams,
  value: number,
  params: CalculationParams
): string | null {
  const rule = VALIDATION_RULES.find(r => r.field === field);
  if (!rule) return null;
  
  return rule.validate(value, params);
}

// 验证所有字段
export function validateAllFields(params: CalculationParams): ValidationErrors {
  const errors: ValidationErrors = {};
  
  VALIDATION_RULES.forEach(rule => {
    const error = rule.validate(params[rule.field], params);
    errors[rule.field] = error;
  });
  
  return errors;
}

// 检查是否有验证错误
export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.values(errors).some(error => error !== null);
}

// 获取第一个错误信息
export function getFirstError(errors: ValidationErrors): string | null {
  const firstError = Object.values(errors).find(error => error !== null);
  return firstError || null;
}