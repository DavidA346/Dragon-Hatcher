import { StyleSheet, Text, View, ImageBackground, Image } from "react-native"

const Shop = () => {
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
})