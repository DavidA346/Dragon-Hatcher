import { StyleSheet, Text, View, ImageBackground } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context';

const Shop = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ImageBackground
                    source = {require('../../assets/backgrounds/shop_background.png')}
                    style={styles.backgroundImage}
            >
            <Text style={styles.headerText}>SHOP</Text>
            {/* <View style={styles.container}>
                <Text>Shop</Text>
            </View> */}
            </ImageBackground>
        </SafeAreaView>
    )
}

export default Shop

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     alignItems: 'center',
    //     justifyContent: 'center'
    // },
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',   // so you can see any background behind it
    },
    headerText: {
        position: 'absolute',
        top: 40,                // adjust as needed for status‐bar / notch
        alignSelf: 'center',    // center horizontally
        fontSize: 32,
        fontWeight: '700',
        color: '#000ffff',
        zIndex: 10,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
      },
})