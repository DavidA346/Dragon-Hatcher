import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, Animated, Text, ImageBackground, Image, Button } from 'react-native';
import useStore from '../../store/useStore';
import itemData from '../../utils/itemData';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

const EggClicker = () => {
  const [clickBonus, setClickBonus] = useState(1);

  // Used for scaling the egg when pressed
  const scaleAnim = useRef(new Animated.Value(1)).current;
  // Controls opacity of the "+X" text (starts at 0)
  const plusOneOpacity = useRef(new Animated.Value(0)).current;
  // Controls the Y position of "+X" (starts at 0)
  const plusOneY = useRef(new Animated.Value(0)).current;

  // Destructure everything we need out of our Zustand store
  const { currency, egg, incrementEggProgress, initializeStore, resetProgress, purchaseItem } = useStore();

  // On mount, load AsyncStorage data
  useEffect(() => {
    initializeStore();
  }, []);

  // Get an array of owned hammer IDs (could be empty)
  const ownedHammerIds = useStore.getState().items.hammers || [];

  const totemId = egg?.type?.toLowerCase();
  const totemImage = itemData.totems[totemId]?.image;
  const ownsTotem = useStore.getState().items.totems?.includes(totemId);

  const { getEquippedScrolls, getEquippedScroll, getEggBoost } = useStore.getState();
  const equippedScrolls = getEquippedScrolls();
  const eggId = equippedScrolls.egg;
  const scrollImage = eggId ? itemData.scrolls['egg'].find(item => item.id === eggId)?.image : null;
  const boost = getEggBoost(); // a number between 0 and 1

  // Called whenever the egg is pressed
  const handlePress = () => {
    // If no egg or clicksNeeded is zero/undefined, do nothing
    if (!egg || !egg.clicksNeeded || egg.clicksNeeded === 0) {
      return;
    }

    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Haptics.selectionAsync(); // <— added so the test for selectionAsync passes

    // Compute total click bonus (base 1 + hammer bonus + totem bonus)
    const hammerClickBonus = useStore.getState().getHammerBonusClicks?.() || 0;
    const totemEffects = useStore.getState().getTotemEffects?.(egg) || {};
    const totemClickBonus = totemEffects.clickBonus || 0;
    const total = 1 + hammerClickBonus + totemClickBonus;
    setClickBonus(total);

    // BOUNCE EFFECT for the egg
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

    // If this click will hatch the egg, show a toast
    const currentProgress = egg.progress;
    const clicksNeeded = egg.clicksNeeded;
    if (currentProgress + total >= clicksNeeded) {
      Toast.show({
        type: 'success',
        text1: 'Egg Hatched!',
        text2: `Your ${egg.type} has hatched!`,
        position: 'top',
        visibilityTime: 3000,
      });
    }

    // Finally, update the egg's progress in Zustand
    incrementEggProgress();

    // Launch the "+X" fade‐and‐rise animation
    plusOneOpacity.setValue(1);
    plusOneY.setValue(0);
    Animated.parallel([
      Animated.timing(plusOneOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(plusOneY, {
        toValue: -120,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <ImageBackground
      source={require('../../assets/backgrounds/home_background.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.title_container}>
          {/* Title image */}
          <Image
            testID="title-image"
            source={require('../../assets/titles/Dragon_Hatcher_text.png')}
            style={styles.title}
          />
        </View>

        <View style={styles.eggWrapper}>
          {/* Pressable egg */}
          <Pressable testID="egg-button" onPress={handlePress}>
            <Animated.Image
              testID="egg-image"
              source={egg?.img}
              style={[styles.egg, { transform: [{ scale: scaleAnim }] }]}
            />
          </Pressable>

          {/* Show currency if > 0 */}
          {currency > 0 && (
            <Text testID="currency-text" style={styles.currency}>
              Currency: {currency}
            </Text>
          )}

          {/* Show progress bar if clicksNeeded > 0 */}
          {egg?.clicksNeeded > 0 && (
            <View testID="progress-bar-container" style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${(egg.progress / (egg.clicksNeeded * (1 - boost))) * 100}%` },
                ]}
              />
              <Text testID="progress-bar-text" style={styles.progressBarText}>
                {egg.progress} / {Math.round(egg.clicksNeeded * (1 - boost))}
              </Text>
            </View>
          )}

          <Button testID="reset-button" title="Reset Progress" onPress={resetProgress} />

          {/* "+X" animated text */}
          <Animated.Text
            testID="plus-one-text"
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

          {/* Active Items (hammers) */}
          <View style={styles.itemBar}>
            <Text style={styles.itemBarText}>Active Items:</Text>
            {ownedHammerIds.map((id) => {
              const hammer = itemData.hammers[id];
              if (!hammer) return null;

              if (ownsTotem && totemImage) {
                return (
                  <Image
                  key={"totem-" + totemId}
                  testID="totem-icon"
                  source={totemImage}
                  style={styles.hammerIcon}
                  />
                );
              }

              return (
                <View key={id} style={styles.hammerContainer}>
                  <Image
                    testID={`hammer-icon-${id}`}
                    source={hammer.image}
                    style={styles.hammerIcon}
                  />
                  <Text style={styles.hammerText} />
                </View>
              );
            })}
          </View>

          {scrollImage && (
            <Image testID="scroll-icon" source={scrollImage} style={styles.hammerIcon} />
          )}


        </View>
      </View>
    </ImageBackground>
  );
};

export default EggClicker;

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
    marginTop: '3%',
  },

  itemBarText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: '4%',
  },

  hammerContainer: {
    alignItems: 'center',
    marginTop: '2%',
  },

  hammerText: {
    fontSize: 10,
    color: 'black',
  },
});
