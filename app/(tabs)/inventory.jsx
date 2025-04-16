import { StyleSheet, Text, View } from "react-native"

const Inventory = () => {
    return (
        <View style={styles.container}>
            <Text>Inventory</Text>
        </View>
    )
}

export default Inventory

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
})