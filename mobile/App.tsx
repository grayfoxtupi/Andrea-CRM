import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/pages/Login'
import ForgotPassword from './src/pages/ForgotPassword'
import SignUp from './src/pages/SignUp'
import Dashboard from './src/pages/Dashboard'
import FormLead from './src/pages/FormLead'
import FormTask from './src/pages/FormTask'
import Profile from './src/pages/Profile'
import FormTaskClient from './src/pages/FormTaskClient'
import Notifications from './src/pages/Notifications'
import Schedule from './src/pages/Schedule'



export type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  SignUp: undefined;
  Dashboard: undefined;
  FormLead: undefined;
  FormTask: undefined;
  Profile: undefined; 
  Notifications: undefined;
  Schedule: undefined;
  FormClientTask: undefined;
  Tasks: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();


function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="FormLead" component={FormLead} />
        <Stack.Screen name="FormTask" component={FormTask} />
        <Stack.Screen name="Profile" component={Profile} />

        <Stack.Screen name="FormClientTask" component={FormTaskClient} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Schedule" component={Schedule} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}export default App;
