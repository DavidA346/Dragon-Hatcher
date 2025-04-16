import { StyleSheet, Text, View } from "react-native"

const Shop = () => {
    return (
        <View style={styles.container}>
            <Text>Shop</Text>
        </View>
    )
}

export default Shop

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
})