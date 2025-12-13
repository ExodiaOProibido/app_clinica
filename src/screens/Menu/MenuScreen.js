// src/screens/MenuScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
// Componente importado (BotaoMenu, de acordo com o princípio de componentes)
import BotaoMenu from '../../components/BotaoMenu'; 

const Logo = require('../../../assets/logo.png')

const IconeMedic = require('../../../assets/usuario-md.png')
const IconePaciente = require('../../../assets/utilizador.png')
const IconeConsulta = require('../../../assets/calendario.png')

const MenuScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      
      <Image style={styles.logo} source={Logo} />
      <Text style={styles.header}>Gerenciando sua Clínica</Text>
      <View style={styles.btns}>
        <Text>Escolha qual seção deseja iniciar.</Text>
        <BotaoMenu
          icone={IconeMedic}
          titulo="Médico(a)s" 
          onPress={() => navigation.navigate('Medicos')}
        />
     
        <BotaoMenu
          icone={IconePaciente} 
          titulo="Pacientes" 
          onPress={() => navigation.navigate('Pacientes')}
        />
    
      
        <BotaoMenu 
          icone={IconeConsulta}
          titulo="Consultas" 
          onPress={() => navigation.navigate('Consultas')}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {flex:1,flexDirection: 'column', 
    justifyContent: 'flex-start', 
    padding: 20, 
    backgroundColor: '#fff'},
  logo: {

    width:'50%',

    height: 100, 
    resizeMode: 'contain',
    alignSelf: 'left', 
    marginBottom: 1, 
  },
  header: { fontSize: 12, textAlign: 'left', fontWeight:'bold' },
  btns : {marginTop:60, flex:1}
});

export default MenuScreen;