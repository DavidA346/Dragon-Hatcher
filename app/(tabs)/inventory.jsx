import { StyleSheet, Text, View, ImageBackground, Image, FlatList, Pressable } from "react-native"

//Holds the dragons in their cards
const firstDragonRow = [
    { id: '1', image: require('../../assets/Wyverns/Blue-Green/adult.gif')},
    { id: '2', image: require('../../assets/Dragons/White-Violet/baby.gif')},
    { id: '3', image: require('../../assets/Dragons/Gold/adult.gif')},
];

const secondDragonRow = [
    { id: '1', image: require('../../assets/Wyverns/Brown-Green/adult.gif')},
    { id: '2', image: require('../../assets/Dragons/Orange/adult.gif')},
    { id: '3', image: require('../../assets/Dragons/Blue-Orange/adult.gif')},
];

const thirdDragonRow = [
    { id: '1', image: require('../../assets/Drakes/Black-Violet/adult.gif')},
    { id: '2', image: require('../../assets/Wyverns/Blue-Green/baby.gif')},
    { id: '3', image: require('../../assets/Dragons/Green/adult.gif')},
];

const fourthDragonRow = [
    { id: '1', image: require('../../assets/Drakes/Green-Red/adult.gif')},
    { id: '2', image: require('../../assets/Dragons/White-Violet/adult.gif')},
    { id: '3', image: require('../../assets/Dragons/Red/adult.gif')},
];

const Inventory = () => {
    //Renders the dragons to the screen
    const renderItem = ({ item }) => (
        //Make the cards pressable for later coin functionality
        <Pressable onPress={() => console.log('Pressed', item.title)} style={({ pressed }) => [
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
                <View style={styles.topSection}>
                    <View>
                        <Text style={styles.titles}>Totals</Text>
                        <Text style={styles.dragonText}>Dragons: 9</Text>
                        <Text style={styles.drakesText}>Drakes: 9</Text>
                        <Text style={styles.wyvernsText}>Wyverns: 9</Text>
                    </View>

                    <View>
                        <Text style={styles.titles}>Species</Text>
                        <Text style={styles.dragonText}>Dragons: 6/6</Text>
                        <Text style={styles.drakesText}>Drakes: 2/2</Text>
                        <Text style={styles.wyvernsText}>Wyverns: 2/2</Text>
                    </View>
                </View>

                 {/* Displays the dragon card lists to the screen */}
                <FlatList
                    data={firstDragonRow}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    horizontal={true} 
                />

                <FlatList
                    data={secondDragonRow}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    horizontal={true} 
                />

                <FlatList
                    data={thirdDragonRow}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    horizontal={true} 
                />

                <FlatList
                    data={fourthDragonRow}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    horizontal={true} 
                />
            </View>
        </ImageBackground>
    )
}

export default Inventory

//Styling for all the components above
const styles = StyleSheet.create({
    container: {
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
        marginBottom: 30,
        height: 118,
        width: 120,
        alignSelf: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginLeft: 10,
      },

      image: {
        width: 110,
        height: 100,
        borderRadius: 8,
        resizeMode: 'contain',
      },

      titles: {
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        fontSize: 18,
      },

      topSection: {
        flexDirection: 'row',
        gap: 120,
        paddingBottom: 30,
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
})