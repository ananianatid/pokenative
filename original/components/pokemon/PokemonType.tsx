import { View, ViewStyle } from "react-native";
import { Colors } from "@/constants/colors";
import { ThemedText } from "../ThemedText";
type Props = {
    name: keyof typeof Colors.type  
}
export function PokemonType({name}: Props) {
    return <View style={[rootStyle, {backgroundColor: Colors.type[name]} ]}>
        <ThemedText variant="subtitle3  " color="grayWhite" style={{textTransform: "capitalize" }}>{name}</ThemedText>
    </View>
} 

const rootStyle = {
    flex:0,
    height:25,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
} satisfies ViewStyle