import { View, Text,TouchableOpacity, ScrollView} from "react-native";
import { useEffect,useState } from "react";
import { TextInput } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { Ionicons,FontAwesome,AntDesign,MaterialCommunityIcons,FontAwesome5 } from '@expo/vector-icons';
import {SERVIDOR} from "@env"

const Extrato = () => {
    const[Token,setToken]= useState("")
    const[movimentacao,setMovimentacao] = useState("")

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
        if (Token!=undefined) {
            axios
            .get(`${SERVIDOR}auth/users/me/`, {
                headers: { Authorization: `JWT ${Token.acess}`},
            })
            .then((res) => {
                console.log(res.data)
                if(res.status== 200 || res.status == 201){
                    axios
                    .get(`${SERVIDOR}fastbank/movimentacao/?conta=${res.data.id}`, { headers: { Authorization: `JWT ${Token.acess}`}})
                    .then((res) => {
                        console.log(res);
                        if(res.status== 200 || res.status == 201){
                            console.log(res.status);
                            setMovimentacao(res.data)   
                        }
                    }).catch((erro)=>{ 
                        console.log(erro)
                        if(erro.response.status ==401){
                            refreshToken(Token.refresh)
                        } 
                    })
                }
            }).catch((erro)=>{ 
                console.log(erro)
                if(erro.response.status ==401){
                    refreshToken(Token.refresh)
                } 
            })   
        }
    },[Token])
    

    return ( 
        <>
        <ScrollView className="bg-black w-full h-full flex flex-col p-4">     
            <View className="p-2">
                <Text className="text-white font-semibold text-[4vh]">Extrato </Text>
            </View>
            <View className="p-2 mt-10 mb-3">
                <Text className="text-[#bbbebb] font-semibold text-[2vh]">Movimentações</Text>
            </View>
            {movimentacao? movimentacao.map((res)=>(
                <>
                    <View className=" flex h-26 w-full border-b-[2px] border-t-[2px] border-[#0ACF53] flex-row items-center p-1">
                    <View className="bg-[#8a8888] h-10 w-10 flex items-center justify-center rounded-full">
                    <FontAwesome name="money" size={25} color ={"white"}/>
                    </View>
                        <View className="h-26 p-2 ml-4 flex flex-col">
                            <Text className="text-[#e2e1e1] font-medium mb-2">{res.operacao}</Text>
                            <Text className="text-[#8a8888] font-medium">Remetente:{res.nome_cliente_remetente}</Text>
                            <Text className="text-[#8a8888] font-medium">Destinatario:{res.nome_cliente_destinatario}</Text>
                            <Text className="text-[#8a8888] font-medium">Data e Hora:{res.dataHora}</Text>
                        </View>
                        <View className="h-26 p-1 w-2/5 flex items-start">
                                <Text className="text-[#36ce6d] font-medium text-lg"> R$ {res.valor}</Text>
                        </View>
                    </View>
                    </>
                ))
                :null}
            {/* <View className="flex w-full items-center justify-center">
            <TouchableOpacity className="bg-[#0ACF53] h-16 w-60 rounded-[20px] mb-[43px] flex justify-center items-center mt-9 hover:bg-[#30B561]" onPress={"as"}><Text className="text-white font-semibold text-2xl">Transferir</Text></TouchableOpacity>
            </View> */}
        </ScrollView>
    
        </> 
    );
}
 
export default Extrato;