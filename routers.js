import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/Pages/Home';
import Cadastrar from './src/Pages/Cadastrar';
import Login from './src/Pages/Login';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons,FontAwesome,AntDesign,MaterialCommunityIcons,FontAwesome5 } from '@expo/vector-icons';
import Main from './src/Pages/Main';
import Tranferir from './src/Pages/Transferir';
import Emprestimo from './src/Pages/Emprestimo';
import Extrato from './src/Pages/Extrato';
import CadastrarLocal from './src/Pages/CadastrarLocal';
import CadastrarContato from './src/Pages/CadastrarContato';
import CadastrarConta from './src/Pages/CadastrarConta';
import Cartao from './src/Pages/Cartao';
import PagarConta from './src/Pages/PagarConta'

const Stack = createNativeStackNavigator();
const Nav = createBottomTabNavigator();
function Navbar (){
    return(
        <Nav.Navigator
            screenOptions={{
                tabBarStyle:{
                    backgroundColor:'#0ACF53',
                    borderTopColor: 'transparent',
                    paddingBottom: 2,
                    paddingTop: 2,
                },
                tabBarActiveTintColor: '#FFFF',
                tabBarInactiveTintColor: '#000',
                tabBarOptions: { 
                    showIcon: true 
                  }, 
                
            }}
        >
            <Nav.Screen
                name="Home"
                component={Main}
                options={{
                    headerShown: false,
                    tabBarIcon: ({size, color})=> {
                        return <FontAwesome name="home" size={size} color ={color}/>
                        
                    },
                    unmountOnBlur: true
                }}
            />
            <Nav.Screen
                name="Transferir"
                component={Tranferir}
                options={{
                    headerShown: false,
                    tabBarIcon: ({size, color})=>(
                        <MaterialCommunityIcons name="bank-transfer" size={size} color ={color}/>
                        
                    ),
                    unmountOnBlur: true

                }}
            />
            <Nav.Screen
                name="Emprestimo"
                component={Emprestimo}
                options={{
                    headerShown: false,
                    tabBarIcon: ({size, color})=>(
                        <FontAwesome5 name="hand-holding-usd" size={size} color ={color}/>
                        
                    ),
                    unmountOnBlur: true

                }}
            />
            <Nav.Screen
                name="Extrato"
                component={Extrato}
                options={{
                    showIcon: true,
                    headerShown: false,
                    tabBarIcon: ({size, color})=>(
                        <AntDesign name="filetext1" size={size} color ={color}/>
                     
                    
                    ),
                    unmountOnBlur: true

                }}
            />
           

        </Nav.Navigator>
    )
 }

export default function MyStack () {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown:false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown:false}}
        />
        <Stack.Screen
          name="Cadastro"
          component={Cadastrar}
          options={{headerShown:false}}
        />
        <Stack.Screen
          name="CadastroConta"
          component={CadastrarConta}
          options={{headerShown:false}}
        />
          <Stack.Screen
          name="CadastroLocal"
          component={CadastrarLocal}
          options={{headerShown:false}}
        />
          <Stack.Screen
          name="CadastroContato"
          component={CadastrarContato}
          options={{headerShown:false}}
        />
         <Stack.Screen
          name="Cartao"
          component={Cartao}
          options={{
            headerShown:true,
            title:"Cartões B&bank",
            headerStyle: {
              backgroundColor: '#000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              color:'white'
            },
          }}
        />
         <Stack.Screen
          name="PagarConta"
          component={PagarConta}
          options={{headerShown:true}}
        />
           <Stack.Screen
          name="Nav"
          component={Navbar}
          options={{headerShown:false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};