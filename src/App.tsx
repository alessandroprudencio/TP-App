import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './context/AuthContext';
import Routes from './routes';

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      secondary: string;
      grey: string;
      grey2: string;
      grey3: string;
      smallText: string;
    }
  }
}

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#047553',
    smallText: '#999',
    secondary: '#04AB79',
    black: '#000',
    grey: '#C4C4C4',
    grey2: '#BBB9B9',
    grey3: '#E4E4E4',
  },
  roundness: 10,
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </PaperProvider>
  );
}
