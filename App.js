import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

import * as FileSystem from 'expo-file-system'

import Tarjeta from './components/Tarjeta';

export default function App() {

  const [titulo, settitulo] = useState('')
  const [mensaje, setmensaje] = useState('')
  const [tareas, settareas] = useState([])

  const [indiceEditar, setindiceEditar] = useState(-1)
  

  useEffect(() => {
    cargar()
  }, [])
  

  //Enviar
  function enviar(){
    if(titulo.trim() == '' || mensaje.trim()== ''){
      Alert.alert('Error', "Por favor llene todos los campos")
    }else{

      if (indiceEditar === -1){
        //Agregar un nuevo registro
        const nuevasTareas = [...tareas, {titulo, mensaje}]
        settareas(nuevasTareas)
      }else{
        //Editar un registro
        const nuevasTareas= [...tareas];
        nuevasTareas[indiceEditar]={ titulo, mensaje}
        settareas(nuevasTareas)
      }
      
    }

    settitulo('')
    setmensaje('')
    setindiceEditar(-1)

    guardar()
  }

  //Eliminar
  function eliminar( index ){
    Alert.alert("Eliminar Registro", "¿Desea eliminar este registro?", [
      {
        text: 'Cancelar'
      },
      {
        text: 'Eliminar',
        onPress:()=>{
          const nuevasTareas= tareas.filter(( item, i ) => i != index)
          settareas(nuevasTareas)
        }
      }
    ])
  }

  //Editar
  function editar(index){
      const tareaEditar = tareas[index];
      settitulo(tareaEditar.titulo)
      setmensaje(tareaEditar.mensaje)

      setindiceEditar(index)

  }

  //Guardar datos de manera interna
  const guardar= async() =>{
    try{
      const file = `${FileSystem.documentDirectory}datos.json`
      await FileSystem.writeAsStringAsync(file, JSON.stringify(tareas))
      console.log("Datos Guardados")
    } catch(error){
      console.log(error)
    }
  }

  //Cargar datos
  const cargar= async()=>{
    try{
      const file= `${FileSystem.documentDirectory}datos.json`
      const existe= FileSystem.getInfoAsync(file)

      if( existe.exists){
        const contenido= await FileSystem.readAsStringAsync(file)
        const datos= JSON.parse(contenido)
        settareas(datos)

        console.log("**********Datos cargados")
      }
    } catch(error){
      console.log(error)
    }
  }


  return (
    <View style={styles.container}>
      <TextInput
       placeholder='Título'
        style={styles.input}
        value={titulo}
        onChangeText={ (text)=> settitulo(text) }
      />
      <TextInput
        placeholder='Mensaje'
        style={styles.input}
        value={mensaje}
        onChangeText={ (text)=> setmensaje(text)}
        multiline
      />

      <Button title='Enviar' onPress={ enviar }/>

      <FlatList
        
        data={tareas}
        renderItem={ ( {item, index} ) =>
        <View style={styles.flatList} >
            <Tarjeta datos= {item}/>
            <View style={styles.btnF}>
             <Button title='Eliminar' color='red' onPress={ ()=> eliminar(index)}/>
             <Button title='Editar' color='green' onPress={ ()=> editar(index)} />

            </View>
            
        </View>
      }
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding:20
  },
  input:{
    height:'10%',
    borderColor:'gray',
    marginBottom:10,
    borderWidth:3,
    paddingHorizontal:10,
  },
  flatList:{
    backgroundColor:"#c9cfc7",
    marginVertical:10,
    padding:10
  },
  btnF:{
    flexDirection:'row',
    justifyContent:'space-between'

  }

});
