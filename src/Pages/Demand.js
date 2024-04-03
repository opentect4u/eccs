import React, { useState } from 'react';
import { View, useColorScheme, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Overlay, Input } from 'react-native-elements';
import HeaderComponent from '../Components/HeaderComponent';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Table, Row, Rows } from 'react-native-table-component';
import Toast from 'react-native-toast-message';
import { BASE_URL } from '../config/config';
import { Button } from 'react-native-paper';
import Searchicon from 'react-native-vector-icons/Ionicons'
import axios from 'axios';
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
    color: 'black',
    fontSize: 20
  },
  inputAndroid: {
    color: 'black',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    margin: 10,
    fontSize: 20,
    fontWeight: '600',
    height:50
  },
};
const Demand = () => {
  const isDarkMode = useColorScheme() === 'dark'
  const [open, setOpen] = useState(false);
  const [openyear, setOpenyear] = useState(false);
  const [valueMonth, setValueMonth] = useState(null);
  const [valueYear, setValueYear] = useState(null);
  const [responseData, setResponseData] = useState([]);
  const [total, settotal] = useState([0]);
  const [isLoading, setLoading] = useState(false)
  // const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const handleSearch = async () => {
    setLoading(true)
    // Implement your search logic here
    // console.log('Selected Month:', valueMonth);
    // console.log('Selected Year:', valueYear);
    const asyncData = await AsyncStorage.getItem('member_id');

    const apiParams = {
      tb_name: "td_demand_rpf",
      member_id: 1517,
      month: valueMonth,
      year: valueYear
    };
    

    try {
      const response = await axios.get(`${BASE_URL}/api/demand_report?tb_name=${"td_demand_rpf"}&member_id=${1517}&month=${valueMonth}&year=${valueYear}`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(response.data, 'demand-data')
      if (response.data.suc === 1) {
        setLoading(false)

        // console.log(response.data.msg[0].cl_interest, '-data')
        setResponseData(response.data.msg);
        // console.log(responseData[0].gl_principal,'responseData')
        const totalValue =
          parseFloat(responseData[0].gl_principal) +
          parseFloat(responseData[0].gl_interest) +
          parseFloat(responseData[0].tf_prn) +
          parseFloat(responseData[0].cl_principal) +
          parseFloat(responseData[0].cl_interest) +
          parseFloat(responseData[0].ltc_prn) +
          parseFloat(responseData[0].ltc_intt);
        settotal(totalValue)
        //  console.log(total,'gl_principal')
      }
      else {
        setLoading(false)

        Toast.show({

          type: 'error',
          text1: 'No Data Found',
          visibilityTime: 5000
        })
      }
    }
    catch (error) {
      setLoading(false)

      // console.log(error);
    }
  };
  const tableHead = ['General Loan']
  const tableLabels = ['Recov GLIntl No.', 'Total GLIntl No.', 'Prinpl GL', 'Last GLLoan', 'O/S GLBal.', 'GLInt. Claim'];
  let tableData = responseData.map(record => [
    record.gl_run.toString(),
    record.gl_tot.toString(),
    record.gl_principal.toString(),
    record.gl_loan_amt.toString(),
    record.gl_outstanding.toString(),
    record.gl_interest.toString(),
  ]
  );
  const tableHead_tf = ['Thrift Fund']
  const tableLabels_tf = ['TF'];
  let tableData_tf = responseData.map(record => [
    record.tf_prn.toString(),
  ]
  );
  const tableLabelsAndData = tableLabels_tf.map((label, index) => ({
    label,
    data: tableData_tf[index],
  }));
  const tableHead_cl = ['Consumer Loan']
  const tableLabels_cl = ['Recov CLIntl No.', 'Total CLIntl No', 'Prinpl CL', 'Last CLLoan', 'O/S CLBal.', 'CLInt. Claim'];
  let tableData_cl = responseData.map(record => [
    record.cl_run.toString(),
    record.cl_tot.toString(),
    record.cl_principal.toString(),
    record.cl_loan_amt.toString(),
    record.cl_outstanding.toString(),
    record.cl_interest.toString(),
  ]
  );
  const tableHead_ltc = ['LTC']
  const tableLabels_ltc = ['Recov LTCIntl No.', 'Total LTCIntl No', 'Prinpl LTC', 'Last LTCLoan', 'O/S LTCBal.', 'LTCInt. Claim'];
  let tableData_ltc = responseData.map(record => [
    record.ltc_curent_instl.toString(),
    record.ltc_tot_instl.toString(),
    record.ltc_prn.toString(),
    record.ltc_sanc_amt.toString(),
    record.ltc_curr_prn.toString(),
    record.ltc_intt.toString(),
  ]
  );
  const isdisabled = !valueMonth || !valueYear
  return (
    <>
      <HeaderComponent />
      <View style={{ height: 40, backgroundColor: 'rgba(4,187,214,255)' }}>
        <Text style={{ alignSelf: 'center', fontSize: 20, color: 'white', fontWeight: '800', top: 5, fontFamily: 'Roboto' }}>
          Demand Report

        </Text>
      </View>
      <View style={styles.container}>
        {/* <View style={styles.overlayContainer}>
          <DropDownPicker
            open={open}
            setOpen={setOpen}
            setValue={setValueMonth}
            value={valueMonth}
            listMode="MODAL"
            items={[
              { label: 'January', value: '01' },
              { label: 'February', value: '02' },
              { label: 'March', value: '03' },
              { label: 'December', value: '12' },
              { label: 'April', value: '04' },
              { label: 'May', value: '05' },
              { label: 'June', value: '06' },
              { label: 'July', value: '07' },
              { label: 'August', value: '08' },
              { label: 'September', value: '09' },
              { label: 'October', value: '10' },
              { label: 'November', value: '11' },
             
              // Add other months here
            ]}
            placeholder="Select Month"
            containerStyle={styles.dropdownContainer}
            style={styles.dropdown}
            itemStyle={styles.dropdownItem}
            dropDownStyle={styles.dropdownList}/>
          <DropDownPicker
            open={openyear}
            setOpen={setOpenyear}
            setValue={setValueYear}
            value={valueYear}
            items={[
              // { label: '2024', value: '2024' },
              { label: '2023', value: '2023' },
              // { label: '2022', value: '2022' },
              // { label: '2021', value: '2021' },
              // Add other years as needed
            ]}
            placeholder="Select Year"
            defaultValue={year}
            containerStyle={styles.dropdownContainer}
            style={styles.dropdown}
            itemStyle={styles.dropdownItem}
            dropDownStyle={styles.dropdownList}/>
          <TouchableOpacity
            title="Search"
            onPress={handleSearch}
            containerStyle={styles.searchButtonContainer}
            buttonStyle={styles.searchButton}
          >
            <Image source={require('../assets/search.png')} style={{ width: 30, height: 30,top:5 }} />
          </TouchableOpacity>
        </View> */}
        <RNPickerSelect
          style={pickerStyle}
          placeholder={{
            label: 'Select Month',
            value: valueMonth,
          }}
          placeholderTextColor="red"
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
          style={[{ borderRadius: 5, marginHorizontal: 10,backgroundColor: 'rgba(4,187,214,255)'},isdisabled && styles.disabledBtn ]}

          icon={() => <Searchicon name="search-outline" size={20} />}
          mode="elevated" onPress={handleSearch} disabled={isdisabled}>
          Search
        </Button>
      </View>

      <ScrollView vertical>
        {isLoading && <ActivityIndicator color={"teal"} size={"large"} />}

        <View style={styles.containerRpt}>
          {responseData.map((record, index) => (
            <View key={index} style={{ marginBottom: 10, padding: 15 }}>
              <View style={{ height: 30 }}>
                <Text style={{ padding: 5, fontSize: 15, fontWeight: '900', fontFamily: 'Roboto' }}>Month & Year: December,{valueYear}</Text>
              </View>
              <View style={{ marginBottom: 16 }}>
                <Table borderStyle={{ borderWidth: 3, borderColor: '#c8e1ff' }}>
                  <Row data={tableHead} style={{ height: 40, backgroundColor: '#f1f8ff' }} textStyle={{ textAlign: 'center', margin: 6, fontWeight: '700', fontFamily: 'Roboto',color:isDarkMode? 'black':'black' }} />
                  <Row data={tableLabels} textStyle={{ textAlign: 'left', margin: 6, fontFamily: 'Roboto', fontWeight: '700',color:isDarkMode? 'black':'black' }} />
                  <Rows data={tableData} textStyle={{ textAlign: 'left', margin: 4, fontFamily: 'Roboto',color:isDarkMode? 'black':'black' }} />
                </Table>
              </View>
              <View style={{ marginBottom: 16 }}>
                <Table borderStyle={{ borderWidth: 3, borderColor: '#c8e1ff', }}>
                  <Row data={tableHead_tf} style={{ height: 40, backgroundColor: '#f1f8ff' }} textStyle={{ textAlign: 'center', margin: 6, fontWeight: '700', fontFamily: 'Roboto',color:isDarkMode? 'black':'black' }} />
                  <Row data={tableLabels_tf} textStyle={{ textAlign: 'left', margin: 6, fontFamily: 'Roboto', fontWeight: '700',color:isDarkMode? 'black':'black' }} />
                  <Rows data={tableData_tf} textStyle={{ textAlign: 'left', margin: 6, fontFamily: 'Roboto',color:isDarkMode? 'black':'black' }} />
                </Table>
              </View>
              <View style={{ marginBottom: 16 }}>
                <Table borderStyle={{ borderWidth: 3, borderColor: '#c8e1ff' }}>
                  <Row data={tableHead_cl} style={{ height: 40, backgroundColor: '#f1f8ff' }} textStyle={{ textAlign: 'center', margin: 6, fontWeight: '700', fontFamily: 'Roboto',color:isDarkMode? 'black':'black' }} />
                  <Row data={tableLabels_cl} textStyle={{ textAlign: 'left', margin: 6, fontFamily: 'Roboto', fontWeight: '700',color:isDarkMode? 'black':'black' }} />
                  <Rows data={tableData_cl} textStyle={{ textAlign: 'left', margin: 6, fontFamily: 'Roboto',color:isDarkMode? 'black':'black' }} />
                </Table>
              </View>
              <View style={{ marginBottom: 16 }}>
                <Table borderStyle={{ borderWidth: 3, borderColor: '#c8e1ff' }}>
                  <Row data={tableHead_ltc} style={{ height: 40, backgroundColor: '#f1f8ff' }} textStyle={{ textAlign: 'center', margin: 6, fontWeight: '700', fontFamily: 'Roboto',color:isDarkMode? 'black':'black' }} />
                  <Row data={tableLabels_ltc} textStyle={{ textAlign: 'left', margin: 6, fontFamily: 'Roboto', fontWeight: '700',color:isDarkMode? 'black':'black' }} />
                  <Rows data={tableData_ltc} textStyle={{ textAlign: 'left', margin: 6, fontFamily: 'Roboto',color:isDarkMode? 'black':'black' }} />
                </Table>
              </View>
              {/* <Text style={{ fontWeight: '900', padding: 10, fontSize: 19, fontFamily: 'Roboto' }}>General Loan:</Text> */}
              {/* <View style={{height:'auto',borderWidth:1,borderRadius:10,width:'95%',left:10, backgroundColor: 'rgba(24,117,130,0.1)',padding:10}}>
          <Text style={{padding:2,fontWeight:'600',fontSize:18,fontFamily: 'monospace',marginBottom: 5}}> Recov GLIntl No. : {record.gl_run}</Text>
          <Text style={{padding:2,fontWeight:'600',fontSize:18,fontSize:18,fontFamily: 'monospace',marginBottom: 5}}> Total GLIntl No. : {record.gl_tot}</Text>
          <Text style={{padding:2,fontWeight:'600',fontSize:18,fontFamily: 'monospace',marginBottom: 5}}> Prinpl GL        : {record.gl_principal}</Text>
          <Text style={{padding:2,fontWeight:'600',fontSize:18,fontFamily: 'monospace',marginBottom: 5}}> Last GLLoan      : {record.gl_loan_amt}</Text>
          <Text style={{padding:2,fontWeight:'600',fontSize:18,fontFamily: 'monospace',marginBottom: 5}}> O/S GLBal.       : {record.gl_outstanding}</Text>
          <Text style={{padding:2,fontWeight:'600',fontSize:18,fontFamily: 'monospace',marginBottom: 5}}> GLInt. Claim     : {record.gl_interest}</Text>
          
          </View> */}
              {/* <Text style={{ fontWeight: '900', padding: 10, fontSize: 19 }}>TF:</Text>
              <View style={{ height: 'auto', borderWidth: 1, borderRadius: 10, width: '95%', left: 10, backgroundColor: 'rgba(24,117,130,0.1)', padding: 10 }}>
                <Text style={{ padding: 2, fontWeight: '600', fontSize: 18, fontFamily: 'monospace', marginBottom: 5 }} > TF               :{record.tf_prn}</Text>
              </View> */}

              {/* <Text style={{ fontWeight: '900', padding: 10, fontSize: 19, fontFamily: 'Roboto' }}> Consumer Loan:</Text>
              <View style={{ height: 'auto', borderWidth: 1, borderRadius: 10, width: '95%', left: 10, backgroundColor: 'rgba(24,117,130,0.1)', padding: 10 }}>
                <Text style={{ padding: 2, fontWeight: '600', fontSize: 18, fontFamily: 'monospace', marginBottom: 5 }}> Recov CLIntl No. :{record.cl_run}</Text>
                <Text style={{ padding: 2, fontWeight: '600', fontSize: 18, fontFamily: 'monospace', marginBottom: 5 }}> Total CLIntl No  :{record.cl_tot}</Text>
                <Text style={{ padding: 2, fontWeight: '600', fontSize: 18, fontFamily: 'monospace', marginBottom: 5 }}> Prinpl CL        :{record.cl_principal}</Text>
                <Text style={{ padding: 2, fontWeight: '600', fontSize: 18, fontFamily: 'monospace', marginBottom: 5 }}> Last CLLoan      :{record.cl_loan_amt}</Text>
                <Text style={{ padding: 2, fontWeight: '600', fontSize: 18, fontFamily: 'monospace', marginBottom: 5 }}> O/S CLBal.       :{record.cl_outstanding}</Text>
                <Text style={{ padding: 2, fontWeight: '600', fontSize: 18, fontFamily: 'monospace', marginBottom: 5 }}> CLInt. Claim     :{record.cl_interest}</Text>
              </View> */}

              {/* <Text style={{ fontWeight: '900', padding: 10, fontSize: 19, fontFamily: 'Roboto' }}>LTC:</Text>
              <View style={{
                height: 'auto', borderWidth: 1, borderRadius: 10, width: '95%', left: 10,
                backgroundColor: 'rgba(24,117,130,0.1)', padding: 10
              }}>
                <Text style={{ padding: 2, fontWeight: '600', fontSize: 18, fontFamily: 'monospace', marginBottom: 5 }}> Recov LTCIntl No. :{record.ltc_curent_instl}</Text>
                <Text style={{ padding: 2, fontWeight: '600', fontSize: 18, fontFamily: 'monospace', marginBottom: 5 }}> Total LTCIntl No. :{record.ltc_tot_instl}</Text>
                <Text style={{ padding: 2, fontWeight: '600', fontSize: 18, fontFamily: 'monospace', marginBottom: 5 }}> Prinpl LTC        :{record.ltc_prn}</Text>
                <Text style={{ padding: 2, fontWeight: '600', fontSize: 18, fontFamily: 'monospace', marginBottom: 5 }}> Last LTCLoan      :{record.ltc_sanc_amt}</Text>
                <Text style={{ padding: 2, fontWeight: '600', fontSize: 18, fontFamily: 'monospace', marginBottom: 5 }}> O/S LTCBal.       :{record.ltc_curr_prn}</Text>
                <Text style={{ padding: 2, fontWeight: '600', fontSize: 18, fontFamily: 'monospace', marginBottom: 5 }}> LTCInt. Claim     :{record.ltc_intt}</Text>
              </View> */}
              {/* <Text style={{fontWeight:'900',padding:10,fontSize:19}}>TOTAL CLAIM :</Text>
          <View style={{height:40,borderWidth:1,borderRadius:10,width:'95%',left:10,backgroundColor: 'rgba(24,117,130,0.1)'}}>
          <Text style={{padding:2,fontWeight:'600',fontSize:18}} > Total:{total}</Text>
          </View> */}




              {/* <Text>cl_id:{record.cl_id}</Text> */}
              {/* <Text>cl_interest:{record.cl_interest}</Text> */}
              {/* <Text>cl_loan_amt:{record.cl_loan_amt}</Text> */}
              {/* <Text>cl_outstanding:{record.cl_outstanding}</Text> */}
              {/* <Text>cl_principal:{record.cl_principal}</Text> */}
              {/* <Text>cl_run:{record.cl_run}</Text> */}
              {/* <Text>cl_tot:{record.cl_tot}</Text> */}
              {/* <Text>created_at:{record.created_at}</Text>
          <Text>dob:{record.dob}</Text>
          <Text>emp_code:{record.emp_code}</Text>
          <Text>gl_id:{record.gl_id}</Text> */}
              {/* <Text>gl_interest:{record.gl_interest}</Text> */}
              {/* <Text>gl_loan_amt:{record.gl_loan_amt}</Text> */}
              {/* <Text>gl_outstanding:{record.gl_outstanding}</Text> */}
              {/* <Text>gl_principal:{record.gl_principal}</Text> */}
              {/* <Text>gl_run:{record.gl_run}</Text> */}
              {/* <Text>gl_tot:{record.gl_tot}</Text> */}
              {/* <Text>ltc_curent_instl:{record.ltc_curent_instl}</Text> */}
              {/* <Text>ltc_curr_prn:{record.ltc_curr_prn}</Text> */}
              {/* <Text>ltc_id:{record.ltc_id}</Text> */}
              {/* <Text>ltc_intt:{record.ltc_intt}</Text> */}
              {/* <Text>ltc_prn:{record.ltc_prn}</Text> */}
              {/* <Text>ltc_sanc_amt:{record.ltc_sanc_amt}</Text> */}
              {/* <Text>ltc_tot_instl:{record.ltc_tot_instl}</Text> */}
              {/* <Text>member_id:{record.member_id}</Text>
          
          <Text>Member Name: {record.member_name}</Text>
          <Text>CL Interest: {record.cl_interest}</Text>
          <Text>GL Interest: {record.gl_interest}</Text>
          <Text>Total Demand: {record.total_demand}</Text> */}
              {/* Add more Text components for other properties */}
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  disabledBtn: {
    backgroundColor: 'lightblue', 
  },
  containerRpt: {
    height: 'auto',
    backgroundColor: 'white',
    top: 10
  },
  container: {
    //   flex: 1,
    //   justifyContent: 'center',
    //   alignItems: 'center',
    // height: 100,
    backgroundColor: 'rgba(24,117,130,0.2)',
    zIndex: 10,
    fontFamily: 'Roboto',
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
    fontFamily: 'Roboto'
  },
  dropdownItem: {
    justifyContent: 'flex-start',
    fontFamily: 'Roboto'
  },
  dropdownList: {
    backgroundColor: 'rgba(24, 117, 130, 0.4)',
    height: 100,
    zIndex: 10,
    fontFamily: 'Roboto'
  },
  searchButtonContainer: {
    // marginLeft: 10,
    backgroundColor: 'white'
  },
  searchButton: {
    backgroundColor: 'sky',
    height: 30,
    width: 30,
  },
});
export default Demand;