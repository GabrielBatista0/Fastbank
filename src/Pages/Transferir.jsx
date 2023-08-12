import React, { useState,useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { TextInput } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { data } from 'autoprefixer';
import {SERVIDOR} from "@env"

const Tranferir = () => {
    const[pessoa,setPessoa]= useState("")
    const[Token,setToken]= useState("")
    const[cpf,setCpf]= useState()
    const[conta,setConta] = useState("")
    const[transfer,setTransferencia] = useState()

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


    useEffect(() => {
        if (cpf!=undefined) {   
            axios
            .get(`${SERVIDOR}fastbank/clientes/?cpf=${cpf}`, {
                headers: { Authorization: `JWT ${Token.acess}`},
            })
            .then((res) => {
                console.log(res.data)
                setPessoa(res.data)
            }).catch((erro)=>{
                 console.log(erro)
                if(erro.response.status ==401){
                    refreshToken(Token.refresh)
                } 
                })
        }
        },[cpf]);


useEffect(()=>{
    if(pessoa.length>0){
        const cliente = pessoa.map((pes)=>pes.id)
        console.log(cliente);
            axios
            .get(`${SERVIDOR}fastbank/conta/${cliente}`, {
                headers: { Authorization: `JWT ${Token.acess}`},
            })
            .then((res) => {
                console.log(res.data)
                if(res.status== 200 || res.status == 201){
                    setConta(res.data)
                }
            }).catch((erro)=> {
                console.log(erro)
                if(erro.response.status ==401){
                    refreshToken(Token.refresh)
                } 
            })
    }
    else{
        console.log("não")
    }
},[pessoa])

    const Transferir=(contaRemetente)=>{
        let nome;
        const valor = parseFloat(transfer)
        pessoa.forEach(element => {
            nome = element.nome
        });
        conta.saldo = ""+(parseFloat(transfer)+parseFloat(conta.saldo))
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
        axios.patch(`${SERVIDOR}fastbank/conta/${conta.id}/`,{saldo:conta.saldo,tipo:conta.tipo},{headers: { Authorization: `JWT ${Token.acess}`}})
        .then((res)=>{
            console.log(res);
            if(res.status== 200 || res.status == 201){
               Alert.alert(`R$ ${valor} transferido para ${nome}`)
                CriarMovimentacao(contaRemetente)
            }
        })
        .catch((erro)=>{
            console.log(erro)
            if(erro.response.status ==401){
                    refreshToken(Token.refresh)
                } 
        })   
    }

    const CriarMovimentacao =(contaRemetente)=>{
        axios.post(`${SERVIDOR}/fastbank/movimentacao/`,{
            operacao:'Transferencia',
            valor: transfer,
            conta_remetente:contaRemetente.id,
            conta_destinatario:conta.id,
            dataHora:"2023-05-26 14:45:12"
        },
        {headers: { Authorization: `JWT ${Token.acess}`}}
        ).then((res)=>{
            console.log(res);
            if(res.status== 200 || res.status == 201){
                setPessoa("")
                setConta("")
                setTransferencia("")
                setCpf("")
            }
        }).catch((erro)=>{
            console.log(erro);
            if(erro.response.status ==401){
                    refreshToken(Token.refresh)
                } 
        })

    }

    const VerificarSaldo =()=>{
        let minhaconta;
        let meuCpf;
        axios
        .get(`${SERVIDOR}auth/users/me/`, {
            headers: { Authorization: `JWT ${Token.acess}`},
        })
        .then((res) => {
            console.log(res.data)
            meuCpf = res.data.id_fiscal
            if(res.status== 200 || res.status == 201){
                axios
                .get(`${SERVIDOR}fastbank/conta/${res.data.id}`, { headers: { Authorization: `JWT ${Token.acess}`}})
                    .then((res) => {
                        if(res.status== 200 || res.status == 201){
                            minhaconta = res.data
                            console.log(minhaconta);
                            if(meuCpf!=cpf){
                            if(transfer>  minhaconta.saldo){
                                Alert.alert("Você não possui saldo suficiente para isso")                                
                            }
                            else{
                                minhaconta.saldo-= transfer
                                if (minhaconta.tipo === "Salario") {
                                    minhaconta.tipo="S"
                                }
                                else if(minhaconta.tipo === "Deposito"){
                                    minhaconta.tipo="D"
                                }
                                else{
                                    minhaconta.tipo="P"
                                }
                                axios.patch(`${SERVIDOR}fastbank/conta/${minhaconta.id}/`,{saldo: minhaconta.saldo,tipo: minhaconta.tipo},{headers: { Authorization: `JWT ${Token.acess}`}})
                                .then((res)=>{
                                    console.log(res)
                                    if(res.status== 200){
                                        Transferir(minhaconta)
                                    }
                                })
                                .catch((erro)=>{
                                    console.log(erro)
                                    if(erro.response.status ==401){
                                        refreshToken(Token.refresh)
                                    } 
                                })
                            }
                        }
                        else{
                            Alert.alert("você não pode transferir para você mesmo")
                        }
                     }
                    }).catch((erro)=> {
                        console.log(erro)
                        if(erro.response.status ==401){
                            refreshToken(Token.refresh)
                        } 
                    })
             }
        }).catch((erro)=> {
            console.log(erro)
            if(erro.response.status ==401){
                refreshToken(Token.refresh)
            }  
        })
    }
     

    return ( 
        <>
        <View className="bg-black w-full h-full flex flex-col p-4">     
            <View className="p-4">
                <Text className="text-white font-semibold text-[4vh]">Transferir</Text>
            </View>
            <View className="w-full justify-center items-center">
                <TextInput maxLength={11} keyboardType='numeric' value={cpf} className="border-[1px] border-b-[#27874f] w-4/5 h-10 bg-[#212121] text-center p-2 rounded-2xl color text-gray-400" placeholder="Digite o CPF de quem vai receber"  onChangeText={(e)=>setCpf(e)}/>
            </View>
            <View className="p-4 h-10">
                <Text className="text-[#8a8888]">Transferir para:</Text>
                    {pessoa.length > 0 ? pessoa.map((pes)=>{
                        return(
                        <>
                        <Text className="text-[#646464]" key={pes}>Nome: {pes.nome}</Text>
                        <Text className="text-[#646464]" key={pes}>RG: {pes.rg}</Text>
                        </>)})
                    : null}
                    {conta? <Text className="text-[#646464]" >Agencia: {conta.agencia}</Text>:null}
                    {/* {conta.length>0? conta.map((cont)=><Text className="text-[#646464]" key={cont}>Agencia: {cont.agencia}</Text>):null} */}
            </View>
            <View className="flex flex-row w-full items-center justify-center h-1/2">
                <Text className="font-bold text-green-600 text-[8vh]">R$ </Text>
                <TextInput keyboardType='numeric' className="text-white h-[8vh] text-5xl w-2/3 bg-[#212121] rounded-lg" value={transfer} onChangeText={(e)=>setTransferencia(e)}></TextInput>
            </View>
            <View className="flex w-full items-center justify-center">
            <TouchableOpacity className="bg-[#0ACF53] h-16 w-60 rounded-[20px] mb-[43px] flex justify-center items-center mt-9 hover:bg-[#30B561]" onPress={VerificarSaldo}><Text className="text-white font-semibold text-2xl">Transferir</Text></TouchableOpacity>
            </View>
        </View>
        </>
     );
}
 
export default Tranferir;