import { View, Text, Image, TouchableOpacity,TextInput,ScrollView, Alert} from 'react-native';
import { withExpoSnack } from 'nativewind';
import { styled } from "nativewind";
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SERVIDOR} from  "@env"
import BtnVoltar from './components/BtnVoltar';
// dotenv.config()





const Login =()=>{
    const navigate = useNavigation()
    const[user,setUser] = useState('')
    const[password,setPassword] = useState()
    const[contador,setContador] = useState(0)
    const[bloq,setBloq] = useState(true)
    
    const btnlogin = ()=>{
        axios.post(`${SERVIDOR}auth/jwt/create`,{
            id_fiscal: user,
            password: password
          }).then((res)=>{
            console.log(res)
            AsyncStorage.setItem("Token",JSON.stringify({acess:res.data.access,refresh:res.data.refresh}))
            navigate.navigate('Nav')
          }).catch((erro)=>{
            console.log(erro)
            setContador(contador+1)
            alert("Usuário ou senha incorreto")
          })
    }

    useEffect(()=>{
      if (contador ==3) {
        setBloq(false)
      }

    },[contador])

    return ( 
        <>
           <View className='bg-black w-full h-full'>
            <View className='w-full flex flex-row h-1/3 items-center justify-center'>
            <Image source={require('../../assets/bug.png')} className='w-20 h-20'></Image>
                <Text className="text-white font-bold text-5xl">B&</Text>
                <Text className="text-white text-5xl">Bank</Text>
            </View>
            <View className='w-full h-1/3 flex items-center'>
                <TextInput onChangeText={e=>setUser(e)} value={user}  placeholder='Identificação'  className='text-gray-400 w-2/5 h-8 border-b-[#0ACF53] border-2 text-center font-thin text-lg mb-16'/>
                <TextInput placeholder='Senha' secureTextEntry={true} editable={bloq} value={password} className='text-gray-400 w-2/5 h-8 border-b-[#0ACF53] border-2 text-center font-thin text-lg mb-5' onChangeText={(e)=>setPassword(e)}/>
                <View className='flex flex-row w-full justify-center'>
                    <Text className='text-white'>Esqueceu a sua senha?<Text className='font-bold'> Clique aqui!</Text></Text>
                </View>
            </View>
            <View className='w-full h-1/3 flex items-center'>
            {bloq?
            <>
            <TouchableOpacity className="bg-[#0ACF53] h-10 w-36 rounded-[20px] mb-[43px] flex justify-center items-center mt-9 hover:bg-[#30B561]" onPress={btnlogin}><Text className="text-white font-t text-xl">LOGIN</Text></TouchableOpacity>
            </>:
              <TouchableOpacity className="bg-[#0acf5259] h-10 w-36 rounded-[20px] mb-[43px] flex justify-center items-center mt-9 hover:bg-[#30B561]" onPress={()=>{alert('conta bloqueada')}}><Text className="text-white font-t text-xl">LOGIN</Text></TouchableOpacity>
              }
            <BtnVoltar navigation={'Home'} titulo={'Cancelar'}/>
            </View>
           </View>
        </>
     );
}

export default Login