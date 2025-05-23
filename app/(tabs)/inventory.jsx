import React, { useRef, useState } from "react";
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

const CreatureCard = ({ item, onPress }) => {
  // Animated values for the +amount popup
  const plusOneOpacity = useRef(new Animated.Value(0)).current;
  const plusOneY = useRef(new Animated.Value(0)).current;

  // State to hold current displayed increment amount
  const [plusOneAmount, setPlusOneAmount] = useState(null);

  // Trigger animation and show amount
  const triggerPlusOneAnimation = (amount) => {
    setPlusOneAmount(amount);
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
    ]).start(() => {
      setPlusOneAmount(null);
    });
  };

  const handlePress = () => {
    onPress(triggerPlusOneAnimation);
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
        {plusOneAmount !== null && (
          <Animated.View
            style={[
              styles.plusOneContainer,
              {
                opacity: plusOneOpacity,
                transform: [{ translateY: plusOneY }],
              },
            ]}
          >
            <Text style={styles.plusOneText}>+{plusOneAmount.toFixed(1)}</Text>
            <Image
              style={styles.coin}
              source={require("../../assets/item sprites/coin/coin_sprite.png")}
            />
          </Animated.View>
        )}
      </View>
    </Pressable>
  );
};

const Inventory = () => {
  const creatureInventory = useStore((state) => state.creatureInventory);
  const gold = useStore((state) => state.gold);
  const incrementGold = useStore((state) => state.incrementGold);

  // Filtering creatures by type
  const dragonCollection = creatureInventory.filter(
    (creature) => creature.type === "Dragon"
  );
  const drakeCollection = creatureInventory.filter(
    (creature) => creature.type === "Drake"
  );
  const wyvernCollection = creatureInventory.filter(
    (creature) => creature.type === "Wyvern"
  );

  // Haptic feedback on press
  const triggerHapticFeedback = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // Compute gold increment amount when a creature is pressed
  const computeGoldIncrement = (creature) => {
    const type = creature.type.toLowerCase();
    const totemEffects = useStore.getState().getTotemEffects(creature);
    const goldScrollEffect = useStore.getState().getScrollEffect("gold") ?? 0;
    const creatureScrollEffect = useStore.getState().getScrollEffect(type) ?? 0;
    const scrollBonus = goldScrollEffect + creatureScrollEffect;
    const bonusGold = totemEffects?.goldBonus || 0;
    const goldMult = useStore.getState().getScrollMultiplier("gold") ?? 1;
    const goldMult2 = useStore.getState().getScrollMultiplier(type) ?? 1;
    const scrollMult = goldMult * goldMult2;

    return (1 + bonusGold + scrollBonus) * scrollMult;
  };

  // Render each creature card
  const renderItem = ({ item }) => (
    <CreatureCard
      item={item}
      onPress={(triggerAnimation) => {
        triggerHapticFeedback();

        if (item.stage === "adult") {
          const incrementAmount = computeGoldIncrement(item);
          incrementGold(item);
          triggerAnimation(incrementAmount);
        }
      }}
    />
  );

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
              Drakes: {drakeCollection.length}/2
            </Text>
            <Text style={styles.wyvernsText}>
              Wyverns: {wyvernCollection.length}/2
            </Text>
          </View>
        </View>

        <View style={styles.goldContainer}>
          <Text style={styles.goldText}>{gold.toFixed(1)}</Text>

          <Image
            style={styles.gold_coin}
            source={require("../../assets/item sprites/coin/coin_sprite.png")}
          />
        </View>

        <FlatList
          data={dragonCollection}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.dragonsGrid}
          showsVerticalScrollIndicator={false}
        />

        <FlatList
          data={drakeCollection}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.drakesGrid}
          style={styles.TwoColumnList}
          showsVerticalScrollIndicator={false}
        />

        <FlatList
          data={wyvernCollection}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.wyvernsGrid}
          style={styles.TwoColumnList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "stretch",
  },
  title: {
    width: 150,
    resizeMode: "contain",
    paddingTop: 50,
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
    paddingBottom: 10,
  },
  dragonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  drakesText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  wyvernsText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  goldContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  goldText: {
    fontWeight: "bold",
    fontSize: 24,
    marginRight: 5,
  },
  gold_coin: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  dragonsGrid: {
    paddingBottom: 40,
  },
  drakesGrid: {
    paddingBottom: 40,
  },
  wyvernsGrid: {
    paddingBottom: 40,
  },
  TwoColumnList: {
    marginBottom: 20,
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
    marginLeft: "25%",
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
    color: "black",
  },
  coin: {
    width: "60%",
    height: "60%",
    resizeMode: "contain",
  },
});

export default Inventory;
