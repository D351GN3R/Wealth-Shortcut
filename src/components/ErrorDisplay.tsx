import React, { useState } from 'react';
import { Alert, Typography, Collapse } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ValidationErrors, hasValidationErrors, getFirstError } from '../lib/validation';

const { Text } = Typography;
const { Panel } = Collapse;

interface ErrorDisplayProps {
  errors: ValidationErrors;
}

export function ErrorDisplay({ errors }: ErrorDisplayProps) {
  const [visible, setVisible] = useState(true);

  if (!hasValidationErrors(errors) || !visible) {
    return null;
  }

  const firstError = getFirstError(errors);
  const errorCount = Object.values(errors).filter(error => error !== null).length;
  const allErrors = Object.entries(errors)
    .filter(([, error]) => error !== null)
    .map(([field, error]) => ({ field, error }));

  return (
    <div 
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        maxWidth: '400px',
        width: 'auto'
      }}
    >
      <Alert
        message={`输入验证错误 (${errorCount} 个错误)`}
        description={
          <div>
            {firstError && (
              <Text style={{ display: 'block', marginBottom: 8 }}>
                {firstError}
              </Text>
            )}
            {errorCount > 1 && (
              <Collapse
                ghost
                size="small"
                items={[
                  {
                    key: '1',
                    label: '查看所有错误',
                    children: (
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {allErrors.map(({ field, error }) => (
                          <li key={field} style={{ marginBottom: 4 }}>
                            <Text type="danger">{error}</Text>
                          </li>
                        ))}
                      </ul>
                    ),
                  },
                ]}
              />
            )}
          </div>
        }
        type="error"
        icon={<ExclamationCircleOutlined />}
        showIcon
        closable
        onClose={() => setVisible(false)}
      />
    </div>
  );
}