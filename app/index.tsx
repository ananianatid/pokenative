import { StyleSheet, Text, View  } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Card } from "@/components/Card";
export default function Index() {
  const colors = useThemeColors()
  return (
    <SafeAreaView style={[Styles.container,{ backgroundColor: colors.tint }]} >
      <Card>
        <ThemedText variant="headline" color="grayDark">Pokemon</ThemedText>
      </Card>
      {/* <Link href="/about">A propos</Link> */}
      {/* <Link href={{pathname:'/pokemon/[id]',params:{id: pokeid}}}>Pokemon {pokeid}</Link> */}
    </SafeAreaView>
  );
}
const pokeid = 3;
const Styles = StyleSheet.create({
  container: {
    flex:1 
  }
})  