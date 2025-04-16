import { Tabs } from "expo-router";

const TabsLayout = () => {
    return (
        <Tabs>
            <Tabs.Screen name="index"
            options={{
                headerTitle: "Dragon Catcher",
            }}/>

            <Tabs.Screen name="shop"
            options={{
                headerTitle: "Shop",
            }}/>

             <Tabs.Screen name="inventory"
            options={{
                headerTitle: "Inventory",
            }}/>
        </Tabs>
    );
};

export default TabsLayout;