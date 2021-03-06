import { Auth, DataStore, Storage } from "aws-amplify";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  SafeAreaView,
  Dimensions,
  View,
  TouchableOpacity,
  Modal
} from "react-native";
import ProfilePicture from "../../../common/components/ProfilePicture";
import Spinner from "../../../common/components/Spinner";
import { commonStyles } from "../../../common/styles";
import { MaterialIcons } from '@expo/vector-icons'; 
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Job, Provider } from "../../../src/models";
import { removeJobsFromProvider } from "../../../common/functions";
import { createToast } from "../../../common/components/Toast";




const EmployeeInfo = ({ navigation, route }) => {
  const {employeeInfo} = route.params
  const [dateStarted, setDateStarted] = useState()
  const [providerImage, setProviderImage] = useState('')
  const [birthDate, setBirthDate] = useState()
  const [address, setAddress] = useState()
  const [loading, setLoading] = useState(true)
  const [roundedOverall, setRoundedOverall] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [chosenModal, setChosenModal] = useState('')
  const [operation, setOperation] = useState(false)

  const getProviderImage = async() => {
    if(employeeInfo.profilePictureURL){
      let img = await Storage.get(employeeInfo.profilePictureURL)
      if(img){
        setProviderImage(img)
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    //date started
    let date = new Date(employeeInfo.createdAt)
    setDateStarted(date.toLocaleDateString())
    //birth date
    date = new Date(employeeInfo.dateOfBirth)
    setBirthDate(date.toLocaleDateString())
    //address
    let address = JSON.parse(employeeInfo.address)
    setAddress(address)
    //set rating
    let overall = employeeInfo.overallRating
    setRoundedOverall(Math.round(overall * 2) / 2)
    //profile picture
    getProviderImage()
  },[])

  if(loading){
    return (
      <Spinner color={'green'} />
    )
  }


  //ban 
  const banProvider = async() => {
    setOperation(true)
    console.log('ban');
    let original = await DataStore.query(Provider, employeeInfo.id)
    try {
      await DataStore.save(Provider.copyOf(original, (updated) => {
        updated.isBan = true
      }))
      createToast('Provider has been banned')
      setOperation(false)
      navigation.navigate('EmployeeMain')
    } catch (error) {
      console.log(error);
    }
  }

  //ban 
  const fireProvider = async() => {
    setOperation(true)
    console.log('fire');
    let jobsRemoved = await removeJobsFromProvider()
    if(jobsRemoved){
      createToast('Provider jobs were removed successfully')
    }
    setOperation(false)
    navigation.navigate('EmployeeMain')
    
  }

  return (
    <KeyboardAwareScrollView>
    <ImageBackground
      style={[commonStyles.background, {flex: 1}]}
      source={require("../../../assets/wyo_background.png")}
    >
      <SafeAreaView style={commonStyles.safeContainer}>
        {/* MODAL */}
        <Modal
            visible={showModal}
            transparent
            animationType="slide"
            hardwareAccelerated
          >
          <View style={styles.centeredView}>
            <View style={styles.warningModal}>
              {chosenModal == 'ban' ? (
                <View>
                  <Text style={styles.modalTitle}>WARNING</Text>
                  <Text style={[styles.generalText, {textAlign: 'center', marginTop: 20}]}>
                  Are your sure you want to suspend {employeeInfo.firstName} {employeeInfo.lastName} from being a provider. This will not allow them to search for jobs anymore until the suspension is lifted.
                  </Text>
                  <Text style={[styles.dateText, {textAlign: 'center', marginBottom: 20}]}>Note: They will still have access to their current active jobs</Text>
                  {operation ? <Spinner color={'red'}/> : (
                    <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                      <TouchableOpacity onPress={() => {setChosenModal(''); setShowModal(false)}}>
                        <View style={styles.button}>
                          <Text style={styles.btnText}>No</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => banProvider()}>
                        <View style={styles.button}>
                          <Text style={styles.btnText}>Yes</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ): (
                <View>
                  <Text style={styles.modalTitle}>WARNING</Text>
                  <Text style={[styles.generalText, {textAlign: 'center', marginTop: 20}]}>
                  Are your sure you want to fire {employeeInfo.firstName} {employeeInfo.lastName} from being a provider. This will immediately stop all provider activities and cancel all their active jobs. They will also not be able to sign in anymore. 
                  </Text>
                  <Text style={[styles.dateText, {textAlign: 'center', marginBottom: 20}]}>Note: Firing a provider is permanent and they will not be able to sign up again with the same email or phone number</Text>
                  {operation ? <Spinner color={'red'}/> : (
                    <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                      <TouchableOpacity onPress={() => {setChosenModal(''); setShowModal(false)}}>
                        <View style={styles.button}>
                          <Text style={styles.btnText}>No</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => fireProvider()}>
                        <View style={styles.button}>
                          <Text style={styles.btnText}>Yes</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        </Modal>


          <Text style={styles.title}>Employee Detailed Information</Text>
          <View style={styles.container}>
            <Text style={[styles.dateText, {marginBottom: 5}]}>ID: {employeeInfo.id}</Text>
            <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
              <Text style={styles.name}>{employeeInfo.firstName} {employeeInfo.lastName}</Text>
              <View>
                <Text style={[styles.dateText, {alignSelf: 'flex-end'}]}>Date Started</Text>
                <Text style={[styles.dateText, {alignSelf: 'flex-end'}]}>{dateStarted}</Text>
              </View>
            </View>
            <View style={{marginTop: 10, flexDirection: 'row',}}>
              <ProfilePicture imageUrl={providerImage} name={employeeInfo.firstName + ' ' + employeeInfo.lastName} size={130}/>
              <View>
                <View style={{flexDirection:'row', justifyContent: 'center', marginTop: 10}}>
                  <MaterialIcons name={1 > roundedOverall ? 'star-outline' : 1.5 == roundedOverall ? 'star-half' : 'star'} size={25} color={'yellow'}/>
                  <MaterialIcons name={2 > roundedOverall ? 'star-outline' : 2.5 == roundedOverall ? 'star-half' : 'star'} size={25} color={'yellow'}/>
                  <MaterialIcons name={3 > roundedOverall ? 'star-outline' : 3.5 == roundedOverall ? 'star-half' : 'star'} size={25} color={'yellow'}/>
                  <MaterialIcons name={4 > roundedOverall ? 'star-outline' : 4.5 == roundedOverall ? 'star-half' : 'star'} size={25} color={'yellow'}/>
                  <MaterialIcons name={5 > roundedOverall ? 'star-outline' : 'star'} size={25} color={'yellow'}/>
                  <Text style={[styles.generalText, {alignContent:'center'}]}>{employeeInfo.overallRating}/5</Text>
                </View>
                <Text style={[styles.subtitle, {marginTop: 10, marginLeft: 10}]}>Offenses: {employeeInfo.offenses}</Text>
                <TouchableOpacity onPress={() => {navigation.navigate('EmployeeJobs', {name: "EmployeeJobs", employeeInfo})}} style={{marginTop: 10}}>
                  <View style={styles.button}>
                    <Text style={styles.btnText}>Jobs/History</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
              <View style={{marginLeft: 10, marginTop: 10}}>
                <Text style={styles.generalText}>Email: {employeeInfo.email}</Text>
                <Text style={styles.generalText}>Phone: {employeeInfo.phoneNumber}</Text>
                <Text style={styles.generalText}>Birth Date: {birthDate}</Text>
                <Text style={styles.generalText}>Address: {address.street} {address.city} {address.zipCode}</Text>
              </View>
              <Text style={[styles.subtitle, {marginTop: 5}]}>Biography</Text>
              <Text style={styles.generalText}>{employeeInfo.biography}</Text>

              {/* Buttons */}
              <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 30}}>
                <TouchableOpacity onPress={() => {setChosenModal('ban'); setShowModal(true)}}>
                    <View style={styles.button}>
                      <Text style={styles.btnText}>Suspend</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {setChosenModal('fire'); setShowModal(true)}}>
                    <View style={styles.fireButton}>
                      <Text style={styles.btnText}>Fire</Text>
                    </View>
                </TouchableOpacity>
              </View>
          </View>
          
      </SafeAreaView>
    </ImageBackground>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  title:{
    fontSize: 30,
    marginBottom: 20,
    alignSelf: 'center',
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center'
  },
  container: {
    borderColor: "rgba(0,221,255,0.9)",
    borderWidth: 1,
    backgroundColor: "rgba(0,221,255,0.9)",
    borderRadius: 10,
    padding: 10,
    width: Dimensions.get("window").width,
    marginVertical: 10,
    elevation: 10,
  },
  subtitle:{
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    borderBottomWidth: 2,
    alignSelf: 'flex-start'
  },
  name: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 25,
    borderBottomWidth: 2,
    alignSelf: 'flex-start'
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 125,
    height: 40,
    backgroundColor: "black",
    borderRadius: 10,
  },
  fireButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 125,
    height: 40,
    backgroundColor: "red",
    borderRadius: 10,
  },
  btnText: {
    color: "white",
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
  },
  generalText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    fontWeight: '800',
  },
  dateText: {
    fontFamily: "Montserrat-Italic",
    fontSize: 14,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000090'
  },
  warningModal: {
    width: 360,
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
    textAlign: 'center'
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
  },
});

export default EmployeeInfo;
