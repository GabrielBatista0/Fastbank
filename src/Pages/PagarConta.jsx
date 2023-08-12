import React, { useState,useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert,Button } from 'react-native';
import { TextInput } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { data } from 'autoprefixer'; 
import {SERVIDOR} from "@env"
import { BarCodeScanner } from 'expo-barcode-scanner';

const Pagarconta = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
  
    useEffect(() => {
      const getBarCodeScannerPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      };
  
      getBarCodeScannerPermissions();
    }, []);
  
    const handleBarCodeScanned = ({ type, data }) => {
      setScanned(true);
      alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };
  
    if (hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }
  
    return ( 
        <>
            <View className="bg-black w-full h-full flex flex-col p-4">
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            />
            {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
            <View className="flex w-full items-center justify-center">
            <TouchableOpacity className="bg-[#0ACF53] h-16 w-60 rounded-[20px] mb-[43px] flex justify-center items-center mt-9 hover:bg-[#30B561]" onPress={Transferir}><Text className="text-white font-semibold text-2xl">Transferir</Text></TouchableOpacity>
            </View>
          </View>
        
        </> 
    );
}
 
export default Pagarconta;