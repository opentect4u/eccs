import React, { useState } from 'react';
import { View, useColorScheme, StyleSheet, ScrollView, ActivityIndicator, Image,PermissionsAndroid,Platform  } from 'react-native';
import { Text, Overlay, Input } from 'react-native-elements';
import HeaderComponent from '../Components/HeaderComponent';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Table, Row, Rows } from 'react-native-table-component';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
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
    color: '#a20a3a',
    fontSize: 20
  },
  inputAndroid: {
    color: '#a20a3a',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    margin: 10,
    fontSize: 20,
    fontWeight: '600',
    height: 50
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
  const [year, setYear] = useState('');
  const [noData, setNoData] = useState(false)
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
        setNoData(false)
        // console.log(response.data.msg[0].cl_interest, '-data')
        setResponseData(response.data.msg);
        console.log(responseData, 'response.data.msg')
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
      else if (response.data.suc === 0) {
        setNoData(true)
        setLoading(false)
      }
    }
    catch (error) {
      setLoading(false)
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
  const handleDownloadPDF = async (tableHead_cl, tableData_cl) => {
    try {
      // Check platform OS before requesting storage permission
      if (Platform.OS === 'android') {
        console.log('Requesting storage permission...');
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'This app needs permission to save PDF files to your device.',
            buttonPositive: 'OK',
          }
        );
  
        console.log('Permission result:', granted);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
         
          console.log('WRITE_EXTERNAL_STORAGE permission is granted');
          // Permission is granted, proceed with file operations
        } else {
          console.log('WRITE_EXTERNAL_STORAGE permission is not granted');
          // Permission is not granted, handle accordingly
        }
  
        // if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        //   throw new Error('Storage permission not granted');
        // }
      }
  
      // Prepare HTML content for the PDF
      const htmlContent = `
        <html>
          <head>
            <style>
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid #fdbd30;
                padding: 8px;
                text-align: center;
              }
              th {
                background-color: rgba(253, 189, 48, 0.1);
                font-weight: 700;
              }
            </style>
          </head>
          <body>
            <h1>Demand Report</h1>
            <table>
              <thead>
                <tr>
                Consumer Loan
                </tr>
              </thead>
              <tbody>
                abcd
              </tbody>
            </table>
          </body>
        </html>
      `;
  
      // Convert HTML content to PDF using RNHTMLtoPDF
      const { uri } = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: 'Demand_Report',
        directory: 'Documents',
      });
   
      console.log('PDF Generated:', uri);
  
      // Show success message
      // Toast.show({
      //   type: 'success',
      //   text1: 'PDF downloaded successfully!',
      //   visibilityTime: 2000,
      // });
    } catch (error) {
      // Handle permission errors
      if (error.message === 'Storage permission not granted') {
        console.log('Storage permission not granted');
        Toast.show({
          type: 'error',
          text1: 'Storage permission not granted!',
          visibilityTime: 2000,
        });
      } else {
        // Handle other errors
        console.error('Error generating PDF:', error);
        Toast.show({
          type: 'error',
          text1: 'Error generating PDF!',
          visibilityTime: 2000,
        });
      }
    }};

  
  return (
    <>
      <HeaderComponent />
      <View style={{
        height: 40,
        // backgroundColor: 'rgba(4,187,214,255)'
        backgroundColor: '#a20a3a'
      }}>
        <Text style={{ alignSelf: 'center', fontSize: 20, color: '#fdbd30', fontWeight: '800', top: 5, fontFamily: 'OpenSans-ExtraBold' }}>
          Demand Report
        </Text>
      </View>
      <View style={styles.container}>
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
          style={[{ borderRadius: 5, marginHorizontal: 10, backgroundColor: '#a20a3a', }, isdisabled && styles.disabledBtn]}
          textColor='white'
          icon={() => <Searchicon name="search-outline" size={20} color={'white'} />}
          mode="elevated" onPress={handleSearch} disabled={isdisabled}>
          Search
        </Button>
      </View>


      <ScrollView vertical>
        {isLoading && <ActivityIndicator color={"teal"} size={"large"} />}

        <View style={styles.containerRpt}>

          {/* {responseData && */}
          <View>

            {
              responseData.map((record, index) => (
                <View key={index} style={{ marginBottom: 10, padding: 15 }}>
                  <View style={{ height: 30 }}>
                    {/* <Text style={{ padding: 5, fontSize: 15, fontWeight: '900', fontFamily:'OpenSans-ExtraBold',color:'#a20a3a' }}>Month & Year: December,{valueYear}</Text> */}
                  </View>
                  <View style={{ marginBottom: 16 }}>
                    <Table borderStyle={{ borderWidth: 3, borderColor: '#fdbd30' }}>
                      <Row data={tableHead} style={{
                        height: 40,
                        // backgroundColor: '#f1f8ff'
                        backgroundColor: 'rgba(253, 189, 48, 0.1)'
                      }} textStyle={{ textAlign: 'center', margin: 6, fontWeight: '700', fontFamily: 'OpenSans-ExtraBold', color: isDarkMode ? 'black' : 'black' }} />
                      <Row data={tableLabels} textStyle={{ textAlign: 'left', margin: 6, fontFamily: 'OpenSans-ExtraBold', fontWeight: '700', color: isDarkMode ? 'black' : 'black' }} />
                      <Rows data={tableData} textStyle={{ textAlign: 'left', margin: 4, fontFamily: 'OpenSans-ExtraBold', color: isDarkMode ? 'black' : 'black' }} />
                    </Table>
                  </View>
                  <View style={{ marginBottom: 16 }}>
                    <Table borderStyle={{ borderWidth: 3, borderColor: '#fdbd30', }}>
                      <Row data={tableHead_tf} style={{
                        height: 40,
                        // backgroundColor: '#f1f8ff'
                        backgroundColor: 'rgba(253, 189, 48, 0.1)'
                      }} textStyle={{ textAlign: 'center', margin: 6, fontWeight: '700', fontFamily: 'OpenSans-ExtraBold', color: isDarkMode ? 'black' : 'black' }} />
                      <Row data={tableLabels_tf} textStyle={{ textAlign: 'left', margin: 6, fontFamily: 'OpenSans-ExtraBold', fontWeight: '700', color: isDarkMode ? 'black' : 'black' }} />
                      <Rows data={tableData_tf} textStyle={{ textAlign: 'left', margin: 6, fontFamily: 'OpenSans-ExtraBold', color: isDarkMode ? 'black' : 'black' }} />
                    </Table>
                  </View>
                  <View style={{ marginBottom: 16 }}>
                    <Table borderStyle={{ borderWidth: 3, borderColor: '#fdbd30' }}>
                      <Row data={tableHead_cl} style={{
                        height: 40,
                        // backgroundColor: '#f1f8ff' 
                        backgroundColor: 'rgba(253, 189, 48, 0.1)'
                      }} textStyle={{ textAlign: 'center', margin: 6, fontWeight: '700', fontFamily: 'OpenSans-ExtraBold', color: isDarkMode ? 'black' : 'black' }} />
                      <Row data={tableLabels_cl} textStyle={{ textAlign: 'left', margin: 6, fontFamily: 'OpenSans-ExtraBold', fontWeight: '700', color: isDarkMode ? 'black' : 'black' }} />
                      <Rows data={tableData_cl} textStyle={{ textAlign: 'left', margin: 6, fontFamily: 'OpenSans-ExtraBold', color: isDarkMode ? 'black' : 'black' }} />
                    </Table>
                  </View>
                  <View style={{ marginBottom: 16 }}>
                    <Table borderStyle={{
                      borderWidth: 3,
                      // borderColor: '#c8e1ff'
                      borderColor: '#fdbd30'
                    }}>
                      <Row data={tableHead_ltc} style={{
                        height: 40,
                        backgroundColor: 'rgba(253, 189, 48, 0.1)'
                      }} textStyle={{ textAlign: 'center', margin: 6, fontWeight: '700', fontFamily: 'OpenSans-ExtraBold', color: isDarkMode ? 'black' : 'black' }} />
                      <Row data={tableLabels_ltc} textStyle={{ textAlign: 'left', margin: 6, fontFamily: 'OpenSans-ExtraBold', fontWeight: '700', color: isDarkMode ? 'black' : 'black' }} />
                      <Rows data={tableData_ltc} textStyle={{ textAlign: 'left', margin: 6, fontFamily: 'OpenSans-ExtraBold', color: isDarkMode ? 'black' : 'black' }} />
                    </Table>
                  </View>
                  <Button
                    mode="contained"
                    onPress={handleDownloadPDF}
                    disabled={!responseData.length} // Disable button if no data
                    style={{ backgroundColor: '#a20a3a', paddingHorizontal: 20 }}>
                    Download PDF
                  </Button>
                </View>
              ))
            }
          </View>
        </View>


      </ScrollView>

      {noData &&

        <View style={styles.containerRpt}>
          <View style={{ height: 500, width: '100%', alignItems: 'center', marginTop: 30 }}>
            <Image source={require('../assets/nodata2.png')} style={{ resizeMode: 'contain', height: 70, width: '100%', alignSelf: 'center' }} />

            <Text style={{ color: '#a20a3a', fontSize: 17, alignSelf: 'center', fontFamily: 'OpenSans-ExtraBold', marginTop: 10 }}>No data Found..</Text>
          </View>
        </View>}

    </>
  );
};
const styles = StyleSheet.create({
  disabledBtn: {
    // backgroundColor: 'lightblue',
    backgroundColor: '#c28090',
    color: 'white'
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
    // backgroundColor: 'rgba(24,117,130,0.2)',
    backgroundColor: 'rgba(162, 10, 58, 0.1)',
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