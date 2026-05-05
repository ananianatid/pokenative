import { Shadows } from "@/constants/shadows";
import { useThemeColors } from "@/hooks/useThemeColors";
import { View, ViewProps, ViewStyle } from "react-native";

type Props = ViewProps
export function Card({style, ...rest}: Props) {
    const colors = useThemeColors();
    return <View style={[style,styles,{backgroundColor: colors.grayWhite }]} {...rest}/>
}

const styles = {
    backgroundColor: '#FFFFFF',
    borderRadius: 8, 
    ...Shadows.dp2 
}   satisfies ViewStyle