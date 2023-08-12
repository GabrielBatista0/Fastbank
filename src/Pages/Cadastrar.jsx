import React, { Component, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { withExpoSnack } from 'nativewind';
import { TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';   
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import CadastrarContato from './CadastrarContato';
import DatePicker from 'react-native-date-picker'
import Input from './components/Input';
import * as FileSystem from 'expo-file-system';
import {SERVIDOR} from "@env"
import * as Device from 'expo-device';
import BtnVoltar from './components/BtnVoltar';


function Cadastro() {
    const navigate = useNavigation()
    const[image,setImage] = useState()
    const[nome,setNome] = useState()
    const[senha,setSenha] = useState()
    const[nascimento,setNascimento] = useState(new Date())
    const[rg,setRg] = useState()
    const[cpf,setCpf] = useState()
    const[user,setUser] =useState()
    const[imageMobal,setImageMobal] = useState()
    
    // const [date, setDate] = useState(new Date())
    // const [open, setOpen] = useState(false)
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
          setImageMobal(";base64," + await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: 'base64' }))
        }
      };
    
    const escolherFotoCamera= async () =>{
        let result = ImagePicker.launchCameraAsync({
            allowsEditing: true,
        })
        
        if(!(await result).canceled){
            setImage((await result).assets[0].uri)
            setImageMobal(";base64," + await FileSystem.readAsStringAsync((await result).assets[0].uri, { encoding: 'base64' }))
        }
    }

    const escolherFoto = () => {
      Alert
      Alert.alert(
          'SELECIONAR',
          'Selecione',
          [
              {
                  text: 'Galeria',
                  onPress: () => pickImage()
              },
              {
                  text: 'Camera',
                  onPress: () => escolherFotoCamera()
              }
          ]
          )
    }

      // primeiro cdastrar o cliente no auth/user 
      //com base no response (se deu certo criar usuario) se sim agorar gerar o jwt
    const CadastrarClienteAuth = () => {
      console.log('oaaa')
      axios.post(`${SERVIDOR}auth/users/`,{
        id_fiscal:cpf,
        password:senha

      }).then((res)=>{
        console.log(res.status)
        if(res.status== 200 || res.status == 201){
            GetToken()
        }
        let erro = res.data
        console.log(erro)
      }).catch((erro)=>{
        console.log(erro)
        alert(erro)
      })
    }

    const GetToken= ()=>{
      axios.post(`${SERVIDOR}auth/jwt/create`,{
        id_fiscal: cpf,
        password: senha
      }).then((res)=>{
        console.log(res)
        if(res.status == 200 || res.status == 201){
          AsyncStorage.setItem("Token",JSON.stringify({acess:res.data.access,refresh:res.data.refresh}))
          CadastrarCliente(res.data.access)
        }

      }).catch((erro)=>{
        console.log(erro)
      })
    }

    const CadastrarCliente=(acesso)=>{
      let Fotos = ""
      if(Device.brand != null){
          Fotos = imageMobal
      }
      else{
        Fotos = image
      }

      console.log(acesso)
      axios.post(`${SERVIDOR}fastbank/clientes/`,{
        nome:nome,
        foto:Fotos,
        dt_nascimento:nascimento,
        rg:rg,
      
      },{headers: { Authorization: `JWT ${acesso}`}})
      .then((res)=>{
        console.log(res)
        let a = res.data
        console.log(a.at(-1))
        
        if(res.status== 200 || res.status == 201){
          
          navigate.navigate('CadastroConta')
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
                <Text className='text-white font-medium text-lg mb-5'>Criar Nova Conta:</Text>
                <Input placeholder='Nome' onChangeText={(e)=>setNome(e)}></Input>
                <Input placeholder='CPF' onChangeText={(e)=>setCpf(e)}></Input>
                <Input placeholder='RG' onChangeText={(e)=>setRg(e)}></Input>    
                <Input placeholder='Senha' secureTextEntry={true} onChangeText={(e)=>setSenha(e)}></Input>
                <Input placeholder='Nascimento ex:2000-10-10' onChangeText={(e)=>setNascimento(e)}/>
                <View className='flex justify-between w-[90%]'>
                    <Text className='text-white font-medium w-40'>Envie sua foto:</Text>
                    <View className="w-full items-center">
                    <TouchableOpacity title="Pick an image from camera roll" onPress={Device.brand != null ? escolherFoto : pickImage} className="bg-[#d6d6d6] mb-2 border-[#18191a] border-[1px] h-20 w-24 rounded-md">
                    {image && <Image source={{ uri: image }} className="h-20 w-24 rounded-md" />}
                    </TouchableOpacity>
                    </View>
                </View>
            </View>
            </View>
            <View className='w-full flex items-center'>
            <TouchableOpacity className="bg-[#1cf16a] h-10 w-36 rounded-[20px] flex justify-center items-center mt-9 hover:bg-[#30B561]" onPress={CadastrarClienteAuth}><Image source={require('../../assets/seta.png')} className='w-10 h-10'></Image></TouchableOpacity>
            </View>
            {/* <View className='w-full flex items-end p-3'>
            <TouchableOpacity className="bg-[#393a39] h-10 w-24 rounded-[20px] flex justify-center items-center mt-3 hover:bg-[#30B561]" onPress={()=>navigate.navigate('Home')}><Text className="text-white font-medium">Cancelar</Text></TouchableOpacity>
            </View> */}
            <BtnVoltar navigation={'Home'} titulo={'Cancelar'}/>
           </View>
        </>
     );
}

export default Cadastro;