import React from 'react';
import { Card, Statistic, Descriptions, Row, Col, Typography, Spin, Tooltip } from 'antd';
import { DollarOutlined, TrophyOutlined, LineChartOutlined, CalendarOutlined, ClockCircleOutlined, AimOutlined, RiseOutlined, FileTextOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { CalculationResult } from '../lib/calculator';
import { formatCurrency, formatPercentage, formatNumber } from '../lib/calculator';

const { Title, Text } = Typography;

interface ResultPanelProps {
  result: CalculationResult | null;
  isCalculating: boolean;
}

// 占位数据
const placeholderResult: CalculationResult = {
  annualInvestmentNeeded: 0,
  yearsToRetirement: 0,
  inflationFactor: 0,
  retirementAnnualExpense: 0,
  investmentNeededToCoverExpense: 0,
  totalAssetsNeeded: 0,
  currentAssetsFutureValue: 0,
  fundingGap: 0,
  pValue: 0,
  retirementPassiveIncome: 0
};

export function ResultPanel({ result, isCalculating }: ResultPanelProps) {
  if (isCalculating) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">计算中...</Text>
          </div>
        </div>
      </Card>
    );
  }

  // 使用实际结果或占位数据
  const displayResult = result || placeholderResult;
  const isPlaceholder = !result;

  const monthlyInvestment = displayResult.annualInvestmentNeeded / 12;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* 主要结果 */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TrophyOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            <Title level={4} style={{ margin: 0 }}>计算结果</Title>
            <Tooltip title="计算结果仅供参考，实际投资收益可能因市场波动而有所不同，建议结合个人实际情况和专业理财建议制定投资计划。" placement="top">
              <QuestionCircleOutlined 
                style={{ 
                  marginLeft: 6, 
                  color: '#8c8c8c', 
                  fontSize: '12px',
                  cursor: 'help'
                }} 
              />
            </Tooltip>
          </div>
        }
        style={{ background: '#ffffff', height: 'fit-content' }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Statistic
              title="每年需要投资金额"
              value={isPlaceholder ? '¥--' : displayResult.annualInvestmentNeeded}
              precision={isPlaceholder ? 0 : 2}
              prefix={isPlaceholder ? '' : '¥'}
              suffix={isPlaceholder ? '' : '元'}
              valueStyle={{ color: '#000000', fontSize: '28px', fontWeight: 'bold' }}
            />
          </Col>
          <Col xs={24} md={12}>
            <Statistic
              title="每月需要投资金额"
              value={isPlaceholder ? '¥--' : monthlyInvestment}
              precision={isPlaceholder ? 0 : 2}
              prefix={isPlaceholder ? '' : '¥'}
              suffix={isPlaceholder ? '' : '元'}
              valueStyle={{ color: '#000000', fontSize: '28px', fontWeight: 'bold' }}
            />
          </Col>
        </Row>
      </Card>

      {/* 详细计算步骤 */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FileTextOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            <Title level={4} style={{ margin: 0 }}>计算详情</Title>
          </div>
        }
        style={{ background: '#ffffff', height: 'fit-content' }}
      >
        <Descriptions
          bordered
          column={2}
          items={[
            {
              key: '1',
              label: (
                <span>
                  距离退休年数
                  <Tooltip title="从当前年龄到计划退休年龄的时间差" placement="top">
                    <QuestionCircleOutlined 
                      style={{ 
                        marginLeft: 6, 
                        color: '#8c8c8c', 
                        fontSize: '12px',
                        cursor: 'help'
                      }} 
                    />
                  </Tooltip>
                </span>
              ),
              children: isPlaceholder ? '--' : `${formatNumber(displayResult.yearsToRetirement)} 年`,
            },
            {
              key: '2',
              label: (
                <span>
                  通胀因子
                  <Tooltip title="考虑通胀影响的系数，用于计算未来购买力" placement="top">
                    <QuestionCircleOutlined 
                      style={{ 
                        marginLeft: 6, 
                        color: '#8c8c8c', 
                        fontSize: '12px',
                        cursor: 'help'
                      }} 
                    />
                  </Tooltip>
                </span>
              ),
              children: isPlaceholder ? '--' : formatNumber(displayResult.inflationFactor),
            },
            {
              key: '3',
              label: (
                <span>
                  退休时年开支
                  <Tooltip title="考虑通胀后，退休时的年度生活开支" placement="top">
                    <QuestionCircleOutlined 
                      style={{ 
                        marginLeft: 6, 
                        color: '#8c8c8c', 
                        fontSize: '12px',
                        cursor: 'help'
                      }} 
                    />
                  </Tooltip>
                </span>
              ),
              children: isPlaceholder ? '--' : formatCurrency(displayResult.retirementAnnualExpense),
            },
            {
              key: '4',
              label: (
                <span>
                  退休后净开支
                  <Tooltip title="退休后年开支减去被动收入后的净支出" placement="top">
                    <QuestionCircleOutlined 
                      style={{ 
                        marginLeft: 6, 
                        color: '#8c8c8c', 
                        fontSize: '12px',
                        cursor: 'help'
                      }} 
                    />
                  </Tooltip>
                </span>
              ),
              children: isPlaceholder ? '--' : formatCurrency(displayResult.investmentNeededToCoverExpense),
            },
            {
              key: '5',
              label: (
                <span>
                  所需总资产
                  <Tooltip title="退休时需要的总投资资产，按提取率计算" placement="top">
                    <QuestionCircleOutlined 
                      style={{ 
                        marginLeft: 6, 
                        color: '#8c8c8c', 
                        fontSize: '12px',
                        cursor: 'help'
                      }} 
                    />
                  </Tooltip>
                </span>
              ),
              children: isPlaceholder ? '--' : formatCurrency(displayResult.totalAssetsNeeded),
            },
            {
              key: '6',
              label: (
                <span>
                  当前资产未来值
                  <Tooltip title="当前投资资产按投资收益率增长到退休时的价值" placement="top">
                    <QuestionCircleOutlined 
                      style={{ 
                        marginLeft: 6, 
                        color: '#8c8c8c', 
                        fontSize: '12px',
                        cursor: 'help'
                      }} 
                    />
                  </Tooltip>
                </span>
              ),
              children: isPlaceholder ? '--' : formatCurrency(displayResult.currentAssetsFutureValue),
            },
            {
              key: '7',
              label: (
                <span>
                  资金缺口
                  <Tooltip title="当前投资资产与退休所需资产的差额" placement="top">
                    <QuestionCircleOutlined 
                      style={{ 
                        marginLeft: 6, 
                        color: '#8c8c8c', 
                        fontSize: '12px',
                        cursor: 'help'
                      }} 
                    />
                  </Tooltip>
                </span>
              ),
              children: isPlaceholder ? '--' : formatCurrency(displayResult.fundingGap),
            },
            {
              key: '9',
              label: (
                <span>
                  退休时被动收入
                  <Tooltip title="考虑通胀后，退休时的年度被动收入" placement="top">
                    <QuestionCircleOutlined 
                      style={{ 
                        marginLeft: 6, 
                        color: '#8c8c8c', 
                        fontSize: '12px',
                        cursor: 'help'
                      }} 
                    />
                  </Tooltip>
                </span>
              ),
              children: isPlaceholder ? '--' : formatCurrency(displayResult.retirementPassiveIncome),
            },
          ]}
        />
      </Card>

      {/* 投资建议 */}
      <Card style={{ background: '#ffffff', height: 'fit-content' }}>
        <Text style={{ fontSize: '16px', lineHeight: '1.6' }}>
          <Text strong style={{ fontSize: '16px', color: '#000000' }}>投资建议：</Text>
          根据您的财务状况和退休规划，建议您每年投资 <Text strong style={{ color: isPlaceholder ? '#d9d9d9' : '#1890ff', fontSize: '16px' }}>{formatCurrency(displayResult.annualInvestmentNeeded)}</Text>（即每月 <Text strong style={{ color: isPlaceholder ? '#d9d9d9' : '#1890ff', fontSize: '16px' }}>{formatCurrency(monthlyInvestment)}</Text>），坚持 <Text strong style={{ color: isPlaceholder ? '#d9d9d9' : '#1890ff', fontSize: '16px' }}>{formatNumber(displayResult.yearsToRetirement)}</Text> 年的投资计划。通过持续投资，您的当前资产将增长至 <Text strong style={{ color: isPlaceholder ? '#d9d9d9' : '#1890ff', fontSize: '16px' }}>{formatCurrency(displayResult.currentAssetsFutureValue)}</Text>，加上新增投资，退休时预计总资产将达到 <Text strong style={{ color: isPlaceholder ? '#d9d9d9' : '#1890ff', fontSize: '16px' }}>{formatCurrency(displayResult.totalAssetsNeeded)}</Text>，足以支撑您的退休生活。
        </Text>
      </Card>
    </div>
  );
}