import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { withExpoSnack } from 'nativewind';
import { styled } from "nativewind";
import { useNavigation } from '@react-navigation/native';
import {SERVIDOR} from "@env"
// import { TextInput } from 'react-native-web';



function Home() {
    const navigate = useNavigation()
    
    return ( 
        <>
        
            <View className="bg-black w-full h-full flex justify-center items-center">
                <View className=" flex items-center justify-center p-3 w-full">
                    <Image source={require('../../assets/bug.png')} className='w-40 h-40'/>
                    <View className="flex flex-row w-full items-center justify-center">
                    <Text className="text-white font-bold text-6xl">B&</Text>
                    <Text className="text-white text-6xl">Bank</Text>
                    </View>
                    {/* <Text className="text-white text-lg mt-6 w-60  mb-10">B&Bank é o melhor banco para seus investimentos diarios em criptomoedas</Text> */}
                </View>
                <View className="w-full flex justify-center items-center">
                        <TouchableOpacity className="bg-[#0ACF53] h-10 w-36 rounded-[20px] flex justify-center items-center mt-9 hover:bg-[#30B561]" onPress={()=>{navigate.navigate('Login')}}><Text className="text-white font-bold text-xl">LOGIN</Text></TouchableOpacity>
                        <TouchableOpacity className="bg-[#0ACF53] h-10 w-36 rounded-[20px]  flex justify-center items-center mt-9 hover:bg-[#30B561]" onPress={()=>{navigate.navigate('Cadastro')}}><Text className="text-white font-bold text-xl">CADASTRAR</Text></TouchableOpacity>
                </View>
                <View className='w-screen flex items-start align-baseline'>
                    {/* <Image source={require('../../assets/moca.png')} className='w-[300px] h-[300px]'/> */}
                </View>
            </View>
           
        </>
     );
}

export default Home;