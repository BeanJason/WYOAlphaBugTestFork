import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
} from "react-native";
import { commonStyles } from "../../common/styles";
import { useSelector, useDispatch } from "react-redux";
import { DataStore } from "aws-amplify";
import { Job } from "../../src/models";
import JobCard from "../../common/components/JobCard";
import Spinner from "../../common/components/Spinner";

const UserHome = ({ navigation }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [jobList, setJobList] = useState([]);
  const [loading, setLoading] = useState(true)
  
  const fetchJobs = async () => {
    await DataStore.query(Job, (job) => {
      job.requestOwner("eq", userInfo.userID) &&
        job.currentStatus("ne", "COMPLETED");
    }).then((jobsFound) => {
      setJobList(jobsFound);
    });
  };

  //Get all current jobs
  useEffect(() => {
    //Get user's current jobs
    fetchJobs();
    setLoading(false)
  }, []);

  if(loading){
    return <Spinner color={'blue'}/>
  }

  return (
    <ImageBackground
      style={[commonStyles.background, { height: 1100 }]}
      source={require("../../assets/wyo_background.png")}
    >
      <SafeAreaView style={commonStyles.safeContainer}>
        <View style={styles.head}>
          <Text style={styles.name}>Welcome {userInfo.firstName}</Text>
        </View>
        <View>
          <Text style={[styles.headerText, {textAlign: 'center'}]}>Active Jobs</Text>
        </View>
        {loading ? <Spinner color={'blue'}/> : (
        <View style={styles.body}>
        {jobList.length == 0 ? <Text style={{fontFamily: 'Montserrat-Italic', margin: 20}}>You have no current jobs</Text> : (
          <View>
            <Text style={styles.helpText}>Click on any of the following jobs for more details</Text>
            <FlatList
              data={jobList}
              renderItem={({ item }) => <JobCard jobInfo={item} />}
            />
          </View>
        )}
        </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  head: {
    backgroundColor: "rgba(113, 124, 206, 0.95)",
    alignContent: "flex-start",
    justifyContent: 'center',
    height: '6%'
  },
  body: {
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "column",
  },
  name: {
    fontFamily: "Montserrat-Bold",
    fontSize: 25,
    padding: 5,
  },
  headerText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 30,
    padding: 5,
    marginBottom: 10,
    borderBottomWidth: 2,
    alignSelf: 'center'
  },
  helpText: {
    fontFamily: 'Montserrat-Italic',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 15,
  }
});

export default UserHome;
