import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { View, Text, StyleSheet } from "react-native";

//Needed for the styling of the Toast Popups
const toastConfig = {
  success: ({ text1, text2 }) => (
    <View style={styles.customToast}>
      <Text style={styles.toastTitle}>{text1}</Text>
      {text2 ? <Text style={styles.toastMessage}>{text2}</Text> : null}
    </View>
  ),

  // Styling for error popup
  error: ({ text1, text2 }) => (
    <View style={styles.customToast2}>
      <Text style={styles.toastTitle2}>{text1}</Text>
      {text2 ? <Text style={styles.toastMessage2}>{text2}</Text> : null}
    </View>
  ),
};

const RootLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <Toast config={toastConfig} />
    </>
  );
};

export default RootLayout;

// Styling for TOast Popup
const styles = StyleSheet.create({

  customToast: {
    height: '50%',
    width: '90%',
    backgroundColor: '#4caf50',
    borderRadius: 10,
    padding: '5%',
    marginTop: '20%',
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    justifyContent: 'center'
  },

  toastTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    alignSelf: 'center',
    textAlign: 'center'
  },

  toastMessage: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: '1%',
    alignSelf: 'center'
  },

  customToast2: {
    height: '50%',
    width: '90%',
    backgroundColor: 'red',
    borderRadius: 10,
    marginTop: '32%',
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    justifyContent: 'center'
  },

  toastTitle2: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    alignSelf: 'center',
    textAlign: 'center'
  },

  toastMessage2: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: '1%',
    alignSelf: 'center'
  },
});