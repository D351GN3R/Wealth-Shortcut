import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { CalculationParams, CalculationResult, DEFAULT_PARAMS, calculateRetirementInvestment } from '../lib/calculator';
import { ValidationErrors, validateField, validateAllFields, hasValidationErrors } from '../lib/validation';
import { InputPanel } from './InputPanel';
import { ResultPanel } from './ResultPanel';
import { CalculatorOutlined } from '@ant-design/icons';



export function CalculatorContainer() {
  // 状态管理
  const [params, setParams] = useState<CalculationParams>(DEFAULT_PARAMS);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  // 跟踪用户手动输入过的字段
  const [userInputFields, setUserInputFields] = useState<Set<keyof CalculationParams>>(new Set());

  // 参数变更处理
  const handleParamChange = useCallback((field: keyof CalculationParams, value: number) => {
    // 标记该字段为用户手动输入过
    setUserInputFields(prev => new Set(prev).add(field));
    
    setParams(prev => {
      const newParams = { ...prev, [field]: value };
      
      // 实时验证当前字段，传入用户输入状态（该字段现在被认为是用户输入过的）
      const fieldError = validateField(field, value, newParams, true);
      setErrors(prevErrors => ({
        ...prevErrors,
        [field]: fieldError
      }));
      
      return newParams;
    });
  }, []);

  // 手动计算结果
  const handleCalculate = useCallback(async () => {
    setIsCalculating(true);
    
    try {
      // 验证所有字段，传入用户输入状态
      const allErrors: ValidationErrors = {};
      Object.keys(params).forEach(key => {
        const field = key as keyof CalculationParams;
        const hasUserInput = userInputFields.has(field) || params[field] !== 0;
        allErrors[field] = validateField(field, params[field], params, hasUserInput);
      });
      setErrors(allErrors);
      
      // 如果有验证错误，不进行计算
      if (hasValidationErrors(allErrors)) {
        setResult(null);
        return;
      }
      
      // 模拟异步计算（实际计算很快，但为了用户体验添加短暂延迟）
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const calculationResult = calculateRetirementInvestment(params);
      setResult(calculationResult);
    } catch (error) {
      console.error('计算错误:', error);
      setResult(null);
    } finally {
      setIsCalculating(false);
    }
  }, [params, userInputFields]);

  // 重置参数
  const handleReset = useCallback(() => {
    setParams(DEFAULT_PARAMS);
    setErrors({});
    setResult(null);
    setUserInputFields(new Set());
  }, []);





  return (
    <div className="min-h-screen py-8" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ width: '100%', maxWidth: '100%' }}>
        {/* 头部 */}
        <div className="text-center mb-8 mt-8">
          <div className="flex items-center justify-center mb-2">
            <CalculatorOutlined style={{ fontSize: '32px', color: '#1890ff', marginRight: '12px' }} />
            <h1 className="text-3xl font-bold" style={{ color: 'inherit' }}>退休财务自由计算器</h1>
          </div>
          <p className="max-w-2xl mx-auto" style={{ opacity: 0.7, color: 'inherit' }}>
            通过科学的计算方法，帮助您规划退休投资计划，实现财务自由目标
          </p>
        </div>

        {/* 主要内容 */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <style>
            {`
              .calculator-layout {
                display: grid;
                grid-template-columns: 2fr 3fr;
                gap: 12px;
                width: 100%;
                max-width: 100%;
              }
              
              @media (max-width: 599px) {
                .calculator-layout {
                  grid-template-columns: 1fr;
                  gap: 16px;
                  width: 100%;
                  max-width: 100%;
                  overflow-x: hidden;
                }
                .calculator-layout > div {
                  width: 100%;
                  max-width: 100%;
                  overflow-x: hidden;
                  box-sizing: border-box;
                }
              }
              
              /* 确保大于768px时保持原有布局 */
              @media (min-width: 768px) {
                .calculator-layout {
                  grid-template-columns: 2fr 3fr;
                  gap: 12px;
                }
              }
            `}
          </style>
          <div className="calculator-layout">
            {/* 左侧：输入面板 */}
            <div>
              <InputPanel
                params={params}
                onChange={handleParamChange}
                errors={errors}
                onReset={handleReset}
                onCalculate={handleCalculate}
                isCalculating={isCalculating}
              />
            </div>

            {/* 右侧：结果面板 */}
            <div style={{ display: 'flex', flexDirection: 'column', height: 'fit-content' }}>
              <ResultPanel 
                result={result} 
              />
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}