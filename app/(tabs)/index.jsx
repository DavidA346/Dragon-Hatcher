import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, Animated, Text, ImageBackground, Image, Button } from 'react-native';
import useStore from '../../store/useStore';
import itemData from '../../utils/itemData';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

const EggClicker = () => {
 const [clickBonus, setClickBonus] = useState(1);

 //Used for scaling the egg higher when pressed
 const scaleAnim = useRef(new Animated.Value(1)).current;
 //Controls opacity of the +1, starts at 0 as it is hidden until pressed
 const plusOneOpacity = useRef(new Animated.Value(0)).current;
 //Controls the y position of the +1 and moves upward when pressed, also starts as 0
 const plusOneY = useRef(new Animated.Value(0)).current;

 //Uses useStore to loads the saved data using AsyncStorage
 const { currency, egg, incrementEggProgress, initializeStore, resetProgress, purchaseItem } = useStore();

 //Loads the user's data before rendering components
 useEffect(() => {
   // Initialize the store by loading currency, hatched eggs, and the current egg from AsyncStorage
   initializeStore();
 }, []);

 const ownedHammerIds = useStore.getState().items.hammers || [];

 const totemId = egg.type?.toLowerCase(); // 'dragon', 'drake', etc.
 const totemImage = itemData.totems[totemId]?.image;
 const ownsTotem = useStore.getState().items.totems?.includes(totemId);

 const {getEquippedScrolls, getEquippedScroll, getEggBoost} = useStore.getState();
 const equippedScrolls = getEquippedScrolls();
 const eggId = equippedScrolls.egg;
 const scrollImage = eggId ? itemData.scrolls['egg'].find(item => item.id === eggId)?.image : null;
 const boost = getEggBoost();

 //Handles the animation of the clicking of the egg and the +1 appearance
 const handlePress = () => {
  // If no egg or clicksNeeded is 0 or undefined, don't allow clicking
  if (!egg || !egg.clicksNeeded || egg.clicksNeeded === 0) {
    return;
  }

  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

  const hammerClickBonus = useStore.getState().getHammerBonusClicks?.() || 0;
  const totemEffects = useStore.getState().getTotemEffects?.(egg) || {};
  const totemClickBonus = totemEffects.clickBonus || 0;
  const total = 1 + hammerClickBonus + totemClickBonus;
  setClickBonus(total); // update visible +X number

  // Check if the egg is about to hatch
  const currentProgress = egg.progress;
  const clicksNeeded = egg.clicksNeeded;

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

  // If progress + total clicks will hatch the egg, show toast
  if (currentProgress + total >= clicksNeeded) {
    Toast.show({
      type: 'success',
      text1: 'Egg Hatched!',
      text2: `Your ${egg.type} has hatched!`,
      position: 'top',
      visibilityTime: 3000,
    });
  }

   //Update the egg's progress
   incrementEggProgress();

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
   //Imports the background image
   <ImageBackground
     source={require('../../assets/backgrounds/home_background.jpg')}
     style={styles.backgroundImage}
   >
     <View style={styles.container}>
       <View style={styles.title_container}>
         {/* Displays the Dragon Hatcher image to the screen */}
         <Image
           source={require('../../assets/titles/Dragon_Hatcher_text.png')}
           style={styles.title}
         />
       </View>

       {/* Pressable calls handlePress when the image is pressed */}
       <View style={styles.eggWrapper}>
         <Pressable testID="egg-button" onPress={handlePress}>
           {/* Animated Image allows for scaling animations */}
           <Animated.Image
             testID="egg-image"
             source={egg.img}
             style={[styles.egg, { transform: [{ scale: scaleAnim }] }]}
           />
         </Pressable>

          {/* First compare if currency is > 0 in order to display stored score from Zustand */}
         {currency > 0 && (
           <Text style={styles.currency}>Currency: {currency}</Text>
         )}

          {/* Display stored progress bar from Zustand */}
          {egg?.clicksNeeded > 0 && (
           <View style={styles.progressBarContainer}>
             <View
               style={[
                 styles.progressBarFill,
                 { width: `${(egg.progress / (egg.clicksNeeded * (1-boost))) * 100}%` },
               ]}
             />
             <Text style={styles.progressBarText}>
               {egg.progress} / {Math.round(egg.clicksNeeded * (1-boost))}
             </Text>
           </View>
         )}

       <Button testID="reset-button" title="Reset Progress" onPress={resetProgress} />

         {/* Handles +1 animation */}
         <Animated.Text
           style={[
             styles.plusOne,
             {
               opacity: plusOneOpacity,
               transform: [{ translateY: plusOneY }],
             },
           ]}
         >
           +{clickBonus}
         </Animated.Text>
         {/* Show all active */}
         <View style={styles.itemBar}>
          <Text style={styles.itemBarText}>Active Items:</Text>
            {/* Show all owned hammers */}
            {ownedHammerIds.map((id) => {
              const hammer = itemData.hammers[id];
              if (!hammer) return null;

              return (
              <View key={id} style={styles.hammerContainer}>
                <Image source={hammer.image} style={styles.hammerIcon} />
                <Text style={styles.hammerText}>
                </Text>
              </View>
              );
            })}
        </View>
       </View>
     </View>
   </ImageBackground>
 );
};

export default EggClicker;

//Styling for the components
const styles = StyleSheet.create({
 container: {
   justifyContent: 'center',
   alignItems: 'center',
 },

 egg: {
   width: 200,
   height: 200,
 },

 plusOne: {
   position: 'absolute',
   top: '10%',
   fontSize: 50,
   color: 'black',
   fontWeight: 'bold',
 },

 hammerIcon: {
   width: 32,
   height: 32,
   resizeMode: 'contain',
 },

 currency: {
   fontSize: 24,
   fontWeight: 'bold',
   marginTop: 20,
   color: 'black',
 },

 backgroundImage: {
   flex: 1,
   resizeMode: 'stretch',
 },

 title: {
   width: 350,
   resizeMode: 'contain',
 },

 title_container: {
   paddingTop: '15%',
   paddingBottom: '65%',
 },

 eggWrapper: {
   justifyContent: 'center',
   alignItems: 'center',
   position: 'relative',
 },

  progressBarContainer: {
   width: 200,
   height: 20,
   backgroundColor: 'white',
   borderRadius: 10,
   marginTop: '5%',
   marginLeft: '2%',
 },

 progressBarFill: {
   height: '100%',
   backgroundColor: '#4caf50',
   borderRadius: 10,
 },

 progressBarText: {
   position: 'absolute',
   width: '100%',
   textAlign: 'center',
   color: 'black',
   fontWeight: 'bold',
 },

 itemBar: {
  flexDirection: 'row',
  gap: '2%',
  backgroundColor: 'white',
  paddingLeft: '1%',
  paddingRight: '1%',
  borderRadius: 20,
  marginTop: '3%'
 },

 itemBarText: {
  color: 'black',
  fontWeight: 'bold',
  fontSize: 16,
  marginTop: '4%'
 },

 hammerContainer: {
  alignItems: 'center',
  marginTop: '2%'
},

hammerText: {
  fontSize: 10,
  color: 'black',
},

});