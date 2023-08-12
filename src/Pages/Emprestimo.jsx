// import React from 'react';
import { withExpoSnack } from 'nativewind';
import { View,Image,TextInput, TouchableOpacity, Text,Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from './components/Input';
import { useState,useEffect } from 'react';
import axios from 'axios';
import AwesomeAlert from 'react-native-awesome-alerts';
import {SERVIDOR} from "@env"



const Emprestimo = () => {
    const[token,setToken] = useState("")
    const[valorEmpres,setValorEmpres] = useState()
    const[valorParcela,setvalorParcela] = useState()
    const[valorFinal,setValorFinal] = useState()
    const[parcelas,setParcelas] = useState()
    const[juros,setJuros] = useState()
    const[conta,setConta] = useState()
    const[flag,setflag] = useState(true)
    


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
        if(flag==false){
        setTimeout(
            ()=>{
                console.log("entro");
                setValorEmpres("")
                setValorFinal("")
                setvalorParcela("")
                setParcelas("")
                setflag(true)
            }
        ,2000)
    }
    },[flag])

    
    useEffect(()=>{
        if (token!=undefined) {
            axios
            .get(`${SERVIDOR}auth/users/me/`, {
                headers: { Authorization: `JWT ${token.acess}`},
            })
            .then((res) => {
                console.log(res.data)
                if(res.status== 200 || res.status == 201){
                    axios
                    .get(`${SERVIDOR}fastbank/conta/${res.data.id}`, { headers: { Authorization: `JWT ${token.acess}`}})
                    .then((res) => {
                        console.log(res.data)
                        if(res.status== 200 || res.status == 201){
                            setConta(res.data)
                        }
                    }).catch((erro)=>{
                        console.log(erro)
                        if(erro.response.status ==401){
                            refreshToken(token.refresh)
                        } 
                    })
                }
            }).catch((erro)=>{
                console.log(erro)
                if(erro.response.status ==401){
                    refreshToken(token.refresh)
                } 
            })
        }
    },[token])

    useEffect(()=>{
        if(parcelas==3){
            setJuros(0.10)
            let valorTotal = ((parseFloat(valorEmpres)*0.1)+parseFloat(valorEmpres))
            let parcelaValor = valorTotal/parcelas
            setValorFinal(valorTotal.toFixed(2))
            setvalorParcela(parcelaValor.toFixed(2))
        }
        else if(parcelas==6){
            setJuros(0.2)
            let valorTotal = ((parseFloat(valorEmpres)*0.2)+parseFloat(valorEmpres))
            let parcelaValor = valorTotal/parcelas
            setValorFinal(valorTotal.toFixed(2))
            setvalorParcela(parcelaValor.toFixed(2))
        }
        else if(parcelas ==12){
            setJuros(0.30)
            let valorTotal = ((parseFloat(valorEmpres)*0.4)+parseFloat(valorEmpres))
            let parcelaValor = valorTotal/parcelas
            setValorFinal(valorTotal.toFixed(2))
            setvalorParcela(parcelaValor.toFixed(2))
        }
        else{
            console.log("ok");
        }

    },[parcelas])

    const AnalisarPerfil = () => {
        let podeRealizarEmprestimo = Math.floor(Math.random() * 80)
        if(podeRealizarEmprestimo<70){
            if (conta.saldo >= (valorEmpres*2)) {
                GravarEmprestimo()
            }
        }
        else{
            setflag(false)
        }
    }

    const GravarEmprestimo =()=>{
        conta.saldo = ""+(parseFloat(valorEmpres)+parseFloat(conta.saldo))
        console.log(conta.saldo)
        if (conta.tipo === "Salario") {
            conta.tipo="S"
        }
        else if(conta.tipo === "Deposito"){
            conta.tipo="D"
        }
        else{
            conta.tipo="P"
        }
        console.log(conta.tipo)
        axios.patch(`${SERVIDOR}fastbank/conta/${conta.id}/`,{saldo:conta.saldo,tipo:conta.tipo},{headers: { Authorization: `JWT ${token.acess}`}})
        .then((res)=>{
            console.log(res);
            if(res.status== 200 || res.status == 201){
                CriarMovimentacao()
            
            }
        })
        .catch((erro)=>{
            console.log(erro)
            if(erro.response.status ==401){
                refreshToken(token.refresh)
            } 
        }) 
    }

    
    const CriarMovimentacao =()=>{
        axios.post(`${SERVIDOR}fastbank/movimentacao/`,{
            operacao:'Emprestimo',
            valor: valorEmpres,
            conta_remetente:null,
            conta_destinatario:conta.id,
            dataHora:"2023-05-26 14:45:12"
        },
        {headers: { Authorization: `JWT ${token.acess}`}}
        ).then((res)=>{
            console.log(res);
            if(res.status== 200 || res.status == 201){
                Alert
                Alert.alert(`O emprestimo no valor de ${valorEmpres} foi realizado`)
                alert(`O emprestimo no valor de ${valorEmpres} foi realizado`)
              
            }
        }).catch((erro)=>{
            console.log(erro);
            if(erro.response.status ==401){
                refreshToken(token.refresh)
            } 
        })

    }
     
    return ( 
        <>
            <View className="bg-black w-full h-full flex p-4">
                <View className="p-4">
                    <Text className="text-white font-semibold text-[4vh]">Emprestimo</Text>
                </View>
                {flag?
                    <>
                <View className="w-full flex justify-center items-center">
                    <View className="w-[90vw] h-[17vh] bg-[#212121] rounded-3xl mt-4 p-1 flex justify-center flex-row">
                    <Image source={require('../../assets/dinheiro.png')} className='w-[35vw] h-[15vh] rounded-xl '></Image>  
                    <Text className="p-3 text-white font-bold text-[2vh] text-center">Nos analisamos seu perfil e fazemos nossa proposta com parcelas em até 12x !</Text>
                    </View>
                    <View className="m-4">
                        <Text className="text-white font-bold text-[2vh] text-center">Qual o valor do emprestimo?</Text>
                    </View>
                    <View className="flex flex-row w-full items-center justify-center h-fit">
                        <Text className="font-bold text-green-600 text-[6vh]">R$ </Text>
                        <TextInput keyboardType='numeric' className="text-white h-[6vh] text-3xl w-2/3 bg-[#212121] rounded-lg" onChangeText={(e)=>setValorEmpres(e)}></TextInput>
                    </View>
                    <View className="m-4">
                        <Text className="text-white font-bold text-[2vh] text-center">Quantas parcelas o emprestimo será pago?</Text>
                    </View>
                    <View className="flex flex-row w-full items-center justify-around h-fit">
                    <TouchableOpacity className="bg-[#0ACF53] h-10 w-20 rounded-[20px] flex justify-center items-center hover:bg-[#30B561]" onPress={()=>setParcelas(3)}><Text className="text-white font-semibold text-2xl">3x</Text></TouchableOpacity>
                    <TouchableOpacity className="bg-[#0ACF53] h-10 w-20 rounded-[20px] flex justify-center items-center hover:bg-[#30B561]" onPress={()=>setParcelas(6)}><Text className="text-white font-semibold text-2xl">6x</Text></TouchableOpacity>
                    <TouchableOpacity className="bg-[#0ACF53] h-10 w-20 rounded-[20px] flex justify-center items-center hover:bg-[#30B561]" onPress={()=>setParcelas(12)}><Text className="text-white font-semibold text-2xl">12x</Text></TouchableOpacity>
                    </View>
                </View>
                <View className="h-1/4 w-full p-3 mt-3">
                       {valorParcela>0?
                                <>
                                <View className="w-full justify-start items-start">
                                    <Text className="text-white font-semibold text-[2vh] text-center m-3">Resultado do emprestimo:</Text>
                                </View>
                                <View className="border-b-2 border-t-2 border-[#8a8888] rounded-lg flex items-start p-4">
                                    <Text className="text-white font-semibold text-[2vh] text-center mb-2">Valor solicitado: {valorEmpres}</Text>
                                    <Text className="text-white font-semibold text-[2vh] text-center mb-2">{parcelas}x de {valorParcela}</Text>
                                    <Text className="text-white font-semibold text-xl text-center">Total com juros: {valorFinal}</Text>
                                </View>   
                                </>
                       :null} 
                </View>
                
              
                <View className="flex w-full items-center justify-center p-2">
                <TouchableOpacity className="bg-[#0ACF53] h-16 w-60 rounded-[20px] flex justify-center items-center hover:bg-[#30B561]" onPress={AnalisarPerfil}><Text className="text-white font-semibold text-2xl">Pedir emprestimo</Text></TouchableOpacity>
                </View>
                </>
                :
                <>
                    <View className="h-full flex justify-center items-center">
                    <View className="w-[90vw] h-[26vh] bg-[#212121] rounded-3xl mt-4 p-1 flex justify-center flex-row">
                    <Image source={require('../../assets/triste.png')} className='w-[35vw] h-[25vh] rounded-xl '></Image>  
                    <Text className="p-3 text-white font-bold text-[2vh] text-center">Nos possuímos uma oferta de emprestimo para seu perfil no momento, tente depois !</Text>
                    </View>
                    </View>
                </> 
                }
            </View>

        </> 
    );
}
 
export default Emprestimo;