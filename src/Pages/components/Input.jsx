import { withExpoSnack } from 'nativewind';
import { TextInput } from 'react-native';


const Input = ({placeholder, onChangeText, secureTextEntry, value, editable,maxLength}) => {
    return ( <>
            <TextInput placeholder={placeholder} secureTextEntry={secureTextEntry} editable={editable} value={value} maxLength={maxLength} className='text-gray-400 bg-[#f4f4f431] w-4/5 h-8 rounded-[14px] border-2 text-center font-thin text-lg mb-4 outline-none'  onChangeText={onChangeText}></TextInput>
    </> );
}
 
export default Input;