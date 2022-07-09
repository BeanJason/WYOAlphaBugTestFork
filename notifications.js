import * as Notifications from "expo-notifications";

//handler settings
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    };
  },
});

// //when the user clicks on the notification
// Notifications.addNotificationResponseReceivedListener((response) => {
//   console.log("foreground");
//   console.log(response);
// });

// //when the app is open
// Notifications.addNotificationReceivedListener((notification) => {
//   console.log("background");
//   console.log(notification);
// });

//get all notifications
export const getAllNotifications = async () => {
  let notificationsList =
    await Notifications.getAllScheduledNotificationsAsync();
  console.log(notificationsList);
};

//cancel all notifications
export const cancelNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

//check if token is unchanged
export const updateExpoToken = async (type, id, token) => {
  if (token == "" || token == null) {
    return "";
  }
  if (type == "Provider") {
    let original = await DataStore.query(Provider, id);
    if (original.expoToken == token) {
      return token;
    }
    await DataStore.save(
      Provider.copyOf(original, (updated) => {
        updated.expoToken = token;
      })
    );
    return token;
  } else if (type == "User") {
    let original = await DataStore.query(User, id);
    if (original.expoToken == token) {
      return token;
    }
    await DataStore.save(
      User.copyOf(original, (updated) => {
        updated.expoToken = token;
      })
    );
    return token;
  }
};

//get the token for notifications
export const getNotificationToken = async () => {
  if (!Device.isDevice) {
    console.log("Physical device is not used so notifications will not work");
    return null;
  }
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  console.log(existingStatus);
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    console.log("permissions not given");
    return null;
  }
  try {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }
    return token;
  } catch (error) {
    console.log(error);
  }
};

export const createUserReminder = async (date) => {
  let request = new Date(date);
  let hour = request.getHours() % 12 || 12;
  let min = (request.getMinutes() < 10 ? "0" : "") + request.getMinutes();
  let amOrPm = "AM";
  if (request.getHours() >= 12) {
    amOrPm = "PM";
  }

  //a day before
  let dayBeforeReminder = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Job Reminder",
      body: `Reminder: Your job request is scheduled for ${request.toLocaleDateString()} at ${hour}:${min}${amOrPm}`,
    },
    trigger: {
      date: request.setHours(request.getHours() - 24),
    },
  });

  //3 hours before
  let threeHourReminder = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Job Reminder",
      body: `Reminder: Your job request is scheduled for today at ${hour}:${min}${amOrPm}`,
    },
    trigger: {
      date: request.setHours(request.getHours() - 3),
    },
  });

  let ids = [];
  ids.push(dayBeforeReminder);
  ids.push(threeHourReminder);
  return ids;
};
