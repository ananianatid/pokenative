import { StyleSheet, Text, View  } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Index() {
  return (

    <SafeAreaView style={ Styles.container} >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href="/about">A propos</Link>
      <Link href={{pathname:'/pokemon/[id]',params:{id: pokeid}}}>Pokemon {pokeid}</Link>
    </SafeAreaView>
  );
}
const pokeid = 3;
const Styles = StyleSheet.create({
  container: {backgroundColor: '#FF0000', padding: 24}
})  