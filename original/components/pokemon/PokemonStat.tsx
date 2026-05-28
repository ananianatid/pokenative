import { View, ViewProps } from "react-native";
import { Row } from "../Row";
import { StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { use, useEffect } from "react";
import { useAnimatedStyle } from "react-native-reanimated";
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
    const statValue = value ?? 0;
    const sharedValue = useSharedValue(statValue );
    const barInnerStyle = useAnimatedStyle(()=>{
        return {
            flex: sharedValue.value,
        }
    })
    const barBackgroundStyle = useAnimatedStyle(()=>{
        return {
            flex: 255 - sharedValue.value,
        }
    })

    useEffect(()=>{
         sharedValue.value = withSpring(statValue, { stiffness: 120, mass: 0.8 }) 
    },[statValue])
    
    return <Row gap={8} style={[style, styles.root]} {...rest}>
        <View style={[  styles.name, {borderColor: colors.grayLight}]}>    
            <ThemedText variant="subtitle3" style={{ color }}>
                {statShortName(name ?? "")}

            </ThemedText>
        </View> 
        <View style={styles.number}>
            <ThemedText variant="subtitle3" style={{ color }}>
                {statValue.toString().padStart(3, "0")}
            </ThemedText>
        </View>
        <Row style={[styles.bar]}>
            <Animated.View style={[styles.barInner, {  backgroundColor: color}, barInnerStyle]} />
            <Animated.View style={[styles.barBackground, { backgroundColor: color},barBackgroundStyle  ]}/>
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
