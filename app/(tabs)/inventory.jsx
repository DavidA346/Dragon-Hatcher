import { StyleSheet, Text, View, ImageBackground, Image, FlatList, Pressable } from "react-native"
import * as Haptics from 'expo-haptics'; 
import useStore from '../../store/useStore';



//Holds the dragons in their cards
const dragonCollection = [
    // { id: '1', image: require('../../assets/Dragons/Blue/adult.gif')},
    // { id: '2', image: require('../../assets/Dragons/Gold/adult.gif')},
    // { id: '3', image: require('../../assets/Dragons/Green/baby.gif')},
    // { id: '4', image: require('../../assets/Dragons/Orange/baby.gif')},
    // { id: '5', image: require('../../assets/Dragons/Red/adult.gif')},
    // { id: '6', image: require('../../assets/Dragons/White/baby.gif')}
    { id: '1', image: require('../../assets/Dragons/Blue/adult.gif'),  stage: 'adult' },
    { id: '2', image: require('../../assets/Dragons/Gold/adult.gif'),  stage: 'adult' },
    { id: '3', image: require('../../assets/Dragons/Green/baby.gif'),  stage: 'baby'  },
    { id: '4', image: require('../../assets/Dragons/Orange/baby.gif'), stage: 'baby'  },
    { id: '5', image: require('../../assets/Dragons/Red/adult.gif'),   stage: 'adult' },
    { id: '6', image: require('../../assets/Dragons/White/baby.gif'), stage: 'baby'  }
];

const drakeCollection = [
    { id: '7', image: require('../../assets/Drakes/Black-Violet/baby.gif'), stage: 'baby'  },
    { id: '8', image: require('../../assets/Drakes/Green-Red/adult.gif'), stage: 'adult' }
];

const wyvernCollection = [
    { id: '9', image: require('../../assets/Wyverns/Blue-Green/baby.gif'), stage: 'baby'  },
    { id: '10', image: require('../../assets/Wyverns/Brown-Green/adult.gif'), stage: 'adult' },
];

const Inventory = () => {
    //Function to trigger haptic feedback
    const triggerHapticFeedback = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    // grab your currency-incrementer from zustand
    const { incrementCurrency, currency } = useStore();

    //Renders the dragons to the screen
    const renderItem = ({ item }) => (
        //Make the cards pressable for later coin functionality
        // <Pressable 
        //     onPress={() => {
        //         triggerHapticFeedback();
        //         console.log('Pressed', item.title);
        //     }} 
        <Pressable
            onPress={() => {
               triggerHapticFeedback();
             // only adults give gold
   if (item.stage === 'adult') {
                    incrementCurrency();
}
}}
                style={({ pressed }) => [
                styles.card,
                //Changes the cards color and opacity when pressed
                { backgroundColor: pressed ? 'white' : '#cad0d0',
                    opacity: pressed ? 1 : 0.8, 
                }
          ]}>
            <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            </View>
        </Pressable>
      );
    
    return (
        //Shows the image as the background for the screen
        <ImageBackground
            source={require('../../assets/backgrounds/collection_background.png')}
            style={styles.backgroundImage}
        >
            {/* Gold badge */}
            <View style={styles.currencyContainer}>
                <Text style={styles.currencyText}>Gold: {currency}</Text>
            </View>
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
                        <Text style={styles.dragonText}>Dragons: 6</Text>
                        <Text style={styles.drakesText}>Drakes: 2</Text>
                        <Text style={styles.wyvernsText}>Wyverns: 2</Text>
                    </View>

                    <View>
                        <Text style={styles.stats}>Species</Text>
                        <Text style={styles.dragonText}>Dragons: 6/6</Text>
                        <Text style={styles.drakesText}>Drakes: 2/2</Text>
                        <Text style={styles.wyvernsText}>Wyverns: 2/2</Text>
                    </View>
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
        // backgroundColor: '#cad0d0',
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center',
      },

    dragonsGrid: {
    // backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingLeft: 1,
    justifyContent: 'center',
    },

    TwoColumnList: {
    // backgroundColor: '#fff',
    width: '125%'
    },

    drakesGrid: {
    // backgroundColor: '#fff',
    paddingLeft: '23%',
    justifyContent: 'center',
    },

    wyvernsGrid: {
    // backgroundColor: '#fff',
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

    currencyContainer: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
  },

  currencyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },

})