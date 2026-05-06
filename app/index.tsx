import { ActivityIndicator, FlatList, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/components/Card";
import { ThemedText } from "@/components/ThemedText";
import { PokemonCard } from "@/components/pokemon/pokemonCard";

import { useInfiniteFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { getPokemonId } from "@/functions/pokemon";
import { SearchBar } from "@/components/SearchBar";
import { useState } from "react";
import { Row } from "@/components/Row";
export default function Index() {
  const colors = useThemeColors()
  const {data, isFetching,fetchNextPage} = useInfiniteFetchQuery('/pokemon?limit=21');
  const pokemons = data?.pages.flatMap(page => page.results)  ?? []
  const [search,setsearch] = useState('')
  return (
    <SafeAreaView style={[Styles.container,{ backgroundColor: colors.tint }]} >
      <Row style={Styles.header} gap={12}> 
        <Image source={require('@/assets/images/pokeball.png')} width={24} height={24} />
        <ThemedText variant="headline" color="grayLight">Pokemon</ThemedText>
      </Row>
      <Row  >
        <SearchBar value={search} onChange={setsearch}  />
      </Row>
      <Card style={Styles.body}>
        <FlatList 
        data={pokemons} 
        numColumns={3}
        contentContainerStyle={[Styles.gridGap, Styles.list]}
        ListFooterComponent={
          isFetching ? <ActivityIndicator color={colors.tint} /> : null
        } 
        columnWrapperStyle={Styles.gridGap}
        onEndReached={()=>fetchNextPage()}
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
    padding: 4, 
  },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  body: {
    flex: 1,
    marginTop: 16,
  },
  gridGap:{
    gap: 8
  },
  list: {
    padding: 12,
  },
})  