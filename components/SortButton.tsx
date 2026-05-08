import { ActivityIndicator, Text, View, StyleSheet, Pressable, Modal } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Image } from "expo-image";
import { useState } from "react";
import { ThemedText } from "./ThemedText";
import { Card } from "./Card";
import { Row } from "./Row";
import { Radio } from "./Radio";
type Props =  {
    value: "id" | "name",
    onChange: (v : "id" | "name") => void
}
const onButtonPress = () => {
    
}
const options = [
    {label:"Number", value: "id"},
    {label:"Name", value: "name"}
] as const
export function SortButton({value, onChange}: Props){
    const colors = useThemeColors()
    const [isModalVisible, setModalVIsibility] = useState(false)
    const onButtonPress = () => {
        setModalVIsibility(true)
    }
    const onClose = () => {
        setModalVIsibility(false)

    }
    return <>
        <Pressable onPress={onButtonPress}>
            <View style={[styles.button,{backgroundColor: colors.grayWhite}]} >
                <Image source={
                value === "id" 
                    ? require('@/assets/images/id.png') 
                    : require('@/assets/images/name.png')
                } 
                style={{width: 16, height: 16}} 
                />
            </View>
        </Pressable>
        <Modal 
            transparent
            visible={isModalVisible} onRequestClose={onClose}
            animationType="fade">
            <Pressable style={styles.backdrop} onPress={onClose} />
            <View style={[styles.popup,{backgroundColor: colors.tint}]}>
                <ThemedText style={styles.title} variant="subtitle2" color="grayWhite">
                    Sort by : 
                </ThemedText>
                <Card style={styles.card}>
                     {options.map(o => 
                        <Pressable key={o.value} onPress={() => onChange(o.value)}>
                            <Row key={o.value} gap={8}>
                                <Radio checked={value === o.value}  />
                                <ThemedText>{o.label}</ThemedText>
                            </Row>
                        </Pressable>
                    )}
                </Card>
            </View>
        </Modal>
    </>
}

const styles = StyleSheet.create({
    button: {
        width: 32,
        height: 32,
        borderRadius: 32,
        flex: 0 ,
        alignItems: 'center',
        justifyContent: 'center'
    },
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)"
    },
    popup:{
        padding:4,
        paddingTop: 16,
        gap:16,
        borderRadius:12
    },
    title: {
        paddingLeft:20
    },
    card: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        gap: 16 
    }
}) 