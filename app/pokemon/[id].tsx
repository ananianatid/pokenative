import { RootView } from "@/components/RootView"
import { Row } from "@/components/Row"
import { ThemedText } from "@/components/ThemedText"
import { Colors } from "@/constants/colors"
import { useFetchQuery } from "@/hooks/useFetchQuery"
import { useThemeColors } from "@/hooks/useThemeColors"
import { router, useLocalSearchParams } from "expo-router"
import { Text, View,StyleSheet,Image, Pressable } from "react-native" 
import { getPokemonArtwork } from "@/functions/pokemon" 
export default function Pokemon() {
    const colors = useThemeColors()
    const params = useLocalSearchParams() as {id: string}
    const {data:pokemon} = useFetchQuery("/pokemon/[id]", {id: params.id} ) 
    const mainType = pokemon?.types[0].type.name 

    const colorType = mainType ? Colors.type[mainType] : colors.grayWhite

    return <RootView style={{backgroundColor: colorType}}> 
        <View>
            <Image source={require("@/assets/images/Pokeball-artwork.png")} style={Styles.pokeball} width={208} height={208} />
            <Row style={Styles.header} >
                <Pressable onPress={router.back} >
                        <Row gap={8}>
                            <Image source={require("@/assets/images/back.png")} width={32} height={32} />
                            <ThemedText variant="headline" color="grayLight">{pokemon?.name}</ThemedText>
                        </Row>
                </Pressable>
                        <ThemedText color="grayWhite" variant="subtitle2">#{params.id.padStart(3, "0" )}</ThemedText> 
            </Row>
            <Image source={{uri: getPokemonArtwork(parseInt(params.id, 10))}} style={Styles.artwork}  width={200} height={200} />
            <Text>Pokemon {params.id}</Text> 
        </View>
    </RootView>
}

const Styles = StyleSheet.create ({
    header:{
        margin:20,
        justifyContent:"space-between",

    },
    pokeball:{
        opacity: 0.2,
        position: 'absolute',
        right: 8,
        top:8
    },
    artwork:{
        alignSelf: 'center',
    }
})