import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';

const BtnVoltar = ({titulo,navigation}) => {
    const navigate = useNavigation()
    return ( 
        <View className='w-full flex items-end p-3'>
        <TouchableOpacity className="bg-[#393a39] h-10 w-24 rounded-[20px] flex justify-center items-center mt-3 hover:bg-[#30B561]" onPress={()=>navigate.navigate(navigation)}><Text className="text-white font-medium">{titulo}</Text></TouchableOpacity>
        </View>
     );
}
 
export default BtnVoltar;