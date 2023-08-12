import React, { Component, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { withExpoSnack } from 'nativewind';
import { TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';   
import axios from 'axios';
import Input from './components/Input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import {SERVIDOR} from "@env"
import BtnVoltar from './components/BtnVoltar';
  


function CadastroLocal() {
    const navigate = useNavigation()
    const[cep,setCep] = useState(" ")
    const[cidade,setCidade] = useState("")
    const[Bairro,setBairro] = useState("")
    const[logradouro,setLogradouro] = useState("")
    const[uf,setUf] = useState("")
    const[cepFormatado,setCepFormatado] = useState("")
    const[casa,setCasa] = useState("")
    const[token,setToken] = useState('')


    // useEffect(()=>{
    //         console.log(cep);
    //         axios.get(`https://viacep.com.br/ws/${cep}/json/`)
    //         .then((res) => {
    //           console.log(res.data)
    //           setBairro(res.data.bairro)
    //           setCidade(res.data.localidade)
    //           setLogradouro(res.data.logradouro)
    //           setUf(res.data.uf)
    //         //   setEndereco(res.data.logradouro + '-'+  res.data.localidade)
    //         })
    //     //   }    
     
    // },[cep])

    useEffect(()=>{
        console.log(cepFormatado);
        axios.get(`https://cdn.apicep.com/file/apicep/${cepFormatado}.json`)
        .then((res) => {
          console.log(res.data)
          setBairro(res.data.district)
          setCidade(res.data.city)
          setLogradouro(res.data.address)
          setUf(res.data.state)
        })
    //   }    
 
},[cepFormatado])

  async function PegarToken(){
    const auth = await AsyncStorage.getItem("Token")
    console.log(JSON.parse(auth).acess);
    setToken(JSON.parse(auth))
  }

  useEffect(()=>{
    PegarToken()
  },[])


    useEffect(()=>{
        let a ="";
        if(cep.length ==8){
            for(var i=0; i<= cep.length;i++){
                if(i==5){
                 a+="-"+cep.charAt(i)
                }
                else{
                    a = a+cep.charAt(i)
                }
            }
            setCepFormatado(a)
        }
     
    },[cep])


    const CadastrarLocal=()=>{
        console.log(token)
        axios.post(`${SERVIDOR}fastbank/endereco/`,{
          logradouro:logradouro,
          bairro: Bairro,
          cep: cep,
          cidade:cidade,
          uf:uf,
          n_casa:casa,
          cliente:" ",
        
        },{headers: { Authorization: `JWT ${token.acess}`}})
        .then((res)=>{
          console.log(res)
          let a = res.data
          console.log(a.at(-1))
          
          if(res.status== 200 || res.status == 201){
            navigate.navigate('CadastroContato')
          }
  
  
        }).catch((erro)=>{
          console.log(erro)
          // alert("Usuário ou senha incorreto")
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
            <View className='w-[90%] h-96 flex items-center border-[#0ACF53] border-[1px] rounded-2xl'>
                <Text className='text-white font-medium text-lg mb-5'>Endereço:</Text>
                    <Input placeholder="CEP"  maxLength={8} onChangeText={(e)=>setCep(e)}></Input>
                    <Input placeholder="Estado" editable={false} value={uf}></Input>
                    <Input placeholder="Cidade" value={cidade} editable={false}></Input>
                    <Input placeholder="Bairro" value={Bairro} editable={false}></Input>
                    <Input placeholder="Rua" value={logradouro} editable={false}></Input>
                    <Input placeholder='N° Endereço' onChangeText={(e)=>setCasa(e)}></Input>
            </View>
            </View>
            <View className='w-full flex items-center'>
            <TouchableOpacity className="bg-[#1cf16a] h-10 w-36 rounded-[20px] flex justify-center items-center mt-9 hover:bg-[#30B561]" onPress={CadastrarLocal}><Image source={require('../../assets/seta.png')} className='w-10 h-10'></Image></TouchableOpacity>
            </View>
   

           </View>
        </>
     );
}

export default CadastroLocal;