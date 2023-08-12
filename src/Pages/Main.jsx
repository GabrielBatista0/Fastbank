import React, { Component, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { withExpoSnack } from 'nativewind';
import { styled } from "nativewind";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Entypo';
import FontAw from 'react-native-vector-icons/FontAwesome5';
import FontA from 'react-native-vector-icons/FontAwesome';
import IconComu from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SERVIDOR} from "@env"
import { data } from 'autoprefixer';

function Main() {
    const[saldo,setSaldo] = useState()
    const[verSaldo,setVerSaldo] = useState()
    const[Token,setToken] = useState({})
    const[cliente,setCliente] = useState("")
    const[data,setData] = useState("")
    const[conta,setConta] = useState("")
    const navigate = useNavigation()

    //https://www.colorhexa.com/00f866
    async function refreshToken(refresh){
        console.log("1po");
        axios
        .post(`${SERVIDOR}auth/jwt/refresh/`, {
            refresh:refresh
        })
        .then(async (res) => {
            console.log(res.data)
            if (res.status == 200) {
                await AsyncStorage.removeItem("Token");
                AsyncStorage.setItem("Token",JSON.stringify({acess:res.data.access,refresh:refresh}))
                pegar()
                }
                else{
                    console.log("erro"+res.data);
                }
                
            }).catch((erro)=> console.log(erro))
    }
    
    async function pegar(){
        const auth = await AsyncStorage.getItem("Token")
        console.log(JSON.parse(auth).acess);
        console.log("po");
        setToken(JSON.parse(auth))
    }

    useEffect(()=>{
        pegar()
    },[])

    
    const mostrarSaldo = () => {
        if(verSaldo){
            setVerSaldo(false);
        }
        else{
            setVerSaldo(true);
        }
    }

    useEffect(()=>{
        if (Token!=undefined) {
            axios
            .get(`${SERVIDOR}auth/users/me/`, {
                headers: { Authorization: `JWT ${Token.acess}`},
                
            })
            .then((res) => {
                console.log(res.status)
                if (res.status == 200) {
                    buscaConta(res.data.id)
                    
                }           
            }).catch((erro)=>{
                console.log(erro.response.status)
                if(erro.response.status ==401){
                    refreshToken(Token.refresh)
                } 
            }
            )
        }
        console.log("DRIBRLEI");
        
    },[Token])


    const buscaConta = (id)=>{
        axios
            .get(`${SERVIDOR}fastbank/conta/${id}`, { headers: { Authorization: `JWT ${Token.acess}`}})
                .then((res) => {
                    console.log(res.data)
                    console.log(res.status)
                    if (res.status == 200) {
                        setConta(res.data)
                        buscaCliente(res.data.id)
                    } 
                }).catch((erro)=>{
                     console.log(erro)
                    if(res.response.status ==401){
                        refreshToken(Token.refresh)
                    }
                    })
    }


    const buscaCliente =(id)=>{
        axios
        .get(`${SERVIDOR}fastbank/clientes/${id}`, { headers: { Authorization: `JWT ${Token.acess}`}})
            .then((res) => {
                console.log(res.data)
                if (res.status == 200) {
                    setCliente(res.data)
                } 
            }).catch((erro)=> {
                console.log(erro)
                if(res.response.status == 401){
                    refreshToken(Token.refresh)
                }
            })
    }

    return ( 
        <>
            <View className="bg-black w-full h-full flex flex-col justify-between">
            <View className="flex flex-row p-2 w-full justify-between">
                    <View className="w-1/2 flex flex-row">
                        <Text className="text-white font-bold text-4xl">B&</Text>
                        <Text className="text-white text-4xl">Bank</Text>
                    </View>
                    <View className="flex flex-row ">
                        <Text className="text-white text-lg mr-3 h-[40px] flex items-baseline">{cliente.nome}</Text>
                        <Image source={{ uri: cliente.foto }} className='w-[45px] h-[45px] rounded-full'></Image>
                    </View>
            </View>
            <View className="bg-[#2cff83] w-full h-[9px]">
            </View>
            <View className="flex justify-center w-full items-center">
            <View className="bg-[#0ACF53] w-[43vh] h-[15vh] rounded-3xl flex mb-14">
                <View className="w-full flex flex-row p-4 justify-between">
                    <Text className="text-white font-semibold text-[15px]">Saldo</Text> 
                    <TouchableOpacity className="flex flex-row items-center" onPress={()=>navigate.navigate('Extrato')}>
                    <Text className="text-white font-semibold text-[15px]">Ver Extrato </Text>
                    <FontAw name='exchange-alt' size={10} color={"white"}/>
                    </TouchableOpacity>
                </View>
                <View className="h-[10vh] w-full flex flex-row p-4 justify-between items-end">
                {verSaldo?<Text className="text-white font-semibold text-3xl ">R$ {conta.saldo}</Text> :<Text className="text-white font-semibold text-3xl ">R$ ------</Text>}
                    <TouchableOpacity onPress={mostrarSaldo}>
                    {verSaldo?<Icon name="eye" size={30} color={"white"}/> : <Icon name="eye-with-line" size={30} color={"white"}/>}
                    </TouchableOpacity>
                </View>
            </View>

            <View className="h-[60vh] w-full bg-[#212121] rounded-t-[40px] p-4">
            <View className="mt-5 h-20 w-full border-b-[1px] border-[#2cff83] rounded-t-[40px]">
                <View className="w-full flex flex-row justify-between">
                <TouchableOpacity onPress={()=>navigate.navigate('Transferir')} ><Image source={require('../../assets/pix.png')} className='w-[35px] h-[35px] rounded-full'></Image></TouchableOpacity>
                <TouchableOpacity><FontAw name='piggy-bank' size={35} color={"white"}/></TouchableOpacity>
                <TouchableOpacity><FontA name='bitcoin' size={35} color={"white"}/></TouchableOpacity>
                <TouchableOpacity><FontA name='credit-card' size={35} color={"white"} onPress={()=>navigate.navigate('Cartao')}/></TouchableOpacity>
                <TouchableOpacity><IconComu name='account-cash' size={35} color={"white"}  onPress={()=>navigate.navigate('PagarConta')}/></TouchableOpacity>
                </View>
                <View className="w-full mt-3 flex flex-row justify-between">
                    <Text className="text-white text-[13px] ml-2">Pix</Text>
                    <Text className="text-white text-[13px] ml-2">PoupAi</Text>
                    <Text className="text-white text-[13px]">Cripto</Text>
                    <Text className="text-white text-[13px]">Cartão</Text>
                    <Text className="text-white text-[13px]">Pagar</Text>
                </View>
            </View>
            <View className="w-full flex items-center"> 
                <View className="w-[90vw] h-[22vh] bg-[#27874f] rounded-3xl mt-4 p-1 flex justify-center flex-row">
                    <Image source={require('../../assets/pensando.png')} className='w-[45vw] h-[22vh] rounded-xl '></Image>  
                    <Text className="p-3 text-white font-bold text-[2vh]">Quer aprender a investir? Nós te ensinamos!</Text>
                </View>
                <View className="w-[90vw] h-[17vh] bg-[#27874f] rounded-3xl mt-4 p-1 flex justify-center flex-row">
                    <Image source={require('../../assets/dinheiro.png')} className='w-[35vw] h-[15vh] rounded-xl '></Image>  
                    <Text className="p-3 text-white font-bold text-[2vh] text-center">Faça o dinheiro trabalhar por você! Aqui rende mais </Text>
                </View>
            </View>
            </View>
            </View>
            </View>
           
        </>
     );
}

export default Main;