import { StyleSheet, Text, View,  } from "react-native";
import { Link } from "expo-router";
export default function Index() {
  return (
    <View style={ Styles.container} >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href="/about">A propos</Link>
    </View>
  );
}
const Styles = StyleSheet.create({
  container: {backgroundColor: '#FF0000', padding: 24}
}) 