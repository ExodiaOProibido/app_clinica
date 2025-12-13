import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Logo = require('../../../assets/logo.png')

const Splash = ({ navigation }) => {
  useEffect(() => {
    // Simula o carregamento de recursos ou APIs
    setTimeout(() => {
      // Transiciona para a tela principal/menu
      navigation.replace('Menu');
    }, 3000); // 3 segundos
  }, []);

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={Logo} />
      <Text>Carregando...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    fontSize: 16, 
    fontWeight: 'bold', 
  },
  logo: {

    width: '70%', 
    height: '70%',
    resizeMode: 'contain'   
  },
});
export default Splash;