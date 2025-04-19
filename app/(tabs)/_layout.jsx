import { Tabs } from "expo-router";
import { Image, Text } from "react-native";

const TabsLayout = () => {
    return (
        <Tabs
        screenOptions={{
            tabBarStyle: {
              backgroundColor: 'transparent',
              elevation: 0,
              borderTopWidth: 0,
              position: 'absolute',
            },
          }}
        >      
            <Tabs.Screen name="index"
            options={{
                headerTitle: "DRAGON CATCHER",
                tabBarLabel: ({ focused }) => (
                    <Text style={{
                      fontSize: 20,
                      color: focused ? 'black' : '#999',
                      marginTop: 20,
                    }}>
                      HATCH
                    </Text>
                  ),

                tabBarIcon: ({ focused }) => (
                    <Image
                        source={require("../../assets/Dragons/Red/egg_sprites/sprite_0.png")}
                        style={{
                            width: 70,
                            height: 70,
                            resizeMode: 'contain',
                            opacity: focused ? 1 : 0.5,
                            marginBottom: 20,
                        }}
                    />
                )
            }}/>

            <Tabs.Screen name="shop"
            options={{
                headerTitle: "STORE",
                tabBarLabel: ({ focused }) => (
                    <Text style={{
                      fontSize: 20,
                      color: focused ? 'black' : '#999',
                      marginTop: 20,
                    }}>
                      STORE
                    </Text>
                  ),

                tabBarIcon: ({ focused }) => (
                    <Image
                        source={require("../../assets/item sprites/coin/coin_sprite.png")}
                        style={{
                            width: 70,
                            height: 70,
                            resizeMode: 'contain',
                            opacity: focused ? 1 : 0.5,
                            marginBottom: 20,
                        }}
                    />
                )
            }}/>

             <Tabs.Screen name="inventory"
            options={{
                headerTitle: "BROOD",
                tabBarLabel: ({ focused }) => (
                    <Text style={{
                      fontSize: 20,
                      color: focused ? 'black' : '#999',
                      marginTop: 20,
                    }}>
                      BROOD
                    </Text>
                  ),

                tabBarIcon: ({ focused }) => (
                    <Image
                        source={require("../../assets/Dragons/Red/adult.gif")}
                        style={{
                            width: 70,
                            height: 70,
                            resizeMode: 'contain',
                            opacity: focused ? 1 : 0.5,
                            marginBottom: 20,
                        }}
                    />
                )
            }}/>
        </Tabs>
    );
};

export default TabsLayout;