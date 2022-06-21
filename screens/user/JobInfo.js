import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  Modal,
} from "react-native";
import { TouchableOpacity } from "react-native";
import Spinner from "../../common/components/Spinner";
import { commonStyles } from "../../common/styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useEffect, useState } from "react";
import { DataStore } from "aws-amplify";
import { Provider, Job } from "../../src/models";
import { createToast } from "../../common/components/Toast";

//Login screen
const JobInfo = ({ route, navigation }) => {
  const { jobInfo } = route.params;
  const [mainProvider, setMainProvider] = useState('')
  const [backupProviders, setBackupProviders] = useState([])
  const [showCancel, setShowCancel] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [startCancel, setStartCancel] = useState(false)

  const getDateFormat = () => {
    let date = new Date(jobInfo.requestDateTime)
    let hours = date.getHours() % 12 || 12;
    let min = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    let amOrPm = "AM";
    if (date.getHours() >= 12) {
      amOrPm = "PM";
    }
    return `${date.toDateString()} ${hours}:${min}${amOrPm}`
  }

  const getBackupProviders = () => {
    let text = ''
    for(let next of backupProviders){
      text += next + '\n'
    }
    return text
  }

  const getProviders = async () => {
    //set main provider if available
    if(jobInfo.mainProvider){
      await DataStore.query(Provider, (provider) => {
        provider.id("eq", jobInfo.mainProvider)
      }).then((providerFound) => {
        setMainProvider(providerFound);
      });
    }
    //set backup providers if available
    if(jobInfo.backupProviders && jobInfo.backupProviders.length != 0){
      let listOfBackups = []
      for(let next of jobInfo.backupProviders){
        await DataStore.query(Provider, (provider) => {
          provider.id("eq", next)
        }).then((providerFound) => {
          listOfBackups.push(providerFound)
        });
      }
      setBackupProviders(listOfBackups)
    }
  }

  const cancelJob = async () => {
    setStartCancel(true)
    //REFUND
    // await DataStore.delete(Job, job => job.id('eq', jobInfo.id)).then(
    //   () => {
    //     createToast('Your job request has been cancelled')
    //     setTimeout(() => {
    //       setStartCancel(false)
    //       navigation.reset({ routes: [{name: 'UserHome'}]})
    //       navigation.navigate('UserHome', {name: 'UserHome'})
    //     }, 5000)
    //   }
    // ).catch((error) => {
    //   console.log(error);
    // })
  }
  
  useEffect(() => {
    // getProviders()
    let date = new Date(jobInfo.requestDateTime)
    let today = new Date()
    if(date.getDate() > today.getDate()){
      setShowCancel(true)
    }
    setLoading(false)
  },[])

  if(loading){
    return (
      <Spinner color={'#0EFC11'}/>
    )
  }

  return (
    <KeyboardAwareScrollView>
      <ImageBackground
        style={commonStyles.background}
        source={require("../../assets/wyo_background.png")}>
        <SafeAreaView style={commonStyles.safeContainer}>
          {/* MODAL */}
          <Modal
            visible={showModal}
            transparent
            animationType='slide'
            hardwareAccelerated
          >
            <View style={styles.centeredView}>
              <View style={styles.warningModal}>
                <Text style={styles.modalTitle}>Warning</Text>
                <Text style={styles.modalText}>After cancellation of this job you will be 
                refunded through your original payment method. Are you sure you want to cancel this job?
                </Text>
                {startCancel ?  <Spinner color={'black'}/> : (
                  //Buttons
                  <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 40}}>
                  <TouchableOpacity
                    onPress={() => setShowModal(false)}
                    style={styles.button}
                  >
                  <Text style={styles.btnText}>No</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => cancelJob()}
                    style={styles.button}
                  >
                  <Text style={styles.btnText}>Yes</Text>
                  </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </Modal>


          <Text style={styles.head}>Job Details</Text>
          <View style={styles.jobContainer}>
            {showCancel == false ? <></> : (
              <View style={{alignItems: 'flex-end', marginBottom: -10}}>
                <TouchableOpacity
                  onPress={() => setShowModal(true)}
                  style={styles.button}
                >
                <Text style={styles.btnText}>Cancel Job</Text>
                </TouchableOpacity>
              </View>
            )}
            <Text style={styles.title}>{jobInfo.jobTitle}</Text>
            <Text style={styles.generalText}>{jobInfo.address}</Text>
            <Text style={styles.generalText}>{jobInfo.city} {jobInfo.zipCode}</Text>
            <Text style={[styles.generalText, {marginBottom: 40}]}>Scheduled for {getDateFormat()}</Text>
            {jobInfo.jobDescription ? <Text style={[styles.generalText, {marginBottom: 30}]}>Job Description: {jobInfo.jobDescription}</Text> : <></>}
            <Text style={[styles.generalText, {marginBottom: 10}]}>Main Provider: {mainProvider ? mainProvider : 'None'}</Text>
            {backupProviders.length == 0 ? <></> : (
              <View>
                <Text style={[styles.generalText, {borderBottomWidth: 1, alignSelf: 'flex-start'}]}>Backup Providers</Text>
                <Text style={styles.generalText}>{getBackupProviders()}</Text>
              </View>
            )}
          </View>

        </SafeAreaView>
      </ImageBackground>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  head: {
    fontFamily: "Montserrat-Bold",
    fontSize: 30,
    padding: 5,
    textAlign: "center",
    marginBottom: 10
  },
  headerText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 25,
    padding: 5,
    textAlign: "center",
  },
  jobContainer: {
    borderColor: "rgba(0,221,255,0.9)",
    borderWidth: 1,
    backgroundColor: "rgba(0,221,255,0.9)",
    borderRadius: 10,
    padding: 10,
    width: Dimensions.get("window").width,
    marginVertical: 10,
    elevation: 10,
  },
  title: {
    fontFamily: "Montserrat-Bold",
    fontSize: 25,
    padding: 5,
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    marginBottom: 10
  },
  generalText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    fontWeight: '800'
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 125,
    height: 40,
    backgroundColor: "black",
    borderRadius: 10,
  },
  btnText: {
    color: "white",
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000090'
  },
  warningModal: {
    width: 350,
    height: 300,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
  },
  modalTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 25,
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    marginBottom: 10,
    alignSelf: 'center',
  },
  modalText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 17,
    padding: 5,
    borderBottomColor: 'black',
    borderBottomWidth: 3,
    marginBottom: 5,
    alignSelf: 'center',
    textAlign: 'center'
  }
});

export default JobInfo;
