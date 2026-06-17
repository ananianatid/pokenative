import { useThemeColors } from "@/hooks/useThemeColors"
import { Image, StyleSheet, TextInput } from "react-native"
import { Row } from "./Row"
type Props = {
    value: string,
    onChange: (s: string) => void
}
export function SearchBar({ value, onChange }: Props) {
    const colors = useThemeColors()
    return <Row 
        style={[ styles.wrapper,{backgroundColor: colors.grayWhite }]} 
        gap={8}
        >
        <Image source={require('@/assets/images/search.png')} width={16} height={16} />
        <TextInput 
            style={styles.input} 
            onChangeText={onChange} 
            value={value}
            placeholder="Chercher Pokemon..."
            placeholderTextColor="#999999"
        />
    </Row>
}  

const styles = StyleSheet.create({
    wrapper:{
        flex:1,
        borderRadius:16,
        height: 50, 
        paddingHorizontal: 12
    },
    input: {
        flex:1,
        height: 42,
        fontSize: 10,
        lineHeight: 16,
    } 
})  