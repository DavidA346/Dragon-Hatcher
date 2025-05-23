import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  FlatList,
  Pressable,
  Animated,
} from "react-native";
import useStore from "../../store/useStore";
import * as Haptics from "expo-haptics";
import React, { useRef, useEffect, useState } from "react";

const CreatureCard = ({ item, onPress, goldEarned }) => {
  const plusOneOpacity = useRef(new Animated.Value(0)).current;
  const plusOneY = useRef(new Animated.Value(0)).current;
  const [earnedAmount, setEarnedAmount] = useState(0);

  const triggerPlusOneAnimation = (amount) => {
    setEarnedAmount(amount);
    plusOneOpacity.setValue(1);
    plusOneY.setValue(0);

    Animated.parallel([
      Animated.timing(plusOneOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(plusOneY, {
        toValue: -80,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      useStore.getState().growBabiesToAdults();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePress = () => {
    onPress();
    if (item.stage === "adult") {
      triggerPlusOneAnimation(goldEarned);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: pressed ? "white" : "#cad0d0",
          opacity: pressed ? 1 : 0.8,
        },
      ]}
    >
      <View style={styles.card}>
        <Image source={item.image} style={styles.image} />
        <Animated.View
          style={[
            styles.plusOneContainer,
            {
              opacity: plusOneOpacity,
              transform: [{ translateY: plusOneY }],
            },
          ]}
        >
          <Text style={styles.plusOneText}>+{earnedAmount}</Text>
          <Image
            style={styles.coin}
            source={require("../../assets/item sprites/coin/coin_sprite.png")}
          />
        </Animated.View>
      </View>
    </Pressable>
  );
};

const Inventory = () => {
  const creatureInventory = useStore((state) => state.creatureInventory);
  const gold = useStore((state) => state.gold);
  const incrementGold = useStore((state) => state.incrementGold);
  const getScrollEffect = useStore((state) => state.getScrollEffect);
  const getScrollMultiplier = useStore((state) => state.getScrollMultiplier);
  const getTotemEffects = useStore((state) => state.getTotemEffects);

  const triggerHapticFeedback = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const calculateGoldEarned = (creature) => {
    const type = creature.type.toLowerCase();
    const totemEffects = getTotemEffects(creature);
    const goldScrollEffect = getScrollEffect("gold") ?? 0;
    const creatureScrollEffect = getScrollEffect(type) ?? 0;
    const scrollBonus = goldScrollEffect + creatureScrollEffect;
    const bonusGold = totemEffects?.goldBonus || 0;
    const goldMult = getScrollMultiplier("gold") ?? 1;
    const goldMult2 = getScrollMultiplier(type) ?? 1;
    const scrollMult = goldMult * goldMult2;
    return (1 + bonusGold + scrollBonus) * scrollMult;
  };

  const renderItem = ({ item }) => {
    const goldEarned = item.stage === "adult" ? calculateGoldEarned(item) : 0;

    return (
      <CreatureCard
        item={item}
        goldEarned={goldEarned}
        onPress={() => {
          triggerHapticFeedback();
          if (item.stage === "adult") {
            incrementGold(item);
          }
        }}
      />
    );
  };

  const dragonCollection = creatureInventory.filter((c) => c.type === "Dragon");
  const drakeCollection = creatureInventory.filter((c) => c.type === "Drake");
  const wyvernCollection = creatureInventory.filter((c) => c.type === "Wyvern");

  return (
    <ImageBackground
      source={require("../../assets/backgrounds/collection_background.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View>
          <Image
            source={require("../../assets/titles/Brood_text.png")}
            style={styles.title}
          />
        </View>

        <View style={styles.statSection}>
          <View>
            <Text style={styles.stats}>Totals</Text>
            <Text style={styles.dragonText}>
              Dragons: {dragonCollection.length}/6
            </Text>
            <Text style={styles.drakesText}>
              Drakes: {drakeCollection.length}/3
            </Text>
            <Text style={styles.wyvernsText}>
              Wyverns: {wyvernCollection.length}/3
            </Text>
          </View>
        </View>

        {/* Gold Badge */}
        <View style={styles.goldContainer}>
          <Text style={styles.goldText}>{gold}</Text>
                    
            <View style={styles.goldCoinContainer}>
              <Image
                style={styles.gold_coin}
                source={require("../../assets/item sprites/coin/coin_sprite.png")}
              />
            </View>
        `</View>

        <View style={styles.flatListsWrapper}>
          <FlatList
            data={dragonCollection}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
            style={styles.flatList}
          />
          <FlatList
            data={drakeCollection}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
            style={styles.flatList}
          />
          <FlatList
            data={wyvernCollection}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
            style={styles.flatListLast}
          />
        </View>
      </View>
    </ImageBackground>
  );
};


export default Inventory;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "flex-start" 
  },

  backgroundImage: { 
    flex: 1, 
    resizeMode: 
    "stretch" 
  },

  title: { 
    width: 150, 
    resizeMode: "contain", 
    paddingTop: 50 
  },

  card: {
    borderRadius: 20,
    margin: 8,
    width: 120,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 10,
  },

  image: { 
    width: 100, 
    height: 100, 
    marginLeft: "25%" 
  },

  stats: {
    fontWeight: "bold",
    textDecorationLine: "underline",
    fontSize: 18,
    justifyContent: "center",
  },

  statSection: { 
    flexDirection: "row",
    gap: 120, 
    paddingBottom: 10 
  },

  dragonText: { 
    fontSize: 18, 
    fontWeight: "bold" 
  },

  drakesText: { 
    fontSize: 18, 
    fontWeight: "bold" 
  },

  wyvernsText: { 
    fontSize: 18, 
    fontWeight: "bold" 
  },

  goldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '8%'
  },

  goldCoinContainer: {
    width: '10%',
    height: '34%',
    resizeMode: 'contain',
  },

  goldText: {
    fontSize: 27, 
    fontWeight: 'bold',
    color: 'black',
  },

  gold_coin: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  plusOneContainer: {
    position: "absolute",
    top: "35%",
    left: "20%",
    flexDirection: "row",
    alignItems: "center",
  },

  plusOneText: { 
    fontSize: 40, 
    fontWeight: "bold", 
    color: "black" 
  },

  coin: { 
    width: "60%", 
    height: "60%", 
    resizeMode: "contain" 
  },

  flatListsWrapper: { 
    width: "100%", 
    alignItems: "center" 
  },

  flatList: { 
    marginBottom: "1%" 
  },
});