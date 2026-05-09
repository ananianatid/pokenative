import { Card } from "@/components/Card"
import { PokemonType } from "@/components/pokemon/PokemonType"
import { RootView } from "@/components/RootView"
import { Row } from "@/components/Row"
import { ThemedText } from "@/components/ThemedText"
import { Colors } from "@/constants/colors"
import { formatHeight, formatWeight, getPokemonArtwork } from "@/functions/pokemon"
import { useFetchQuery } from "@/hooks/useFetchQuery"
import { useThemeColors } from "@/hooks/useThemeColors"
import { Background } from "@react-navigation/elements"
import { router, useLocalSearchParams } from "expo-router"
import { Image, Pressable, StyleSheet, Text, View } from "react-native" 
import { PokemonSpec } from "@/components/pokemon/PokemonSpec" 
export default function Pokemon() {
    const colors = useThemeColors()
    const params = useLocalSearchParams() as {id: string}
    const {data:pokemon} = useFetchQuery("/pokemon/[id]", {id: params.id} ) 
    // const {data:species} = useFetchQuery("/pokemon-species/[id]", {id: params.id} )  
    const mainType = pokemon?.types[0].type.name 

    const colorType = mainType ? Colors.type[mainType] : colors.grayWhite
    const types = pokemon?.types ?? [ ]
    return <RootView style={{backgroundColor: colorType}}> 
        <View>
            <Image source={require("@/assets/images/Pokeball-artwork.png")} style={Styles.pokeball} width={208} height={208} />
            <Row style={Styles.header} >
                <Pressable onPress={router.back} >
                        <Row gap={8}>
                            <Image source={require("@/assets/images/back.png")} width={32} height={32} />
                            <ThemedText variant="headline" color="grayLight" style={{textTransform: "capitalize" }}>{pokemon?.name}</ThemedText>
                        </Row>
                </Pressable>
                        <ThemedText color="grayWhite" variant="subtitle2">#{params.id.padStart(3, "0" )}</ThemedText> 
            </Row>
            <View style={Styles.body} >
                <Image source={{uri: getPokemonArtwork(parseInt(params.id, 10))}} style={Styles.artwork}  width={200} height={200} />
                <Card style={Styles.card} >
                     <Row gap={8}>
                        {types.map(({type}) => <PokemonType key={type.name} name={type.name} />) }
                     </Row>
                     <ThemedText variant="subtitle1" style={{color: colorType}} >
                        About
                     </ThemedText>
                     <Row>
                        <PokemonSpec 
                            style={{
                                borderStyle: "solid",
                                borderRightWidth: 1,
                                borderColor: colors.grayLight,
                            }}
                            title={formatWeight(pokemon?.weight)} description="weight" image={require("@/assets/images/weight.png")}  />
                        <PokemonSpec 
                            style={{
                                borderStyle: "solid",
                                borderRightWidth: 1,
                                borderColor: colors.grayLight,
                            }}
                            title={formatHeight(pokemon?.height)} description="height" image={require("@/assets/images/height.png")} />
                        <PokemonSpec 
                            title={pokemon?.moves.slice(0,2).map(move => move.move.name).join("\n")} 
                            description="Moves" 
                        />
                     </Row>
                     <ThemedText variant="subtitle1" style={{color: colorType}} >
                        Base stats 
                     </ThemedText>
                </Card>
            </View>
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
        position: 'absolute',
        top: -140,
        zIndex: 2
    },
    body:{
        marginTop:144,
    },
    card:{
        backgroundColor: 'rgba(255,255,255,0.5)',
        paddingHorizontal:20,
        paddingTop:60,
        gap: 16,
        alignItems: 'center',
    }
})