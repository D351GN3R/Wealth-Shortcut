import { ConfigProvider, theme } from 'antd';
import { CalculatorContainer } from './components/CalculatorContainer';
import 'antd/dist/reset.css';

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          colorBgContainer: '#ffffff',
          colorBgLayout: '#f5f5f5',
          colorText: '#262626',
          colorTextSecondary: '#595959',
          borderRadius: 8,
          fontSize: 14,
        },
        components: {
          Card: {
            colorBgContainer: '#ffffff',
            boxShadowTertiary: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
          },
          Button: {
            colorPrimary: '#1890ff',
            algorithm: true,
          },
        },
      }}
    >
      <CalculatorContainer />
    </ConfigProvider>
  );
}

export default App
