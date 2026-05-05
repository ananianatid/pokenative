import { ActivityIndicator, FlatList, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/components/Card";
import { ThemedText } from "@/components/ThemedText";
import { PokemonCard } from "@/components/pokemon/pokemonCard";

import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { getPokemonId } from "@/functions/pokemon";
// import { ActivityIndicator } from "react-native-paper";
export default function Index() {
  const colors = useThemeColors()
  const {data, isFetching} = useFetchQuery('/pokemon?limit=21');
  const pokemons = data?.results ?? [];
  // const pokemons = Array.from({ length: 35 }, (_, k) => ({
  //   name: `Pokemon ${k + 1}`,
  //    id: k + 1
  // }));
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
        ListFooterComponent={
          isFetching ? <ActivityIndicator color={colors.tint} /> : null
        }
        columnWrapperStyle={Styles.gridGap}
        renderItem={({item})=>
          <PokemonCard id={getPokemonId(item.url)} name={item.name} style={{flex:1/3}}/>
        } keyExtractor={(item) => item.url} ></FlatList>
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