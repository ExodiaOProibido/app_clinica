// src/screens/Medico/CadastroEdicaoMedicoScreen.js
import React from "react";
import MedicoForm from "../../components/MedicoForm";
import { View } from "react-native";

const CadastroEdicaoMedicoScreen = ({ route, navigation, onSave }) => {
  // A prop 'medico' virá via route.params
  const { medico } = route.params || {}; 
  const handleSave = (novoDadosMedico) => {
    onSave(novoDadosMedico); 
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <MedicoForm
        medico={medico}
        onSave={handleSave} 
        onCancel={handleCancel}
        navigation={navigation}
      />
    </View>
  );
};

export default CadastroEdicaoMedicoScreen;
