import { StyleSheet, Text, View, ImageBackground, Image, FlatList, Pressable } from "react-native"
import useStore from "../../store/useStore";
import * as Haptics from 'expo-haptics';

//Items to display to the screen
const shopItems = [
    {
        id: '1',
        name: 'The Hammer of Yur',
        price: 100,
        info: 'Hits eggs.',
        description: '+1 every click.',
        gold_icon: require('../../assets/item sprites/coin/coin_sprite.png'),
        icon: require('../../assets/item sprites/hammers/woodenHammer_sprite.png'),
    },

    {
        id: '2',
        name: 'The Hammer of Tou',
        price: 500,
        info: 'Hits eggs hard.',
        description: '+5 every click.',
        gold_icon: require('../../assets/item sprites/coin/coin_sprite.png'),
        icon: require('../../assets/item sprites/hammers/ironHammer_sprite.png'),
    },

    {
        id: '3',
        name: 'The Hammer of Gude',
        price: 1000,
        info: 'Hits eggs harder.',
        description: '+10 every click.',
        gold_icon: require('../../assets/item sprites/coin/coin_sprite.png'),
        icon: require('../../assets/item sprites/hammers/goldHammer_sprite.png'),
    },

    {
        id: '4',
        name: 'Brywyn\’s Scroll',
        price: 2100,
        info: 'Describes Dragons.',
        description: 'Increases gold earned from Adult-dragons.',
        gold_icon: require('../../assets/item sprites/coin/coin_sprite.png'),
        icon: require('../../assets/item sprites/scrolls/dragon scroll/dragonscroll_sprite.png'),
    },

    {
        id: '5',
        name: 'Anpero\’s Scroll',
        price: 1300,
        info: 'Describes Drakes.',
        description: 'Increases gold earned from Adult-drakes.',
        gold_icon: require('../../assets/item sprites/coin/coin_sprite.png'),
        icon: require('../../assets/item sprites/scrolls/drake scroll/drakescroll_sprite.png'),
    },

    {
        id: '6',
        name: 'Arostiv\’s Scroll',
        price: 800,
        info: 'Describes Wyverns.',
        description: 'Increases gold earned from Adult-wyverns.',
        gold_icon: require('../../assets/item sprites/coin/coin_sprite.png'),
        icon: require('../../assets/item sprites/scrolls/wyvern scroll/wyvernscroll_sprite.png'),
    },

    {
        id: '7',
        name: 'Danask\’s Scroll',
        price: 800,
        info: 'Describes gold.',
        description: '+1 gold for every click.',
        gold_icon: require('../../assets/item sprites/coin/coin_sprite.png'),
        icon: require('../../assets/item sprites/scrolls/coin scroll/coinscroll_sprite.png'),
    },

    {
        id: '8',
        name: 'Jothur\’s Scroll',
        price: 500,
        info: 'Describes eggs.',
        description: 'Faster hatching rate for eggs.',
        gold_icon: require('../../assets/item sprites/coin/coin_sprite.png'),
        icon: require('../../assets/item sprites/scrolls/egg scroll/eggscroll_sprite.png'),
    },

    {
        id: '9',
        name: 'Totem of Sef Enna',
        price: 5000,
        info: 'Inspires all dragons.',
        description: '+100 gold for every click after collecting all dragons',
        gold_icon: require('../../assets/item sprites/coin/coin_sprite.png'),
        icon: require('../../assets/item sprites/totems/dragon_totem.png'),
    },

    {
        id: '10',
        name: 'Totem of Rac Nivt',
        price: 5000,
        info: 'Inspires all drakes.',
        description: '+100 gold for every click after collecting all drakes',
        gold_icon: require('../../assets/item sprites/coin/coin_sprite.png'),
        icon: require('../../assets/item sprites/totems/drake_totem.png'),
    },

    {
        id: '11',
        name: 'Totem of Ga Hib',
        price: 5000,
        info: 'Inspires all wyverns.',
        description: '+100 gold for every click after collecting all wyverns',
        gold_icon: require('../../assets/item sprites/coin/coin_sprite.png'),
        icon: require('../../assets/item sprites/totems/wyvern_totem.png'),
    },

    {
        id: '12',
        name: 'Mana Potion',
        price: 300,
        info: 'Enhances hands.',
        description: 'Automatically clicks eggs by +1 every 3s',
        gold_icon: require('../../assets/item sprites/coin/coin_sprite.png'),
        icon: require('../../assets/item sprites/potions/mana1_sprite.png'),
    },
];


const Shop = () => {
    const gold = useStore(state => state.gold);
    const {purchaseItem } = useStore();

    //Function to trigger haptic feedback
    const triggerHapticFeedback = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    return (
        <ImageBackground
            source = {require('../../assets/backgrounds/resized_shop_background.png')}
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <View style={styles.title_container}>
                    {/* Displays the BROOD image to the screen */}
                    <Image
                        source={require('../../assets/titles/Store_text.png')}
                        style={styles.title}
                    >
                    </Image>
                </View>

                {/* Gold Badge */}
                <View style={styles.goldContainer}>
                    <Text style={styles.goldText}>{gold}</Text>          
                        <Image
                            style={styles.gold_coin}
                            source={require("../../assets/item sprites/coin/coin_sprite.png")}
                        />
                    </View>
                
                    <View style={styles.scrollContainer}>
                        <FlatList
                        data={shopItems}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <Pressable
                                style={({ pressed }) => [
                                    styles.itemContainer,
                                    pressed && styles.itemPressed,
                                ]}
                                onPress={() => {
                                    triggerHapticFeedback();
                                    purchaseItem('scrolls', 'gold1', 'gold');
                                    console.log(`Pressed: ${item.name}`);
                                }}
                                >
                                <Image source={item.icon} style={styles.itemIcon} />
                                <View style={styles.itemTextContainer}>
                                    <View style={styles.topSection}>
                                        <Text style={styles.itemTitle}>{item.name} - {item.price}</Text>
                                        <Image source={item.gold_icon} style={styles.goldItemIcon} />
                                    </View>
                                    <Text style={styles.itemInfo}>{item.info}</Text>
                                    <Text style={styles.itemDescription}>{item.description}</Text>
                                </View>
                            </Pressable>

                        )}
                        />
                    </View>
            </View>
        </ImageBackground>
    )
}

export default Shop

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'contain',  
    },

    title: {
        width: 150,
        resizeMode: 'contain',
    },
    
    title_container: {
        paddingTop: '6%',
    },

    goldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: '47%',
        marginRight: '40%',
    },

    goldText: {
        fontSize: 27, 
        fontWeight: 'bold',
        color: 'white',
    },

    gold_coin: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },

    itemContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: '2%',
        marginVertical: '3%',
        borderRadius: '4%',
        alignItems: 'center',
        marginLeft: '1.2%',
        width: '98%',
        marginBottom: '0%',
    },

    itemIcon: {
        width: '20%',
        height: '100%',
        resizeMode: 'contain',
        backgroundColor: 'white',
    },

    itemTextContainer: {
        flexDirection: 'column',
        padding: '2%',
        marginVertical: '2%',
        width: '80%',
        alignSelf: 'center',
    },

    itemTitle: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
    },

    itemInfo: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },

    itemDescription: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },

    goldItemIcon: {
        width: '10%',
        height: '90%',
        resizeMode: 'contain',
    },

    topSection: {
        flexDirection: 'row',
    },

    scrollContainer: {
    height: '71%',
    width: '100%',
    paddingHorizontal: '3%',
    },

    itemPressed: {
  backgroundColor: 'white',
    },
})