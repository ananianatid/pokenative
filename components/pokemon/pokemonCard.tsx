import { ViewStyle, Image,StyleSheet,View } from "react-native"
import { Card } from "../Card"
import { ThemedText } from "../ThemedText"
import { useThemeColors } from "@/hooks/useThemeColors"
type Props = {
  style?: ViewStyle,
  id: number,
  name: string
}
export function PokemonCard({style,id,name}: Props) {
    const colors = useThemeColors();    
  return <Card style={[style, Styles.Card]}>
        <ThemedText style={Styles.id} variant="caption" color="grayMedium">#{id.toString().padStart(3, '0')}</ThemedText>
        <Image source={{uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}}
        width={72}
        height={72}
        />
        <ThemedText>{name}</ThemedText>
        <View style={[Styles.overlay,{backgroundColor: colors.grayBackground}]}/>
    </Card>
}

const Styles = StyleSheet.create({
    Card: {
        position: 'relative', 
        alignItems: 'center',
        padding:4,
    },
    id: {
        alignSelf: 'flex-end',
    },
    overlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height:44,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        zIndex: -1
    }
})