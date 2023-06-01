import { View, Text, StyleSheet} from 'react-native'
import React from 'react'

export default function Tarjeta( prop ) {
    console.log(prop)
  return (
    <View>
      <Text style={styles.txtItem}>Titulo: {prop.datos.titulo}</Text>
      <Text style={styles.txtItem}>Mensaje: {prop.datos.mensaje} </Text>
    </View>
  )
}

const styles= StyleSheet.create({
    txtItem:{
        fontSize:18
    }
})