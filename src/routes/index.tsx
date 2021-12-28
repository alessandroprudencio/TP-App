import { CompositeNavigationProp, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loading from '../components/Loading';
import Notification from '../components/Notification';
import { useAuth } from '../context/AuthContext';
import { ChallengeProvider } from '../context/ChallengeContext';
import CategoryScreen from '../screens/Category';
import HomeScreen from '../screens/Home';
import SignInScreen from '../screens/SignIn';
import SignUpScreen from '../screens/SignUp';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type AuthScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamList>,
  StackNavigationProp<RootStackParamList>
>;

export type RootStackParamList = {
  Home: undefined;
  Category: { categoryId: string; categoryName: string };
};

const RootStack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();

const Routes = () => {
  const { isLogged, isLoading } = useAuth();

  if (isLoading) return <Loading />;

  return (
    <NavigationContainer>
      {isLogged ? (
        <ChallengeProvider>
          <Notification>
            <SafeAreaView style={{ flex: 1, marginHorizontal: 15 }}>
              <RootStack.Navigator screenOptions={{ headerShown: false }}>
                <RootStack.Screen name="Home" component={HomeScreen} />
                <RootStack.Screen name="Category" component={CategoryScreen} />
              </RootStack.Navigator>
            </SafeAreaView>
          </Notification>
        </ChallengeProvider>
      ) : (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="SignIn" component={SignInScreen} />
          <AuthStack.Screen name="SignUp" component={SignUpScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Routes;
