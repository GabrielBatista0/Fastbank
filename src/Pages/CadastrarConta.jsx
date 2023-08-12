// import React from 'react-native';
import axios from 'axios';
import { withExpoSnack } from 'nativewind';
import { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import BtnVoltar from './components/BtnVoltar';
import {SERVIDOR} from "@env"

const CadastrarConta = () => {
    const [checked, setChecked] = useState('Salario');
    const [agencia,setAgencia] = useState()
    const [numero,setNumero] = useState()
    const [token,setToken] = useState()
    const navigate = useNavigation()


    useEffect(()=>{
        pegar()
        let agencia ="";
        let numero="";
        for (let i = 0; i <4 ; i++) {
            let aleatorio= Math.floor(Math.random()* (9 - 0) + 0);
            agencia+=aleatorio
            console.log(aleatorio)
        }
        for (let i = 0; i <6 ; i++) {
            let aleatorio= Math.floor(Math.random()* (9 - 0) + 0);
            numero+=aleatorio
            // if (numero.length==5){
            //     numero+="-"
            // }
        }
        setAgencia(agencia)
        setNumero(numero)
            
    },[])

    async function pegar(){
        const auth = await AsyncStorage.getItem("Token")
        console.log(JSON.parse(auth).acess);
        setToken(JSON.parse(auth))
    }

    const gerarConta = () => {
            axios.post(`${SERVIDOR}/fastbank/conta/`,{
                    
            ativo:true,
            agencia:agencia,
            tipo:checked,
            numero:numero,
            saldo:0,
            cliente:' ',

        },{headers: { Authorization: `JWT ${token.acess}`}})
        .then((res)=>{
        console.log(res)
            if(res.status== 200 || res.status == 201){
                navigate.navigate('CadastroLocal')
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
            <View className='w-[90%] flex items-center border-[#0ACF53] border-[1px] rounded-2xl p-3'>
                <Text className='text-white font-medium text-lg mb-5'>Selecione o tipo da sua conta:</Text>
                <View className="w-full flex flex-row items-center justify-center p-10">
                    <View classname="text-white flex w-10 h-[40vh] justify-around">
                    <RadioButton
                        value="Salario"
                        status={ checked === 'S' ? 'checked' : 'unchecked' }
                        onPress={() => setChecked('S')}
                        className="mb-3"
                    />
                    <RadioButton
                        value="Pagamento"
                        status={ checked === 'P' ? 'checked' : 'unchecked' }
                        onPress={() => setChecked('P')}
                    />
                    <RadioButton
                        value="Deposito"
                        status={ checked === 'D' ? 'checked' : 'unchecked' }
                        onPress={() => setChecked('D')}
                    />
                    </View>
                    <View className="w-22">
                    <Text className="text-white font-semibold text-xl h-9 ">Salario</Text>
                    <Text className="text-white font-semibold text-xl h-9 ">Pagamento</Text>
                    <Text className="text-white font-semibold text-xl h-9 ">Deposito</Text>
                    </View>
                    </View>
            </View>
            </View>
            <View className='w-full flex items-center'>
            <TouchableOpacity className="bg-[#1cf16a] h-10 w-36 rounded-[20px] flex justify-center items-center mt-9 hover:bg-[#30B561]" onPress={gerarConta}><Image source={require('../../assets/seta.png')} className='w-10 h-10'></Image></TouchableOpacity>
            </View>
           </View>
        </>
     );
}
 
export default CadastrarConta