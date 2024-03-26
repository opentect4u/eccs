import RouteGaurdContext from './AuthGuard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
 
const RouteGaurdProvider = ({children}) =>{

    const [authDT,setAuthDT] = useState(null);
    useEffect(() => {

               const  fetchStorageDT = async () =>{
                    const authDT = await AsyncStorage.getItem('login_data');
                    setAuthDT(authDT);
               }
        
               fetchStorageDT();
    }, [])
    
    return ( 
        <RouteGaurdContext.Provider value={{authDT, setAuthDT}}>
                            {children}
        </RouteGaurdContext.Provider>                                        
       )


}

export default RouteGaurdProvider;