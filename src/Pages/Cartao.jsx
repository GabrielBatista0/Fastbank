// import React from 'react';
import { withExpoSnack } from 'nativewind';
import { useState,useEffect } from 'react';
import { View,Image,TextInput, TouchableOpacity, Text, Alert} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Entypo';
import FontAw from 'react-native-vector-icons/FontAwesome5';
import FontA from 'react-native-vector-icons/FontAwesome';
import IconComu from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SERVIDOR} from "@env"


const Cartao = () => {
    const[cartao,setCartao] = useState(false)
    const[token,setToken] = useState("")
    const[aceitar,setAceitar] = useState('')
    const[cliente,setCliente] = useState('')
    const[contaCartao,setContaCartao] = useState('')
    const[user,setUser] = useState('')
 
    
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

    
    useEffect(()=>{
        if (token!=undefined) {  
            axios
            .get(`${SERVIDOR}auth/users/me/`, {
                headers: { Authorization: `JWT ${token.acess}`},
            })
            .then((res) => {
                console.log(res.data)
                setUser(res.data)
                BuscarCartao(res.data.id)
                
            }).catch((erro)=> {
                console.log(erro)
                if(erro.response.status ==401){
                    refreshToken(token.refresh)
                } 
            })
        }
            
    },[token])



const BuscarCliente = async(id)=>{
    axios.get(`${SERVIDOR}fastbank/clientes/${id}`,{headers: { Authorization: `JWT ${token.acess}`}})
        .then((res)=>{
        console.log(res.data)  
        setCliente(res.data)
        })
        .catch((erro)=>{
            console.log(erro)
            if(erro.response.status ==401){
                refreshToken(token.refresh)
            } 
        })
}


const BuscarCartao = (id)=>{
    let dados = []
    axios.get(`${SERVIDOR}fastbank/cartao/?conta=${id}`,{headers: { Authorization: `JWT ${token.acess}`}})
        .then((res)=>{
        console.log(res.data) 
        dados.push(res.data)
        if (res.status == 200 && dados.length > 0) {
            setContaCartao(res.data[0])
            BuscarCliente(id)
            setCartao(true)
        }
        })
        .catch((erro)=>{
            console.log(erro)
            if(erro.response.status ==401){
                refreshToken(token.refresh)
            } 
        })
}



const pedirCartao=()=>{
    axios.post(`${SERVIDOR}fastbank/cartao/`,{
        numero : 1,
        limite : 1,
        cvv : 1,
        validade:'2023-12-31',
        bandeira : "MasterCard",
        situacao :"B",
        conta :"ContaObject"

    },{headers: { Authorization: `JWT ${token.acess}`}})
    .then((res)=>{
        console.log(res.data);
        setContaCartao(res.data)
        verificarEndereco(res.data.conta)

    }).catch((erro)=>{
        console.log(erro)
        if(erro.response.status ==401){
            refreshToken(token.refresh)
        } 
    })

}

const verificarEndereco=(id)=>{
    console.log(token.acess);
    axios.get(`${SERVIDOR}fastbank/endereco/${id}`,{headers: { Authorization: `JWT ${token.acess}`}})
    .then((res)=>{
        console.log(res.data)  
        if(res.status== 200 || res.status == 201){
            alert(`Seu cartão será enviado para o endereco:\n
            Cidade: ${res.data.cidade}\n
            Rua:${res.data.logradouro}\n
            Numero: ${res.data.n_casa}
            `)
            Alert.alert(`Seu cartão será enviado para o endereco:\n
            Cidade: ${res.data.cidade}\n
            Rua:${res.data.logradouro}\n
            Numero: ${res.data.n_casa}
            `)
            setCartao(true)
            BuscarCliente(id)
        }
        }).catch((erro)=>{
        console.log(erro)
        if(erro.response.status ==401){
            refreshToken(token.refresh)
        } 
        })


}


    return ( 
        <>  
        {
            cartao == false?
                <View className="bg-black w-full h-full flex justify-between">
                    <View className="w-full flex justify-center items-center h-1/3">
                        <View className="w-[351px] h-[25vh] bg-[#ccc4c4a4] rounded-3xl mt-4 p-1 flex justify-center flex-row items-center ">
                            <Text className="text-white font-bold">Você ainda não possui um Cartão B&bank </Text>
                        </View>
                        {/* <View className="w-[351px] h-[25vh] bg-[#212121] rounded-3xl mt-4 p-1 flex justify-center flex-row">
                            
                        </View> */}
                    </View>
            
                    <View className="flex w-full items-center justify-center rounded-t-2xl  h-2/4 bg-[#221c1c]">
                        <Text className="text-white font-bold text-lg w-full text-center">Deseja fazer parte da família e pedir um cartão B& bank?
                        </Text>
                    <TouchableOpacity className="bg-[#0ACF53] h-16 w-60 rounded-[20px] mb-[43px] flex justify-center items-center mt-9 hover:bg-[#30B561]" onPress={pedirCartao}><Text className="text-white font-semibold text-2xl">Pedir Cartão</Text></TouchableOpacity>
                    </View>
                </View>
                    
            :
            <>
            <View className="bg-black w-full h-full flex justify-between">
                    <View className="w-full flex justify-center items-center h-1/3">
                        <View className="w-[351px] h-[25vh] bg-[#212121] rounded-3xl mt-4 p-1 flex justify-evenly flex-col items-center ">
                            <View className="w-[351px] p-2 flex justify-between flex-row">
                                <Image source={require('../../assets/bug.png')} className='w-20 h-20'/>
                                <Image source={require('../../assets/chip.png')} className='w-20 h-20'/>
                            </View>
                            <View className="w-[351px] flex flex-row justify-between p-4 items-center">
                                <View className="flex flex-col">
                                    <Text className="text-white font-medium text-sm">Titular: {cliente.nome}</Text>
                                    <Text className="text-white font-medium text-sm">Numero: {contaCartao.numero}</Text>
                                </View>
                                <Image source={require('../../assets/mastercard.png')} className='w-14 h-14'/>
                            </View>
                        </View>
                    </View>
                    <View className="h-[60vh] w-full bg-[#212121] rounded-t-[40px] p-4">
            <View className="mt-5 h-20 w-full border-b-[1px] border-[#2cff83] rounded-t-[40px] flex flex-col">
                <View className="w-full flex flex-row justify-evenly">
                <TouchableOpacity className="w-fit flex items-center justify-center">
                    <Image source={require('../../assets/pix.png')} className='w-[35px] h-[35px] rounded-full'></Image> 
                    <Text className="text-white mt-2 text-[13px]">Pix</Text>
                </TouchableOpacity>
                <TouchableOpacity className="w-fit flex items-center justify-center">
                    <FontA name='bitcoin' size={35} color={"white"}/>
                    <Text className="text-white text-[13px] mt-2">Cripto</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity><FontA name='credit-card' size={35} color={"white"} onPress={()=>navigate.navigate('Cartao')}/></TouchableOpacity> */}
                <TouchableOpacity className="w-fit flex items-center justify-center">
                    <FontAw name='file-invoice-dollar' size={35} color={"white"}/>
                    <Text className="text-white text-[13px] mt-2">PagarCard</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View className="w-full flex items-center"> 
                <View className="w-[351px] h-[22vh] bg-[#27874f] rounded-3xl mt-4 p-1 flex justify-center items-center flex-row">
                    <Image source={require('../../assets/fatura.png')} className='w-[45vw] h-[22vh] rounded-xl '></Image>  
                    <Text className="p-3 text-white font-bold text-[2vh] text-center">Nós conseguimos flexibilizar sua fatura!</Text>
                </View>
                <View className="w-[351px] h-[17vh] bg-[#27874f] rounded-3xl mt-4 p-1 flex justify-center flex-row">
                    <Image source={require('../../assets/dinheiro.png')} className='w-[35vw] h-[15vh] rounded-xl '></Image>  
                    <Text className="p-3 text-white font-bold text-[2vh] text-center">Faça o dinheiro render! Use CardB&Bank</Text>
                </View>
            </View>
            </View>
                </View>
            </>

        }
   
        </> 
    );
}

 
export default Cartao