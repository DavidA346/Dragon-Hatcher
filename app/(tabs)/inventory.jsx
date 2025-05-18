import { StyleSheet, Text, View, ImageBackground, Image, FlatList, Pressable, Animated } from "react-native"
import useStore from "../../store/useStore";
import * as Haptics from 'expo-haptics'; 
import React, { useRef, useEffect } from "react";

//To allow for +1 on each dragon
const CreatureCard = ({ item, onPress }) => {
    //Controls opacity of the +1, starts at 0 as it is hidden until pressed
    const goldBonus = useStore.getState().getScrollEffect();
    const goldMultBonus = useStore.getState().getScrollMultiplier();
    const gold = useStore(state => state.gold);
    const goldEffect = (1 + goldBonus) * goldMultBonus;

    const plusOneOpacity = useRef(new Animated.Value(0)).current;
    //Controls the y position of the +1 and moves upward when pressed, also starts as 0
    const plusOneY = useRef(new Animated.Value(0)).current;

    //Triggers +1 animation
    const triggerPlusOneAnimation = () => {
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
                toValue: -80,
                duration: 500,
                useNativeDriver: true,
             }),
        ]).start();
    };

    useEffect(() => {
        const interval = setInterval(() => {
          useStore.getState().growBabiesToAdults();
        }, 5000); // every 5 seconds
      
        return () => clearInterval(interval);
      }, []);      

    //Triggers the press if it is an adult
    const handlePress = () => {
        onPress();
        if (item.stage === 'adult') {
            triggerPlusOneAnimation();
        }
    };

    return (
        <Pressable
            onPress={handlePress}
            style={({ pressed }) => [
                styles.card,
                {
                    //Changes the cards color and opacity when pressed
                    backgroundColor: pressed ? 'white' : '#cad0d0',
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
    <Text style={styles.plusOneText}>+{goldEffect}</Text>
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
    const creatureInventory = useStore(state => state.creatureInventory);
    // gold balance & click‐to‐earn
    const gold = useStore(state => state.gold);
    const incrementGold = useStore(state => state.incrementGold);

    const dragonCollection = creatureInventory.filter(
        (creature) => creature.type === 'Dragon'
    );
        
    const drakeCollection = creatureInventory.filter(
        (creature) => creature.type === 'Drake'
    );
        
    const wyvernCollection = creatureInventory.filter(
        (creature) => creature.type === 'Wyvern'
    );

    //Function to trigger haptic feedback
    const triggerHapticFeedback = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    //Renders the dragons to the screen
    const renderItem = ({ item }) => (
        <CreatureCard
            item={item}
            onPress={() => {
                triggerHapticFeedback();
                //only adults can increment gold
                if(item.stage === 'adult') {
                    incrementGold(item);
                }
            }}
        />
    );

    return (
        //Shows the image as the background for the screen
        <ImageBackground
            source={require('../../assets/backgrounds/collection_background.png')}
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <View>
                    {/* Displays the BROOD image to the screen */}
                    <Image
                        source={require('../../assets/titles/Brood_text.png')}
                        style={styles.title}
                    >
                    </Image>
                </View>

                {/* Displays the top section to the screen */}
                <View style={styles.statSection}>
                    <View>
                        <Text style={styles.stats}>Totals</Text>
                        <Text style={styles.dragonText}>Dragons: {dragonCollection.length}/6</Text>
                        <Text style={styles.drakesText}>Drakes: {drakeCollection.length}/2</Text>
                        <Text style={styles.wyvernsText}>Wyverns: {wyvernCollection.length}/2</Text>
                    </View>
                </View>

                {/* Gold Badge */}
                <View style={styles.goldContainer}>
                    <Text style={styles.goldText}>{gold}</Text>

                    <Image
                        style={styles.gold_coin}
                        source={require("../../assets/item sprites/coin/coin_sprite.png")}
                    />
                </View>

                 {/* Displays the dragon card lists to the screen */}
                 <FlatList  data={dragonCollection}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            numColumns={3}
                            contentContainerStyle={styles.dragonsGrid}
                            showsVerticalScrollIndicator={false}
                />

                <FlatList  data={drakeCollection}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            numColumns={2}
                            contentContainerStyle={styles.drakesGrid}
                            style={styles.TwoColumnList}
                            showsVerticalScrollIndicator={false}
                /> 

                <FlatList  data={wyvernCollection}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            numColumns={2}
                            contentContainerStyle={styles.wyvernsGrid}
                            style={styles.TwoColumnList}
                            showsVerticalScrollIndicator={false}
                />              
            </View>
        </ImageBackground>
    )
}

export default Inventory

//Styling for all the components above
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    backgroundImage: {
        flex: 1,
        resizeMode: 'stretch',
    },

    title: {
        width: 150,
        resizeMode: 'contain',
        paddingTop: 50,
    },

    card: {
        borderRadius: 20,
        margin: 8,
        width: 120,
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 10
      },

    dragonsGrid: {
        paddingHorizontal: 20,
        paddingLeft: 1,
        justifyContent: 'center',
    },

    TwoColumnList: {
        width: '125%'
    },

    drakesGrid: {
        paddingLeft: '23%',
        justifyContent: 'center',
    },

    wyvernsGrid: {
        paddingLeft: '23%',
        justifyContent: 'center',
    },

    image: {
        width: 100,
        height: 100,
        marginLeft: '25%'
    },

    stats: {
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        fontSize: 18,
        justifyContent: 'center'
    },

    statSection: {
        flexDirection: 'row',
        gap: 120,
        paddingBottom: 10,
    },

    dragonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    drakesText: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    wyvernsText: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    goldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '3%',
        marginLeft: '46%',
        marginRight: '42%',
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
        position: 'absolute',
        top: '35%',
        left: '20%',
        flexDirection: 'row',
        alignItems: 'center',
    },    

    plusOneText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'black',
    },
    
    coin: {
        width: '60%',
        height: '60%',
        resizeMode: 'contain',
    },
});