import { StyleSheet, Text, View  } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Card } from "@/components/Card";
import { Image } from "react-native";
export default function Index() {
  const colors = useThemeColors()
  return (
    <SafeAreaView style={[Styles.container,{ backgroundColor: colors.tint }]} >
      <View style={Styles.header}>
        <Image source={require('@/assets/images/pokeball.png')} width={24} height={24} />
        <ThemedText variant="headline" color="grayLight">Pokemon</ThemedText>
      </View>
      <Card style={Styles.body}></Card>
    </SafeAreaView>
  );
}
const pokeid = 3;
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
  }
})  