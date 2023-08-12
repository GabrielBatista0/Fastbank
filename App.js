
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { withExpoSnack } from 'nativewind';
import { styled } from "nativewind";
import Home from './src/Pages/Home';
import MyStack from './routers';
import Login from './src/Pages/Login';
import Cadastrar from './src/Pages/Cadastrar';
import Main from './src/Pages/Main';
import { NativeWindStyleSheet } from "nativewind";

NativeWindStyleSheet.setOutput({
  default: "native",
});


export default function App() {
  return (
     <>
      <MyStack/>
     </>                      
  );
}
