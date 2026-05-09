import { View, ViewProps } from "react-native";
import { Row } from "../Row";
import { StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import Animated from "react-native-reanimated";
type Props = ViewProps & {
    name?: string,
    value?: number, 
    color?: string
}
function statShortName(name: string): string {
    return name
        .replaceAll("special", "S")
        .replaceAll("-", " ")
        .replaceAll("attack", "ATK")
        .replaceAll("defense", "DEF")
        .replaceAll("speed", "SPD")
        .toUpperCase()
} 
export function PokemonStat({style, name, value, color, ...rest}: Props) {
    const colors = useThemeColors();
    return <Row gap={8} style={[style, styles.root]} {...rest}>
        <View style={[  styles.name, {borderColor: colors.grayLight}]}>    
            <ThemedText variant="subtitle3" style={{ color }}>
                {statShortName(name)}

            </ThemedText>
        </View>
        <View style={styles.number}>
            <ThemedText variant="subtitle3" style={{ color }}>
                {value?.toString().padStart(3, "0")}
            </ThemedText>
        </View>
        <Row style={[styles.bar]}>
            <View style={[styles.barInner, { flex:value, backgroundColor: color}]} />
            <View style={[styles.barBackground, { flex: 255 - value , backgroundColor: color} ]}/>
        </Row>
    </Row>
}

const styles = StyleSheet.create({
    root:{

    },
    name:{
        width:35,
        paddingRight:8,
        borderRightWidth:1,
        borderStyle: "solid",
    },
    number:{
        width: 24,
    },
    bar:{
        flex:1, 
        borderRadius: 20,
        height: 4,
        overflow: "hidden", 
    },
    barInner:{
        height:4,
    },
    barBackground:{
        height:4,
        opacity: 0.24,
    }
})
