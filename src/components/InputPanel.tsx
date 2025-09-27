import React from 'react';
import { Card, Form, InputNumber, Button, Row, Col, Typography, Tooltip } from 'antd';
import { ReloadOutlined, SettingOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { CalculationParams } from '../lib/calculator';
import { ValidationErrors } from '../lib/validation';

const { Title } = Typography;

interface InputPanelProps {
  params: CalculationParams;
  onChange: (field: keyof CalculationParams, value: number) => void;
  errors: ValidationErrors;
  onReset: () => void;
  onCalculate: () => void;
  isCalculating: boolean;
}

export function InputPanel({ params, onChange, errors, onReset, onCalculate, isCalculating }: InputPanelProps) {
  const formItems = [
    {
      key: 'currentAge',
      label: '当前年龄',
      value: params.currentAge,
      unit: '岁',
      min: 0,
      max: 100,
      placeholder: '请输入',
      tooltip: '您目前的实际年龄，用于计算距离退休的时间'
    },
    {
      key: 'retirementAge',
      label: '计划退休年龄',
      value: params.retirementAge,
      unit: '岁',
      min: params.currentAge + 1,
      max: 100,
      placeholder: '请输入',
      tooltip: '您希望退休的年龄，通常在55-65岁之间'
    },
    {
      key: 'currentAnnualExpense',
      label: '当前年生活开支',
      value: params.currentAnnualExpense,
      unit: '万元',
      min: 0,
      step: 0.1,
      placeholder: '请输入',
      tooltip: '您目前每年的生活费用支出，包括衣食住行等基本开销'
    },
    {
      key: 'currentPassiveIncome',
      label: '当前被动收入',
      value: params.currentPassiveIncome,
      unit: '万元/年',
      min: 0,
      step: 0.1,
      placeholder: '请输入',
      tooltip: '不需要主动工作就能获得的收入，如租金、股息、利息等'
    },
    {
      key: 'currentInvestmentAssets',
      label: '当前投资资产',
      value: params.currentInvestmentAssets,
      unit: '万元',
      min: 0,
      step: 0.1,
      placeholder: '请输入',
      tooltip: '您目前用于投资的资产总额，包括股票、基金、债券等'
    },
    {
      key: 'investmentReturn',
      label: '投资收益率',
      value: params.investmentReturn,
      unit: '%',
      min: 0,
      max: 30,
      step: 0.1,
      placeholder: '请输入',
      tooltip: '预期的年投资收益率，股票型基金通常在6-10%之间'
    },
    {
      key: 'expectedRetirementPassiveIncome',
      label: '退休后预期被动收入',
      value: params.expectedRetirementPassiveIncome,
      unit: '万元/年',
      min: 0,
      step: 0.1,
      placeholder: '请输入',
      tooltip: '退休后预计每年能获得的被动收入，如养老金、租金收入等'
    },
    {
      key: 'retirementExpenseRatio',
      label: '退休后开支比例',
      value: params.retirementExpenseRatio,
      unit: '%',
      min: 0,
      max: 200,
      step: 1,
      placeholder: '请输入',
      tooltip: '退休后生活开支相对于当前开支的比例，通常在70-80%之间'
    },
    {
      key: 'inflationRate',
      label: '通胀率',
      value: params.inflationRate,
      unit: '%',
      min: 0,
      max: 20,
      step: 0.1,
      placeholder: '请输入',
      tooltip: '预期的年通胀率，通常在2-4%之间，用于计算未来购买力'
    },
    {
      key: 'withdrawalRate',
      label: '资产提取率',
      value: params.withdrawalRate,
      unit: '%',
      min: 0,
      max: 10,
      step: 0.1,
      placeholder: '请输入',
      tooltip: '退休后每年从投资资产中提取的比例，通常建议在3-4%之间'
    }
  ];

  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SettingOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            <Title level={4} style={{ margin: 0 }}>数据设置</Title>
          </div>
          <Button
            type="default"
            icon={<ReloadOutlined />}
            onClick={onReset}
            size="small"
          >
            重置
          </Button>
        </div>
      }
      style={{ marginBottom: 24 }}
    >
      <Form layout="vertical">
        <Row gutter={[24, 1]}>
          {formItems.map((item) => (
            <Col xs={24} md={12} key={item.key}>
              <Form.Item
                label={
                  <span>
                    {item.label}
                    <Tooltip title={item.tooltip} placement="top">
                      <QuestionCircleOutlined 
                        style={{ 
                          marginLeft: 6, 
                          color: '#8c8c8c', 
                          fontSize: '14px',
                          cursor: 'help'
                        }} 
                      />
                    </Tooltip>
                  </span>
                }
                validateStatus={errors[item.key as keyof ValidationErrors] ? 'error' : ''}
                help={errors[item.key as keyof ValidationErrors] === 'EMPTY_FIELD' ? '' : errors[item.key as keyof ValidationErrors]}
              >
                <InputNumber
                  value={isNaN(item.value) ? undefined : item.value}
                  onChange={(value) => onChange(item.key as keyof CalculationParams, value || 0)}
                  placeholder={item.placeholder}
                  min={item.min}
                  max={item.max}
                  step={item.step || 1}
                  style={{ width: '100%' }}
                  size="large"
                  addonAfter={item.unit}
                />
              </Form.Item>
            </Col>
          ))}
        </Row>
        
        {/* 开始计算按钮 */}
        <div style={{ marginTop: '21px' }}>
          <Button 
            type="primary" 
            size="large" 
            block
            loading={isCalculating}
            onClick={onCalculate}
            style={{ height: '48px', fontSize: '16px' }}
          >
            开始计算
          </Button>
        </div>
      </Form>
    </Card>
  );
}