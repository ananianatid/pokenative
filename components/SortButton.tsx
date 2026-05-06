import { ActivityIndicator, FlatList, View, StyleSheet, Pressable } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Image } from "expo-image";
type Props =  {
    value: "id" | "name",
    onChange: (v : "id" | "name") => void
}
const onButtonPress = () => {
    
}
export function SortButton({value, onChange}: Props){
    const colors = useThemeColors()
    return <Pressable onPress={onButtonPress}>
        <View style={[styles.button,{backgroundColor: colors.grayWhite}]} >
            <Image source={
            value === "id" 
                ? require('@/assets/images/id.png') 
                : require('@/assets/images/name.png')
            } 
            style={{width: 16, height: 16}} 
            />
        </View>
    </Pressable>
}

const styles = StyleSheet.create({
    button: {
        width: 32,
        height: 32,
        borderRadius: 32,
        flex: 0 ,
        alignItems: 'center',
        justifyContent: 'center'
    }
}) 