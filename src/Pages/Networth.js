import React, { useState, useEffect } from 'react';
import { View, useColorScheme, StyleSheet, Text, ScrollView, ActivityIndicator,Image } from 'react-native';
import HeaderComponent from '../Components/HeaderComponent';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Table, Row, Rows } from 'react-native-table-component';
import Toast from 'react-native-toast-message';
import { BASE_URL } from '../config/config';
import { Button } from 'react-native-paper';
import Searchicon from 'react-native-vector-icons/Ionicons'
import axios from 'axios';
import { color } from 'react-native-elements/dist/helpers';


const pickerStyle = {
  inputIOS: {
    color: 'black',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    margin: 10,
    fontSize: 20,
    fontWeight: '600'
  },
  placeholder: {
    // color: '#a20a3a',
    color:'black',
    fontSize: 20
  },
  inputAndroid: {
    // color: '#a20a3a',
    color:'black',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    margin: 10,
    fontSize: 20,
    fontWeight: '600'
  },
};

const Networth = () => {

  const isDarkMode = useColorScheme() === 'dark'
  const [open, setOpen] = useState(false);
  const [openyear, setOpenyear] = useState(false);
  const [valueMonth, setValueMonth] = useState(null);
  const [valueYear, setValueYear] = useState(null);
  const [responseData, setResponseData] = useState([]);
  const [depositData, setdepositData] = useState([]);
  const [loanData, setloanData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false)

  // const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const handleSearch = async () => {
    setLoading(true)
   
    const asyncData = await AsyncStorage.getItem('member_id');

    // const apiParams = {
    //     tb_name:"td_demand_rpf",
    //     member_id:asyncData,
    //     month:valueMonth,
    //     year:valueYear
    //   };
    // console.log(apiParams,'apiParams')

    try {
      const response = await axios.get(`${BASE_URL}/api/networth_report?tb_name=${"td_networth_rpf"}&member_id=${1517}&month=${valueMonth}&year=${valueYear}`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data.msg, 'networth-dataxxxxxxxxxx')
      if (response.data.suc === 1) {
        // console.log(response.data.msg[0].ac_name, 'networth')
        setLoading(false)
        setNoData(false)
        setResponseData(response.data.msg);
        setdepositData(response.data.msg.filter(item => item.dep_loan_flag === 'D'))


        setloanData(response.data.msg.filter(item => item.dep_loan_flag === 'L'))
        console.log(loanData, 'lo')

      }
      else if(response.data.suc === 0) {
        setLoading(false)
        setNoData(true)

      }
    }
    catch (error) {
      setLoading(false)
      console.log(error);
    }
  };

  const isdisabled = !valueMonth || !valueYear

  let tableHead = ['A/C Type', 'Principal', 'Interest', 'ROI']
  let tableData = depositData.map(record => [
    record.ac_name.toString(),
    record.prn_amt.toString(),
    record.intt_amt.toString(),
    record.intt_rt.toString(),
  ]);
  let totalPrincipal = depositData.reduce((sum, record) => sum + record.prn_amt, 0);
  let totalRow = ['Total', totalPrincipal.toString(), '', ''];

  let tableHead_l = ['A/C Type', 'Principal', 'Interest', 'ROI']
  let tableData_l = loanData.map(record => [
    record.ac_name.toString(),
    record.prn_amt.toString(),
    record.intt_amt.toString(),
    record.intt_rt.toString(),
  ]);
  let totalPrincipal_l = loanData.reduce((sum, record) => sum + record.prn_amt, 0);
  let totalInt_l = loanData.reduce((sum, record) => sum + record.intt_amt, 0);
  let totalRow_l = ['Total', totalPrincipal_l.toString(), totalInt_l.toString(), ''];
  let totNetWorth = totalPrincipal_l - totalPrincipal
  console.log(totNetWorth, 'totNetWorth')
  let totNetWorthRow = ['Networth', totNetWorth.toString(), '', '']


  return (
    <><HeaderComponent />
      <View style={{ height: 40, 
        // backgroundColor: 'rgba(4,187,214,255)'
        // backgroundColor:'#a20a3a'
        backgroundColor:'#3f50b5'
         }}>
        <Text style={{ alignSelf: 'center', fontSize: 20, color: '#ffffff', top: 5, fontWeight: '700',fontFamily:'OpenSans-ExtraBold' }}>
          Net-Worth Report
        </Text>
      </View>


      <View style={styles.container}>
        <RNPickerSelect
          style={pickerStyle}
          placeholder={{
            label: 'Select Month',
            value: valueMonth,
          }}
          placeholderTextColor='#d2d4f9'
          onValueChange={(value) => setValueMonth(value)}
          items={[
            { label: 'January', value: '01' },
            { label: 'February', value: '02' },
            { label: 'March', value: '03' },
            { label: 'April', value: '04' },
            { label: 'May', value: '05' },
            { label: 'June', value: '06' },
            { label: 'July', value: '07' },
            { label: 'August', value: '08' },
            { label: 'September', value: '09' },
            { label: 'October', value: '10' },
            { label: 'November', value: '11' },
            { label: 'December', value: '12' },
          ]}
        />
        <RNPickerSelect
          style={pickerStyle}
          placeholder={{
            label: 'Select Year',
            value: valueYear,
          }}
          onValueChange={(value) => setValueYear(value)}
          items={[
            { label: '2024', value: '2024' },
            { label: '2023', value: '2023' },
            { label: '2022', value: '2022' },
            { label: '2021', value: '2021' },
          ]}
        />
        <Button
          style={[{ borderRadius: 5, marginHorizontal: 10,backgroundColor:'#3f50b5'},isdisabled && styles.disabledBtn ]}
          textColor='white'
          icon={() => <Searchicon name="search-outline" size={20} color={'white'}/>}
          mode="elevated" onPress={handleSearch} disabled={isdisabled}>
          Search
        </Button>



      </View>
      <ScrollView vertical>
      <View style={{ padding: 10 }}>
        
        {isLoading && <ActivityIndicator color={'#3f50b5'} size={"large"} />}
        {responseData?.length > 0 &&
         

            <View style={styles.containerRpt}>

              {depositData?.length > 0 &&
                <><View style={{ height: 40, 
                // backgroundColor: '#f1f8ff'
                // backgroundColor:'rgba(253, 189, 48, 0.1)'
                backgroundColor: '#e9eafc'
                 }}>
                  <Text style={{ alignSelf: 'center', fontSize: 18, color: 'black', top: 5, fontWeight: '700', fontFamily:'OpenSans-ExtraBold' }}>
                    Liability
                  </Text>
                </View>
                  <View style={{ marginBottom: 16 }}>
                    <Table borderStyle={{ borderWidth: 1,
                      //  borderColor: '#fdbd30'
                      borderColor: '#3f50b5' 
                        }}>
                      <Row data={tableHead} style={{ height: 40, 
                        // backgroundColor: '#f1f8ff'
                        // backgroundColor:'rgba(253, 189, 48, 0.1)',
                        backgroundColor: '#e9eafc'
                         }} textStyle={{ margin: 6, fontWeight: '700', fontFamily:'OpenSans-ExtraBold',color:isDarkMode? 'black':'black' }} />
                      <Rows data={tableData} textStyle={{ margin: 6,color:isDarkMode? 'black':'black' }} />
                      {/* {depositData.map((rowData, index) => (
      <Row key={index} data={rowData} textStyle={{ margin: 6 }} />
    ))} */}

                      {/* Total Row */}
                      <Row data={totalRow} style={{ height: 40,
                        //  backgroundColor: '#f1f8ff'
                        // backgroundColor:'rgba(253, 189, 48, 0.1)'
                        backgroundColor: '#e9eafc' 
                         }} textStyle={{ margin: 6, fontWeight: 'bold',color:isDarkMode? 'black':'black' }} />
                    </Table>
                  </View></>}

              {loanData?.length > 0 &&
                <><View style={{ height: 40, 
                // backgroundColor: '#f1f8ff' 
                // backgroundColor:'rgba(253, 189, 48, 0.1)'
                backgroundColor: '#e9eafc'
                }}>
                  <Text style={{ alignSelf: 'center', fontSize: 18, color: 'black', top: 5, fontWeight: '700', fontFamily:'OpenSans-ExtraBold' }}>
                    Asset
                  </Text>
                </View>
                  <View style={{ marginBottom: 16 }}>
                    <Table borderStyle={{ borderWidth: 1,  borderColor: '#3f50b5' }}>
                      <Row data={tableHead_l} style={{ height: 40, 
                        // backgroundColor: '#f1f8ff'
                        // backgroundColor:'rgba(253, 189, 48, 0.1)'
                        backgroundColor: '#e9eafc'
                        }} textStyle={{ margin: 6, fontWeight: '700',color:isDarkMode? 'black':'black' }} />
                      <Rows data={tableData_l} textStyle={{ margin: 6,color:isDarkMode? 'black':'black' }} />
                      {/* {depositData.map((rowData, index) => (
      <Row key={index} data={rowData} textStyle={{ margin: 6 }} />
    ))} */}

                      {/* Total Row */}
                      <Row data={totalRow_l} style={{ height: 40, 
                        // backgroundColor: '#f1f8ff'
                        // backgroundColor:'rgba(253, 189, 48, 0.1)'
                        backgroundColor: '#e9eafc'
                         }} textStyle={{ margin: 6, fontWeight: 'bold',color:isDarkMode? 'black':'black' }} />
                      <Row data={totNetWorthRow} style={{ height: 40, 
                        // backgroundColor: '#f1f8ff' 
                        // backgroundColor:'rgba(253, 189, 48, 0.1)'
                        backgroundColor: '#e9eafc'
                        }} textStyle={{ margin: 6, fontWeight: 'bold',color:isDarkMode? 'black':'black' }} />
                    </Table>
                  </View></>

              }






              {/* <View style={{borderWidth:1,borderColor:'black' , height:'auto'}}>
        <Text style={{alignSelf:'center',fontSize:20,fontWeight:'900'}}>
          Asset
        </Text>
        {depositData.map((record, index) => (
        <View key={index} style={{ marginBottom: 10, borderWidth: 1, borderColor: '#ccc', padding: 10, backgroundColor: 'rgba(24,117,130,0.1)', borderRadius:10,borderEndWidth:1,borderColor:'black' }}>
          
          <Text style={{padding:2,fontWeight:'600',fontSize:18}}> A/C Type :{record.ac_name}</Text>
          <Text style={{padding:2,fontWeight:'600',fontSize:18}}> Principal :{record.prn_amt}</Text>  
          <Text style={{padding:2,fontWeight:'600',fontSize:18}}> Interest :{record.intt_amt}</Text> 
          <Text style={{padding:2,fontWeight:'600',fontSize:18}}> ROI :{record.intt_rt}</Text> 
          </View>
          
          ))}
          
       </View> */}
              {/* <View style={{borderWidth:1,borderColor:'black' , height:'auto'}}>
        <Text style={{alignSelf:'center',fontSize:20,fontWeight:'900'}}>
          Liability
        </Text>
        {loanData.map((record, index) => (
        <View key={index} style={{ marginBottom: 10 }}>

          <Text style={{padding:2,fontWeight:'600',fontSize:18}}> A/C Type :{record.ac_name}</Text>
          <Text style={{padding:2,fontWeight:'600',fontSize:18}}> Principal :{record.prn_amt}</Text>  
          <Text style={{padding:2,fontWeight:'600',fontSize:18}}> Interest :{record.intt_amt}</Text> 
          <Text style={{padding:2,fontWeight:'600',fontSize:18}}> ROI :{record.intt_rt}</Text>    
          </View>
          ))}
          </View> */}

            </View>
          
        }</View>
        </ScrollView>
    {noData &&
    <View style={styles.containerRpt}>
      <View style={{ height: 500, width: '100%', alignItems: 'center', marginTop: 30 }}>
        <Image source={require('../assets/nodata4.png')} style={{ resizeMode: 'contain', height: 70, width: '100%', alignSelf: 'center' }} />

        <Text style={{ color: '#3f50b5', fontSize: 17, alignSelf: 'center', fontFamily:'OpenSans-ExtraBold', marginTop: 10 }}>No data Found..</Text>
      </View>
    </View>}
    </>
  );
};

const styles = StyleSheet.create({
  containerRpt: {
    height: 'auto',
    backgroundColor: 'white',
    top: 10
  },
  container: {
    // backgroundColor:'rgba(162, 10, 58, 0.1)',
    backgroundColor:'#d2d4f9',
    zIndex: 10,
    fontFamily:'OpenSans-ExtraBold',
    padding: 10
  },
  overlayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15

  },
  dropdownContainer: {
    flex: 1,
    height: 40,
    margin: 5,
  },
  dropdown: {
    backgroundColor: 'white',
    borderColor: 'rgba(24, 117, 130, 0.4)',
    fontFamily:'OpenSans-ExtraBold'
  },
  dropdownItem: {
    justifyContent: 'flex-start',
    fontFamily:'OpenSans-ExtraBold'
  },
  dropdownList: {
    backgroundColor: 'rgba(24, 117, 130, 0.4)',
    height: 100,
    zIndex: 10,
    fontFamily:'OpenSans-ExtraBold'
  },
  searchButtonContainer: {
    backgroundColor: 'white'
  },
  searchButton: {
    backgroundColor: 'sky',
    height: 30,
    width: 30,
  },
  disabledBtn: {
    // backgroundColor: 'lightblue', 
    // backgroundColor:'#c28090',
    backgroundColor:'#9298ed',
    color:'white'
  },
});

export default Networth;