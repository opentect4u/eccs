import React, { useState, useEffect } from 'react';
import { View, useColorScheme, StyleSheet, ScrollView, ActivityIndicator, Image, PermissionsAndroid, Platform, ImageBackground,Linking } from 'react-native';
import { SCREEN_HEIGHT } from 'react-native-normalize';
import { Text, Overlay, Input } from 'react-native-elements';
import HeaderComponent from '../Components/HeaderComponent';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Table, Row, Rows } from 'react-native-table-component';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFetchBlob from 'rn-fetch-blob';
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
    color: '#3f50b5',
    fontSize: 20
  },
  inputAndroid: {
    color: '#3f50b5',
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
  const welcomContHeight = 0.25 * SCREEN_HEIGHT;
  const isDarkMode = useColorScheme() === 'dark'
  const [open, setOpen] = useState(false);
  const [openyear, setOpenyear] = useState(false);
  const [valueMonth, setValueMonth] = useState(null);
  const [valueYear, setValueYear] = useState(null);
  const [responseData, setResponseData] = useState([]);
  const [memberID, setMemberID] = useState('')
  const [total, settotal] = useState([0]);
  const [isLoading, setLoading] = useState(false)
  const [year, setYear] = useState('');
  const [noData, setNoData] = useState(false)
  const [filepath, setfilepath] = useState('')
  const [db, setDB] = useState([]);
  const [dk, setDK] = useState([]);
  const [dm, setDM] = useState([]);



  useEffect(() => {
    GetStorage();
    downloadRes();
  }, [])

  const downloadRes = async () => {
    setLoading(true)
    const asyncData = await AsyncStorage.getItem(`login_data`);
    const bankId = JSON.parse(asyncData)?.bank_id

    try {
        const response = await axios.get(`${BASE_URL}/api/get_loan_form`, {}, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
      console.log(response.data, 'get_loan_form demand')
        
        if (response.data.suc === 1) {
            setLoading(false)
            // setResponseData(response.data.msg);
            const data = response.data.msg;
            const filtered = data.filter(item => ['DB', 'DK', 'DM'].includes(item.flag));
            setResponseData(filtered);
        }
        else {
            setLoading(false)
            Toast.show({
                type: 'error',
                text1: 'error!',
                visibilityTime: 5000
            })
        }
    }
    catch (error) {
        // setLoading(false)
        console.log(error);
    }
};
const handleDownload = (fileUrl) => {
  Linking.openURL(`${BASE_URL}/${fileUrl}`)
      .then(() => {
          // console.log('URL opened successfully');
      })
      .catch((err) => {
          console.error('An error occurred while opening the URL:', err);
      });
};
// old 
  const GetStorage = async () => {
    try {
      const asyncData = await AsyncStorage.getItem(`login_data`);
      setMemberID(JSON.parse(asyncData)?.member_id)
    }
    catch (err) {
      console.log(err);
    }

  }
  // const handleSearch = async () => {
  //   setLoading(true)
  //   console.log(memberID, 'member_id in demand')
  //   try {
  //     const response = await axios.get(`${BASE_URL}/api/demand_report?tb_name=${"td_demand"}&member_id=${memberID}&month=${valueMonth}&year=${valueYear}`, {}, {
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     console.log(response.data, 'demand-data')
  //     if (response.data.suc === 1) {
  //       setLoading(false)
  //       setNoData(false)
  //       setResponseData(response.data.msg);
  //       console.log(responseData, 'response.data.msg')
  //       const totalValue =
  //         parseFloat(responseData[0].gl_principal) +
  //         parseFloat(responseData[0].gl_interest) +
  //         parseFloat(responseData[0].tf_prn) +
  //         parseFloat(responseData[0].cl_principal) +
  //         parseFloat(responseData[0].cl_interest) +
  //         parseFloat(responseData[0].ltc_prn) +
  //         parseFloat(responseData[0].ltc_intt);
  //       settotal(totalValue)

  //     }
  //     else if (response.data.suc === 0) {
  //       setNoData(true)
  //       setLoading(false)
  //     }
  //   }
  //   catch (error) {
  //     setLoading(false)
  //   }

  // };


  // const tableHead = ['General Loan']
  // const tableLabels = ['Recov GLIntl No.', 'Total GLIntl No.', 'Prinpl GL', 'Last GLLoan', 'O/S GLBal.', 'GLInt. Claim'];
  // let tableData = responseData.map(record => [
  //   record.gl_run.toString(),
  //   record.gl_tot.toString(),
  //   record.gl_principal.toString(),
  //   record.gl_loan_amt.toString(),
  //   record.gl_outstanding.toString(),
  //   record.gl_interest.toString(),
  // ]
  // );
  // const tableHead_tf = ['Thrift Fund']
  // const tableLabels_tf = ['TF'];
  // let tableData_tf = responseData.map(record => [
  //   record.tf_prn.toString(),
  // ]
  // );
  // const tableLabelsAndData = tableLabels_tf.map((label, index) => ({
  //   label,
  //   data: tableData_tf[index],
  // }));
  // const tableHead_cl = ['Consumer Loan']
  // const tableLabels_cl = ['Recov CLIntl No.', 'Total CLIntl No', 'Prinpl CL', 'Last CLLoan', 'O/S CLBal.', 'CLInt. Claim'];
  // let tableData_cl = responseData.map(record => [
  //   record.cl_run.toString(),
  //   record.cl_tot.toString(),
  //   record.cl_principal.toString(),
  //   record.cl_loan_amt.toString(),
  //   record.cl_outstanding.toString(),
  //   record.cl_interest.toString(),
  // ]
  // );
  // const tableHead_ltc = ['LTC']
  // const tableLabels_ltc = ['Recov LTCIntl No.', 'Total LTCIntl No', 'Prinpl LTC', 'Last LTCLoan', 'O/S LTCBal.', 'LTCInt. Claim'];
  // let tableData_ltc = responseData.map(record => [
  //   record.ltc_curent_instl.toString(),
  //   record.ltc_tot_instl.toString(),
  //   record.ltc_prn.toString(),
  //   record.ltc_sanc_amt.toString(),
  //   record.ltc_curr_prn.toString(),
  //   record.ltc_intt.toString(),
  // ]
  // );
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
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          throw new Error('Storage permission not granted');
        }
      }

      // Prepare HTML content for the PDF
      const htmlContent = `
      <html>
        <head>
        <title>Cooperative Credit Society</title>
        <style>
        body {
            font-family: Arial, sans-serif;
            padding: 30px;
        }
        .headerDiv {
            text-align: center;
            margin-bottom: 10px;
        }
        .header {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .address {
            font-size: 14px;
            margin-bottom: 5px;
        }
        .contact {
            font-size: 14px;
            margin-bottom: 5px;
        }
        .left-align {
            text-align: left;
            margin-bottom: 10px;
        }
        .tableDiv {
            max-width: 800px;
            margin: 0 auto; /* Center align horizontally */
            text-align: center;
            margin-bottom: 10px;
        }
        table {
            width: 100%; /* Take full width of parent container (.tableDiv) */
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid gray;
            padding: 8px;
            text-align: center;
            font-size: 12px;
        }
        th {
            font-weight: bold;
        }
        .aftertable{
          text-align: left;
          margin-top: 10px;
        }
        .textstyle{
          font-size: 12px;
          margin-bottom: 10px;
          font-weight: bold;
          text-align: left;
        }
        .signatureBlock {
          text-align: right;
      }
      
      .leftContent {
          display: inline-block;
          text-align: left;
          font-size: 12px;
          font-weight: bold;
      }
      
      .middleContent {
          display: inline-block;
          font-size: 12px;
          font-weight: bold;
      }
      
      .rightContent, .nextLine, .bottomLine {
          display: inline-block;
          font-size: 12px;
          font-weight: bold;
      }
      
      .rightContent {
          text-align: right;
      }
      
      .signatureSpace {
          display: block;
          height: 30px; /* Adjust as needed for signature space */
      }
      .aftersignatureBlock{
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .aftersignaturetext{
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .container {
        width: 95%; 
        margin: 20px auto; /* Center the div horizontally with top margin */
        padding: 10px; /* Padding inside the div */
        border: 1px solid #000; /* Black border with 2px width */
        box-sizing: border-box; 
        font-size: 16px;
        font-weight: bold;
      }
    </style>
        </head>
        <body>
        <div class="headerDiv">
        <div class="header">PNB EMPLOYEES CO OPERATIVE CREDIT SOCIETY LTD</div>
        <div class="address">135 B.R.B.B ROAD - Calcutta 700001</div>
        <div class="contact">PRESIDENT - 980023709 &nbsp;&nbsp;&nbsp; OFFICE - 033-48079373 &nbsp;&nbsp;&nbsp; SECRETARY - 9432470019</div>
        <div class="address"> DEMAND LIST FOR THE MONTH : DEC 26</div>
        <div class="address"> DIST NO: 528</div>
        </div>
        <div class="left-align">
        <div>TO</div>
        <div>The Manager</div>
        <div>Punjab National Bank</div>
        <div>Dharmatala Street</div>
        <div>120 LENIN SARANI</div>
        <div>KOLKATA, (Ground Floor 700013)</div>
        </div> 
        <div class="tableDiv">
        <table>
            <tr>
                <th>Recov CLIntl No.</th>
                <th>Total CLIntl No</th>
                <th>Prinpl CL</th>
                <th>Last CLLoan</th>
                <th>O/S CLBal</th>
                <th>CLInt. Claim</th>
            </tr>
            <tr>
                <td>${responseData[0].cl_run}</td>
                <td>${responseData[0].cl_tot}</td>
                <td>${responseData[0].cl_principal}</td>
                <td>${responseData[0].cl_loan_amt}</td>
                <td>${responseData[0].cl_outstanding}</td>
                <td>${responseData[0].cl_interest}</td>
            </tr>
        </table>
    </div>
    <div class="aftertable">
    <div class="textstyle">
     Please deduct as per Demand list. Retain one copy and 
    remit the proceed to our a/c no. 1964009300077211 one copy  of demand list to co-operative office as early as possible. Please ensure that amount of remittance
    should tally with the total of Demand list updated upto 24.01.2024
    </div>
    </div>
    <div>
    <span class="leftContent">Demand list no</span>
    <span class="middleContent"> &nbsp;&nbsp;&nbsp;180 dated 26/02/2024</span>
    </div>
    <div class="signatureBlock">
    <span class="rightContent">Thanking you,</span>
    <br>
    <span class="nextLine">Yours faithfully,</span>
    <br>
    <span class="signatureSpace"></span> 
    <br>
    <span class="bottomLine">Secretary</span>
    </div>
    <div class="aftersignatureBlock"> Remitted on &nbsp;&nbsp;/&nbsp;&nbsp;/&nbsp;&nbsp;  And Credited to A/C no 1964 0093 0007 7211 of  </div>
    <div class="aftersignaturetext">PNB EMPLOYEES CO OPERATIVE CREDIT SOCIETY LTD</div> 
    <div class="container">
    <p>
    BALANCE UPDATED UPTO 24/01/2024.Our email ID - (pnbcoopkol@gmail.com)
    </p>
    <p>Amendment: Mgr self service- Salary_Tds related-Amendment-Put emp.Id-search.
    Add new assignment-deduction-(element name)- PNB CO OPE S-O.K. </p>
    </div>
    </body>
    </html>
    `;
      const uri = {
        html: htmlContent,
        fileName: 'Demand_Report',
        directory: 'Documents',
        base64: true
      }
      const file = await RNHTMLtoPDF.convert(uri);
      console.log(file, 'file')
      console.log('PDF Generated:', uri);
      const moment = require('moment');
      const timestamp = moment().format('YYYYMMDD_HHmmss');
      const filepath = `${RNFetchBlob.fs.dirs.DownloadDir}/Demand_Report_${timestamp}.pdf`;
      RNFetchBlob.fs.writeFile(filepath, file.base64, 'base64')
        .then(() => {
          console.log('PDF file saved after RNFetchBlob :', filepath);
          RNFetchBlob.android
            .actionViewIntent(filepath, 'application/pdf');
          Toast.show({
            type: 'success',
            text1: 'PDF downloaded successfully!',
            visibilityTime: 2000,
          });
        })
        .catch((error) => {
          console.log('Error saving PDF:', error);
          Toast.show({
            type: 'error',
            text1: 'Error saving PDF:',
            visibilityTime: 2000,
          });
        });
    } catch (error) {
      if (error.message === 'Storage permission not granted') {
        console.log('Storage permission not granted');
        Toast.show({
          type: 'error',
          text1: 'Storage permission not granted!',
          visibilityTime: 2000,
        });
      } else {
        console.error('Error generating PDF:', error);
        Toast.show({
          type: 'error',
          text1: 'Error generating PDF!',
          visibilityTime: 2000,
        });
      }
    }
  };


  return (
    <>
      <HeaderComponent />
      <View>
        <ImageBackground
          source={require('../assets/bg5.jpg')}
          style={{ resizeMode: 'cover', height: welcomContHeight }}>
          <View style={{ height: welcomContHeight, width: 'screenWidth', position: 'relative' }}>
            <Text style={styles.containerText}>Demand</Text>
            <View style={styles.mainContainer}>
              <View style={styles.profileContainer}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.mainContHeader}>
                    Get Demand List Here
                  </Text>
                </View>
                {isLoading && <ActivityIndicator color={"teal"} size={"large"} />}
                {responseData.map((document, index) => (
                  <View style={styles.profileView} key={index}>
                  <View style={styles.row}>
                      <Text style={styles.doctitle}>{document.title}</Text>
                      <Text style={styles.content} onPress={() => handleDownload(document.file_path)}> Download PDF</Text>
                  </View>
              </View>
                ))}
              </View>
              {/* </View> */}

            </View>
          </View>
        </ImageBackground>


      </View>
      
      {/* <View style={styles.header}>
        <Text style={styles.textHeader}>
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
          ]}/>
        <Button
          style={[{ borderRadius: 5, marginHorizontal: 10, backgroundColor: '#3f50b5', }, isdisabled && styles.disabledBtn]}
          textColor='white'
          icon={() => <Searchicon name="search-outline" size={20} color={'white'} />}
          mode="elevated" onPress={handleSearch} disabled={isdisabled}>
          Search
        </Button>
      </View>
      <ScrollView vertical>
        {isLoading && <ActivityIndicator color={'#3f50b5'} size={"large"} />}
        <View style={styles.containerRpt}>
          <View>
            {
              responseData.map((record, index) => (
                <View key={index} style={{ marginBottom: 10, padding: 15 }}>
                  <View style={{ height: 30 }}>
                  </View>
                  <View style={{ marginBottom: 16 }}>
                    <Table borderStyle={{ borderWidth: 1, borderColor: '#3f50b5' }}>
                      <Row data={tableHead} style={{
                        height: 40,
                        backgroundColor: '#e9eafc'
                      }} textStyle={{ textAlign: 'center', margin: 6, fontWeight: '700', fontFamily: 'OpenSans-ExtraBold', color: isDarkMode ? 'black' : 'black' }} />
                      <Row data={tableLabels} textStyle={{ textAlign: 'left', margin: 6, fontFamily: 'OpenSans-ExtraBold', fontWeight: '700', color: isDarkMode ? 'black' : 'black' }} />
                      <Rows data={tableData} textStyle={{ textAlign: 'left', margin: 4, fontFamily: 'OpenSans-ExtraBold', color: isDarkMode ? 'black' : 'black' }} />
                    </Table>
                  </View>
                  <View style={{ marginBottom: 16 }}>
                    <Table borderStyle={{ borderWidth: 1, borderColor: '#3f50b5', }}>
                      <Row data={tableHead_tf} style={{
                        height: 40,
                        backgroundColor: '#e9eafc'
                      }} textStyle={{ textAlign: 'center', margin: 6, fontWeight: '700', fontFamily: 'OpenSans-ExtraBold', color: isDarkMode ? 'black' : 'black' }} />
                      <Row data={tableLabels_tf} textStyle={{ textAlign: 'left', margin: 6, fontFamily: 'OpenSans-ExtraBold', fontWeight: '700', color: isDarkMode ? 'black' : 'black' }} />
                      <Rows data={tableData_tf} textStyle={{ textAlign: 'left', margin: 6, fontFamily: 'OpenSans-ExtraBold', color: isDarkMode ? 'black' : 'black' }} />
                    </Table>
                  </View>
                  <View style={{ marginBottom: 16 }}>
                    <Table borderStyle={{ borderWidth: 1, borderColor: '#3f50b5' }}>
                      <Row data={tableHead_cl} style={{
                        height: 40,
                        backgroundColor: '#e9eafc'
                      }} textStyle={{ textAlign: 'center', margin: 6, fontWeight: '700', fontFamily: 'OpenSans-ExtraBold', color: isDarkMode ? 'black' : 'black' }} />
                      <Row data={tableLabels_cl} textStyle={{ textAlign: 'left', margin: 6, fontFamily: 'OpenSans-ExtraBold', fontWeight: '700', color: isDarkMode ? 'black' : 'black' }} />
                      <Rows data={tableData_cl} textStyle={{ textAlign: 'left', margin: 6, fontFamily: 'OpenSans-ExtraBold', color: isDarkMode ? 'black' : 'black' }} />
                    </Table>
                  </View>
                  <View style={{ marginBottom: 16 }}>
                    <Table borderStyle={{
                      borderWidth: 1,
                      borderColor: '#3f50b5'
                    }}>
                      <Row data={tableHead_ltc} style={{
                        height: 40,
                        backgroundColor: '#e9eafc'
                      }} textStyle={{ textAlign: 'center', margin: 6, fontWeight: '700', fontFamily: 'OpenSans-ExtraBold', color: isDarkMode ? 'black' : 'black' }} />
                      <Row data={tableLabels_ltc} textStyle={{ textAlign: 'left', margin: 6, fontFamily: 'OpenSans-ExtraBold', fontWeight: '700', color: isDarkMode ? 'black' : 'black' }} />
                      <Rows data={tableData_ltc} textStyle={{ textAlign: 'left', margin: 6, fontFamily: 'OpenSans-ExtraBold', color: isDarkMode ? 'black' : 'black' }} />
                    </Table>
                  </View>
                  <Button
                    mode="contained"
                    onPress={handleDownloadPDF}
                    disabled={!responseData.length}
                    style={{ backgroundColor: '#3f50b5', paddingHorizontal: 20,color:'#ffffff' }}>
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
            <Image source={require('../assets/nodata4.png')} style={{ resizeMode: 'contain', height: 70, width: '100%', alignSelf: 'center' }} />

            <Text style={{ color: '#3f50b5', fontSize: 17, alignSelf: 'center', fontFamily: 'OpenSans-ExtraBold', marginTop: 10 }}>No data Found..</Text>
          </View>
        </View>} */}

    </>
  );
};
const styles = StyleSheet.create({
  content:{
    // color: 'blue',
    color:'orange',
    textDecorationLine: 'underline',
  },
  doctitle:{
    color:'#3f50b5',
    fontSize: 16,
    fontWeight: '900',
  },
  profileView: {
    margin: 10,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
},
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-around'
},
  mainContainer: {
    height: 700,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: '100%',
    backgroundColor: 'white',
    // backgroundColor:'#fdbd30',
    alignSelf: 'center',
    position: 'absolute',
    top: 120,
    padding: 25,
  },
  containerText: {
    fontSize: 20,
    fontWeight: '900',
    // color: '#fdbd30',
    color: '#ffffff',
    top: 50,
    alignSelf: 'center'
  },
  profileContainer: {
    position: 'relative',
    // top:-80

  },
  mainContHeader: {
    // color: '#209fb2',
    color:'#3f50b5',
    fontSize: 18,
    fontWeight: '900',
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: 'black',
  },
  header: {
    height: 40, backgroundColor: '#3f50b5'
    // backgroundColor: 'rgba(4,187,214,255)'// backgroundColor: '#a20a3a'
  },
  textHeader: { alignSelf: 'center', fontSize: 20, color: '#ffffff', fontWeight: '800', top: 5, fontFamily: 'OpenSans-ExtraBold' },
  disabledBtn: {
    // backgroundColor: 'lightblue',
    backgroundColor: '#9298ed', color: 'white'
  },
  containerRpt: {
    height: 'auto', backgroundColor: 'white', top: 10
  },
  container: {
    //flex: 1,//justifyContent:'center',//alignItems:'center',// height:100,//backgroundColor: 'rgba(24,117,130,0.2)',// backgroundColor: 'rgba(162, 10, 58, 0.1)',
    backgroundColor: '#d2d4f9', zIndex: 10, fontFamily: 'Roboto', padding: 15
  },
  overlayContainer: {
    flexDirection: 'row', alignItems: 'center', padding: 15
  },
  dropdownContainer: {
    flex: 1, height: 40, margin: 5,
  },
  dropdown: {
    backgroundColor: 'white', borderColor: 'rgba(24, 117, 130, 0.4)', fontFamily: 'Roboto'
  },
  dropdownItem: {
    justifyContent: 'flex-start', fontFamily: 'Roboto'
  },
  dropdownList: {
    backgroundColor: 'rgba(24, 117, 130, 0.4)', height: 100, zIndex: 10, fontFamily: 'Roboto'
  },
  searchButtonContainer: {
    // marginLeft: 10,backgroundColor: 'white'
  },
  searchButton: {
    backgroundColor: 'sky', height: 30, width: 30,
  },
});
export default Demand;