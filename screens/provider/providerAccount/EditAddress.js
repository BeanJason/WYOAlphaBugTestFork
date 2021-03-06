import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    SafeAreaView,
    TouchableOpacity
  } from "react-native";
  import UserInput from "../../../common/components/UserInput";
  import { commonStyles } from "../../../common/styles";
  import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
  import { useForm } from "react-hook-form";
  import { useSelector, useDispatch } from "react-redux";
  import { DataStore } from "aws-amplify";
  import { Provider } from "../../../src/models";
  import { changeUserInfo } from "../../../redux/authReducer";
  import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete"
  import { useState, useEffect } from "react";

  
  //Login screen
  const EditAddress = ({ navigation }) => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [address, setAddress] = useState()
    const [city, setCity] = useState()
    const [zipCode, setZipCode] = useState()
    const [state, setState] = useState()
    const [lat, setLat] = useState()
    const [lng, setLng] = useState()


    const [changed, setChanged] = useState(false)
    const [addressError, setAddressError] = useState()
  
    //Submit the user input
    const submit = async () => {
      if(changed){
        if(state != 'Michigan'){
          setAddressError('Your address must be in the state of Michigan')
        }
        else{
          //Success
          let original = await DataStore.query(Provider, userInfo.userID);
  
          let addressArray = {
            street: address,
            city: city,
            zipCode: zipCode,
            lat: lat,
            lng: lng
          };
  
          try {
              await DataStore.save(Provider.copyOf(original, updated => {
                  updated.address = JSON.stringify(addressArray)
              }))
              let newInfo = {
                userID: original.id,
                firstName: original.firstName,
                lastName: original.lastName,
                address: JSON.stringify(addressArray),
                phoneNumber: original.phoneNumber,
                biography: original.biography,
                backgroundCheck: original.backgroundCheckStatus,
                profilePicture: original.profilePictureURL,
                isBan: original.isBan,
                employeeID: original.employeeID
            }
            dispatch(changeUserInfo({userInfo: newInfo}))
            navigation.reset({ routes: [{name: 'EditAccountProvider'}]})
            navigation.navigate('EditAccountProvider', {name: 'EditAccountProvider'})
            } catch (error) {
                console.log(error);
            }
        }
      }
      else{
        setAddressError('No new address was selected')
      } 
    };
  
    return (
        <ImageBackground
          style={commonStyles.background}
          source={require("../../../assets/wyo_background.png")}
        >
          <SafeAreaView style={commonStyles.safeContainer}>
            <Text style={styles.header2}>
              Select your new address
            </Text>
  
            {/* address */}
            <View style={[styles.field, {alignItems: 'center', alignSelf: 'center'}]}>
            <GooglePlacesAutocomplete
                      placeholder="Address"
                      fetchDetails={true}
                      onPress={(data, details = null) => {
                        setAddress(`${details.address_components[0].long_name} ${details.address_components[1].long_name}`)
                        setCity(details.address_components[2].long_name)
                        setZipCode(details.address_components[6].long_name)
                        setState(details.address_components[4].long_name)
                        setLat(details.geometry.location.lat)
                        setLng(details.geometry.location.lng)
                        setChanged(true)
                      }}
                      query={{
                        key: "AIzaSyAFD8BEuFIvJtQOj31rKE-i0YubHze6LS4",
                        language: "en",
                        components: "country:us",
                        type: "geocode"
                      }}
                      minLength={3}
                      styles={{
                        container: {width: 320, flex: 0, marginTop: 10},
                        textInput: {fontSize: 16, height: 50, borderRadius: 10, borderWidth: 1 },
                        listView: { backgroundColor: "white" },
                      }}
                    />
            </View>
            {addressError ? <Text style={[commonStyles.errorMsg, {alignSelf:'center'}]}>{addressError}</Text>: <></>}
  
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => submit()}
                style={styles.button}
              >
                <Text style={styles.btnText}>Change</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </ImageBackground>
    );
  };
  
  const styles = StyleSheet.create({
    header2: {
      fontFamily: "Montserrat-Regular",
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 15,
      marginTop: 20,
      textAlign: "center",
    },
    inputContainer: {
      alignItems: "center",
      borderColor: "rgba(0,221,255,0.7)",
      borderWidth: 1,
      backgroundColor: "rgba(0,221,255,0.7)",
      borderRadius: 10,
      padding: 20,
    },
    input: {
      width: 300,
      height: 32,
      fontSize: 16,
    },
    field: {
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: "Black",
      paddingBottom: 5,
      justifyContent: "space-evenly",
    },
    buttonContainer: {
      flex: 1,
      flexDirection: "row",
      alignContent: "center",
      justifyContent: "center",
    },
    button: {
      justifyContent: "center",
      alignItems: "center",
      width: 150,
      height: 50,
      backgroundColor: "black",
      borderRadius: 10,
      marginVertical: 10,
      marginLeft: 25,
      marginRight: 25,
    },
    btnText: {
      color: "white",
      fontFamily: "Montserrat-Bold",
      fontSize: 25,
    },
    durationStyle: {
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: "Black",
      paddingBottom: 5,
      justifyContent: "space-evenly",
  
    }
  });
  
  export default EditAddress;
  