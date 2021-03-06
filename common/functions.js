import { DataStore } from "aws-amplify"
import * as Device from "expo-device"
import { Code, Job, Provider, User } from "../src/models"
import * as Notifications from "expo-notifications"
import { Platform } from "react-native"
import { cancelNotificationByID, sendNotificationToProvider, sendNotificationToUser } from "../notifications"

export const getUnacceptedJobs = (activeJobs) => {
    //get requested jobs
    let jobsToReturn = []
    if(activeJobs.length == 0){
        return jobsToReturn
    }
    //check date
    let today = new Date()
    let requestDate
    for(let job of activeJobs){
        requestDate = new Date(job.requestDateTime)
        if(today.toLocaleDateString() >= requestDate.toLocaleDateString()){
            //check if two hours or less
            if((today.getHours() - requestDate.getHours()) <= 2){
                jobsToReturn.push(job)
            }
        }
    }
    return jobsToReturn
}



//fire employee
export const removeJobsFromProvider = async(employee) => {
    if(!employee){
        return false
    }
    let jobs = await DataStore.query(Job, job => job.or(
        job => job.mainProvider("eq", employee.id).backupProviders('contains', employee.id)
      ))
      for(let next of jobs){
            if(next){
            //if provider was the main get the next backup and set as main if available
            if(next.mainProvider == employee.id){
                if(next.backupProviders.length != 0){
                let newMain = next.backupProviders[0]
                //cancel notifications
                if(next.providerNotificationID){
                    await cancelNotificationByID(next.providerNotificationID[0])
                    await cancelNotificationByID(next.providerNotificationID[1])
                }
                try {
                    await DataStore.save(Job.copyOf(next, updated => {
                        updated.mainProvider = newMain
                        updated.backupProviders = updated.backupProviders.filter(id => id != newMain)
                        updated.providerNotificationID = []
                    }))
                    success = true
                    //send notification to new main provider
                    let request = new Date(next.requestDateTime);
                    let hour = request.getHours() % 12 || 12;
                    let min = (request.getMinutes() < 10 ? "0" : "") + request.getMinutes();
                    let amOrPm = "AM";
                    if (request.getHours() >= 12) {
                    amOrPm = "PM";
                    }
                    let messageInfo = {
                    title: 'New Provider',
                    message: `You have been appointed to be the new main provider of the ${next.jobTitle} job on ${request.toLocaleDateString()} at ${hour}:${min}${amOrPm}`,
                    data: {jobID: next.id}
                    }
                    await sendNotificationToProvider(newMain, messageInfo)
                    //send notification to user about new provider
                    let messageInfo2 = {
                    title: 'Provider Switch',
                    message: `${userInfo.firstName} is now the main provider for your job request`
                    }
                    await sendNotificationToUser(next.requestOwner, messageInfo2)
                } catch (error) {
                    console.log(error);
                }
                }
                //if no backups remove main provider only
                else{
                console.log('No backups available');
                //cancel notifications
                if(next.providerNotificationID){
                    await cancelNotificationByID(next.providerNotificationID[0])
                    await cancelNotificationByID(next.providerNotificationID[1])
                }
                try {
                    await DataStore.save(Job.copyOf(next, updated => {
                        updated.currentStatus = 'REQUESTED'
                        updated.mainProvider = null
                        updated.providerNotificationID = []
                    }))
                    success = true
                    //send notification to user about provider cancellation
                    let messageInfo = {
                    title: 'Job Cancelled',
                    message: 'The main provider has cancelled your job request'
                    }
                    await sendNotificationToUser(next.requestOwner, messageInfo)
                } catch (error) {
                    console.log(error);
                }
                }
            }
            //If provider was a backup
            else if(next.backupProviders.includes(employee.id)){
                try {
                await DataStore.save(Job.copyOf(next, updated => {
                    updated.backupProviders = updated.backupProviders.filter(id => id != employee.id)
                }))
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
    return true
}

//decrement zip code count
export const decrementZipCodeCount = async(code) => {
    if(code.id){
        let original = await DataStore.query(Code, code.id)
        let count = original.count
        count--;
        await DataStore.save(Code.copyOf(original, updated => {
            updated.count = count
        }))
    }
    else if (code.zipCode) {
        let original = await DataStore.query(Code, c => c.zipCode("eq", code.zipCode))
        let count = original[0].count
        count--;
        await DataStore.save(Code.copyOf(original[0], updated => {
            updated.count = count
        }))
    }
}

//delete job if user changes tab or payment ID is not found
export const checkUnverifiedJob = async (job, code) => {
    if(job.paymentID == null){
        //remove reminders
        for(let next of job.userNotificationID){
            await cancelNotificationByID(next)
        }
        await DataStore.delete(Job, job.id)
        //decrement zipcode job
        await decrementZipCodeCount(code)
    }
    else{
        console.log(job.paymentID);
        if(job.paymentID == '' || job.paymentID == undefined || job.paymentID == null){
            //remove reminders
            for(let next of job.userNotificationID){
                await cancelNotificationByID(next)
            }
            await DataStore.delete(Job, job.id)
            //decrement zipcode job
            await decrementZipCodeCount(code)
            //remove reminders
        }
    }
}