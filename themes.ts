import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export const MyLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: '#F0F4F7',
    text: '#141b1f',
    secondaryText: '#5A646A',
    surfaceVariant: '#E1E8ED',
    primary: '#007AFF',
    onPrimary: '#FFFFFF',

  },
};

export const MyDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    background: '#141b1f',
    text: '#FFFFFF',
    secondaryText: '#9db3be',
    surfaceVariant: '#2b3940',
    primary: '#b2d4e5',
    onPrimary: '#141b1f',
  },
};