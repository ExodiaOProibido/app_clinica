import React, {useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//Importar componentes de tela
import Splash from './src/screens/Splash/Splash';
import MenuScreen from './src/screens/Menu/MenuScreen';

const Stack = createStackNavigator();

function App(){
  const [medicos, setMedicos] = useState([
    {'id':1, 'nome':'João da Silva',"especialidade":"Cardiologista",
      'crm':"12345/SP", "email":"joao@gmail.com", "telefone":"(12)9912-1234",
      'endereço':"Rua A, 30"},
    {'id':1, 'nome':'João da Silva',"especialidade":"Cardiologista",
      'crm':"12345/SP", "email":"joao@gmail.com", "telefone":"(12)9912-1234",
      'endereço':"Rua A, 30"},
    {'id':1, 'nome':'João da Silva',"especialidade":"Cardiologista",
      'crm':"12345/SP", "email":"joao@gmail.com", "telefone":"(12)9912-1234",
      'endereço':"Rua A, 30"},
  ]);
  const[pacientes, setPacientes] = useState([]);
  const[consultas, setConsultas] = useState([]);

  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Splash'>
        <Stack.Screen name="Splash" component= {Splash} options={{headerShown:false}}/>
        <Stack.Screen name="Menu" component= {MenuScreen} options={{title: 'Médicos'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;