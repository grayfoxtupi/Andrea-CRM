import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import FormTaskClient from '../pages/FormTaskClient';


export type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  SignUp: undefined;
  Dashboard: undefined;
  FormLead: undefined;
  FormTask: { task?: any; isEditing?: boolean; leadId: number };
  Leads: undefined;
  Tasks: { searchTerm?: string, leadId: number };
  Profile: undefined;
  Clients: undefined;
  SideMenu: undefined;
  Notifications: undefined;
  Schedule: undefined;
  FormClientTask: { task?: any; isEditing?: boolean; clientId: number };
  
   
};

export type FormTaskNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'FormTask'
>;

export type TasksNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Tasks'
>;

export type DashboardNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
export type EditProfileNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;
export type TasksRouteProp = RouteProp<RootStackParamList, 'Tasks'>;
export type FormTaskRouteProp = RouteProp<RootStackParamList, 'FormTask'>;



