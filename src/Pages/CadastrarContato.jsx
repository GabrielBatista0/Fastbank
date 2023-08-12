import React, { Component, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { withExpoSnack } from 'nativewind';
import { TextInput } from 'react-native';
import axios from 'axios';
import Input from './components/Input';
import { useNavigation } from '@react-navigation/native';
import {SERVIDOR} from "@env"
import BtnVoltar from './components/BtnVoltar';


function CadastroContato() {
    const[email,setEmail] = useState()
    const[Token,setToken] = useState({})
    const[ramal,setRamal] = useState()
    const[telefone,setTelefone] = useState()
    const navigate = useNavigation()


    
    async function PegarToken(){
        const auth = await AsyncStorage.getItem("Token")
        console.log(JSON.parse(auth).acess);
        setToken(JSON.parse(auth))
    }

    useEffect(()=>{
        PegarToken()
    },[])

    const CadastrarContato = () => {
        axios.post(`${SERVIDOR}fastbank/contato/`,{
            telefone: telefone,
            ramal:ramal,
            observacao:null,
            email:email,
            cliente:' ',

        },{headers: { Authorization: `JWT ${Token.acess}`}})
        .then((res)=>{
        console.log(res)
            if(res.status== 200 || res.status == 201){
                navigate.navigate('Nav')
            }

        }).catch((erro)=>{
        console.log(erro)
        })
    }
     



    return ( 
        <>
           <View className='bg-black w-full h-full'>
            <View className='w-full flex flex-row h-1/3 items-center justify-center'>
            <Image source={require('../../assets/bug.png')} className='w-20 h-20'></Image>
                <Text className="text-white font-bold text-5xl">B&</Text>
                <Text className="text-white text-5xl">Bank</Text>
            </View>
            <View className='flex justify-center items-center'>
            <View className='w-[90%] p-3 flex items-center border-[#0ACF53] border-[1px] rounded-2xl'>
                <Text className='text-white font-medium text-lg mb-5'>Criar Nova Conta:</Text>
                <Input placeholder='Email' onChangeText={(e)=>setEmail(e)}></Input>
                <Input placeholder='Ramal' onChangeText={(e)=>setRamal(e)}></Input>
                <Input placeholder='DDD+Tel' onChangeText={(e)=>setTelefone(e)}></Input>
                {/* <Input placeholder='Observação Ex. Telefone comercial' onChangeText={(e)=>setObservacao(e)}></Input> */}
            </View>
            </View>
            <View className='w-full flex items-center'>
            <TouchableOpacity className="bg-[#0ACF53] h-10 w-36 rounded-[20px] mb-[43px] flex justify-center items-center mt-9 hover:bg-[#30B561]" onPress={CadastrarContato}><Text className="text-white font-t text-xl">Cadastrar</Text></TouchableOpacity>
            </View>


           </View>
        </>
     );
}

export default CadastroContato