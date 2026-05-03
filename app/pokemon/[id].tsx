import { useLocalSearchParams } from "expo-router"
import { Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
export default function Pokemon() {
    const params = useLocalSearchParams()
    return <SafeAreaView>
        <Text>Pokemon {params.id}</Text>
    </SafeAreaView>
}