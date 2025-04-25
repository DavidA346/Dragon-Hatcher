import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Pressable, Animated, Text, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useStore from '../../store/useStore';

const EggClicker = () => {
  //Used for scaling the egg higher when pressed
  const scaleAnim = useRef(new Animated.Value(1)).current;
  //Controls opacity of the +1, starts at 0 as it is hidden until pressed
  const plusOneOpacity = useRef(new Animated.Value(0)).current;
  //Controls the y position of the +1 and moves upward when pressed, also starts as 0
  const plusOneY = useRef(new Animated.Value(0)).current;
  
  //Uses useStore to loads the saved currency using AsyncStorage
  const { currency, incrementCurrency, loadCurrency } = useStore(); // Access store's state and actions

  //Loads the user's currency before rendering components
  useEffect(() => {
    loadCurrency();  // Load the persisted currency when the component mounts
  }, []);

  //Handles the animation of the clicking of the egg and the +1 appearance
  const handlePress = () => {
    //Controls the egg bounce effect as a sequence, makes tge egg first scale up by 1.2
    //then back down to 1 over 100ms
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    //Increment the currency and persist it
    incrementCurrency();

    //Triggers +1 animation
    plusOneOpacity.setValue(1); //Sets the +1 to 1 to make it visible
    plusOneY.setValue(0); //Resets the y value for each subsequent press

    //Parallel is needed to allow for these two animations to run at the same time
    Animated.parallel([
      //Fades the +1 out over 500ms
      Animated.timing(plusOneOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      //Moves the +1 up the screen over 500ms
      Animated.timing(plusOneY, {
        toValue: -120,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();  // Reset visibility after animation
  };

  //Renders everything to the screen
  return (
    //Handles the safeview of the top and bottom of the screen
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source = {require('../../assets/backgrounds/home_background.jpg')}
        style={styles.backgroundImage}
        >
          <Text style={styles.homepageText}>Dragon Hatcher</Text>
        <View style={styles.container}>
        {/* Pressable calls handlePress when the image is pressed */}
        <Pressable onPress={handlePress}>
            {/* Animated Image allows for scaling animations */}
            <Animated.Image
            source={require('../../assets/Dragons/Red/egg_sprites/sprite_0.png')}
            style={[styles.egg, { transform: [{ scale: scaleAnim }] }]}
            />
        </Pressable>

        {/* First compare if currency is > 0 in order to display stored score from Zustand */}
        {currency > 0 && (
        <Text style={styles.currency}>Currency: {currency}</Text>
        )}

        {/* Handles +1 animation */}
        {plusOneOpacity && (
            <Animated.Text
            style={[
                styles.plusOne,
                {
                opacity: plusOneOpacity,
                transform: [{ translateY: plusOneY }],
                },
            ]}
            >
            +1
            </Animated.Text>
        )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default EggClicker;

//Styling for the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  egg: {
    width: 200,
    height: 200,
  },
  plusOne: {
    position: 'absolute',
    top: '30%',
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
  },
  currency: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'black',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafc',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  homepageText:{
    position: 'absolute',
    top: 40,
    //alighnSelf: 'center',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '700',
    color: 'Black',
    zIndex: 10,
  }
});
