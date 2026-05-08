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
import { SortButton } from "@/components/SortButton";
import { RootView } from "@/components/RootView";
export default function Index() {
  const colors = useThemeColors()
  const {data, isFetching,fetchNextPage} = useInfiniteFetchQuery('/pokemon?limit=21');
  const [search,setsearch] = useState('')
  const [sortkey, setsortkey] = useState<"id" | "name">("id")  
  const pokemons = data?.pages.flatMap(page => page.results.map(r => ({name: r.name, id: getPokemonId(r.url)})))  ?? [] 
  const filteredPokemons = [...(search ? pokemons.filter(
    p => p.name.includes(search.toLowerCase()) || p.id.toString() === search) : pokemons)].sort(
      (a,b) => (a[sortkey] > b[sortkey]) ? 1 : -1  )

  return (
    <RootView >
      <Row style={Styles.header} gap={12}> 
        <Image source={require('@/assets/images/pokeball.png')} width={24} height={24} />
        <ThemedText variant="headline" color="grayLight">Pokemon</ThemedText>
      </Row>
      <Row gap={16} style={Styles.form} >
        <SearchBar value={search} onChange={setsearch}  />
        <SortButton value={sortkey} onChange={setsortkey} /> 
      </Row>
      <Card style={Styles.body}> 
        <FlatList 
        data={filteredPokemons } 
        numColumns={3}
        contentContainerStyle={[Styles.gridGap, Styles.list]}
        ListFooterComponent={
          isFetching ? <ActivityIndicator color={colors.tint} /> : null
        } 
        columnWrapperStyle={Styles.gridGap}
        onEndReached={search ? undefined :  ()=>fetchNextPage()}
        renderItem={({item})=>
          <PokemonCard id={item.id} name={item.name} style={{flex:1/3}}/>
        } keyExtractor={(item) => item.id.toString()} ></FlatList>
      </Card>
    </RootView>
  );
}
const Styles = StyleSheet.create({
  container: {
    flex:1 ,
    padding: 4, 
  },
  header: {
    paddingHorizontal: 12,
    paddingBottom: 8,
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
  form:{
    paddingHorizontal: 8,
  }
})  