import React from 'react';
import { ConfigProvider, Segmented } from 'antd';
import { theme } from 'antd';
import { SunOutlined, MoonOutlined, DesktopOutlined } from '@ant-design/icons';
import { CalculatorContainer } from './components/CalculatorContainer';
import { useTheme, type ThemeMode } from './hooks/useTheme';

function App() {
  const { algorithm, mode, setMode } = useTheme();

  const themeOptions = [
    {
      label: <SunOutlined />,
      value: 'light' as ThemeMode,
      title: '浅色模式',
    },
    {
      label: <MoonOutlined />,
      value: 'dark' as ThemeMode,
      title: '深色模式',
    },
    {
      label: <DesktopOutlined />,
      value: 'auto' as ThemeMode,
      title: '跟随系统',
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm,
        token: {
          colorPrimary: '#1890ff',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          colorBgLayout: algorithm === theme.darkAlgorithm ? '#000000' : '#f5f5f5',
        },
        components: {
          Card: {
            borderRadius: 8,
            boxShadow: 'none',
            colorBgContainer: algorithm === theme.darkAlgorithm ? '#141414' : '#ffffff',
            borderColor: 'transparent',
            colorBorderSecondary: 'transparent',
            colorBorder: 'transparent',
            lineWidth: 0,
            lineType: 'none',
            borderWidth: 0,
          },
          Button: {
            borderRadius: 6,
          },
          InputNumber: {
            borderRadius: 6,
          },
        },
      }}
    >
      <div className="App" style={{ minHeight: '100vh', backgroundColor: algorithm === theme.darkAlgorithm ? '#000000' : '#f5f5f5' }}>
        {/* 主题切换器 */}
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
        }}>
          <Segmented
            options={themeOptions}
            value={mode}
            onChange={(value) => setMode(value as ThemeMode)}
            size="small"
          />
        </div>
        <CalculatorContainer />
      </div>
    </ConfigProvider>
  );
}

export default App
