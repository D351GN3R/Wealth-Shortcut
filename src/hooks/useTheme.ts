import { useState, useEffect } from 'react';
import { theme } from 'antd';

export type ThemeMode = 'auto' | 'light' | 'dark';

interface ThemeConfig {
  mode: ThemeMode;
  algorithm: typeof theme.defaultAlgorithm | typeof theme.darkAlgorithm;
  isDark: boolean;
}

const THEME_STORAGE_KEY = 'retirement-calculator-theme';

// 检测系统主题
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

// 获取实际应用的主题
const getActualTheme = (mode: ThemeMode): 'light' | 'dark' => {
  if (mode === 'auto') {
    return getSystemTheme();
  }
  return mode;
};

export const useTheme = () => {
  // 从 localStorage 读取保存的主题模式，默认为 'auto'
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'auto';
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return (saved as ThemeMode) || 'auto';
    } catch {
      return 'auto';
    }
  });

  // 监听系统主题变化
  useEffect(() => {
    if (mode !== 'auto' || typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // 强制重新渲染以更新主题
      setMode('auto');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  // 保存主题模式到 localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error);
    }
  }, [mode]);

  // 设置 data-theme 属性到 document.documentElement
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const actualTheme = getActualTheme(mode);
    document.documentElement.setAttribute('data-theme', actualTheme);
  }, [mode]);

  // 计算当前主题配置
  const actualTheme = getActualTheme(mode);
  const isDark = actualTheme === 'dark';
  
  const themeConfig: ThemeConfig = {
    mode,
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    isDark,
  };

  return {
    ...themeConfig,
    setMode,
  };
};