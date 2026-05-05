import {FlatList, StyleSheet, Text, View  } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Card } from "@/components/Card";
import { Image } from "react-native";
import { PokemonCard } from "@/components/pokemon/pokemonCard";
export default function Index() {
  const colors = useThemeColors()
  const pokemons = Array.from({ length: 35 }, (_, k) => ({
    name: `Pokemon ${k + 1}`,
     id: k + 1
  }));
  return (
    <SafeAreaView style={[Styles.container,{ backgroundColor: colors.tint }]} >
      <View style={Styles.header}>
        <Image source={require('@/assets/images/pokeball.png')} width={24} height={24} />
        <ThemedText variant="headline" color="grayLight">Pokemon</ThemedText>
      </View>
      <Card style={Styles.body}>
        <FlatList 
        data={pokemons} 
        numColumns={3}
        contentContainerStyle={[Styles.gridGap, Styles.list]}
        columnWrapperStyle={Styles.gridGap}
        renderItem={({item})=>
          <PokemonCard id={item.id} name={item.name} style={{flex:1/3}}/>
        } keyExtractor={(item) => item.id.toString()} ></FlatList>
      </Card>
    </SafeAreaView>
  );
}
const Styles = StyleSheet.create({
  container: {
    flex:1 ,
    padding: 4
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 12
  },
  body: {
    flex: 1,
  },
  gridGap:{
    gap: 8
  },
  list: {
    padding: 12,
  }
})  