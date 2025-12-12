// src/screens/Paciente/CadastroEdicaoPacienteScreen.js
import React from "react";
// ⚠️ ATENÇÃO: Verifique se o caminho e o nome do seu componente de formulário de paciente estão corretos
import PacienteForm from "../../components/PacienteForm";
import { View } from "react-native";

// Este componente recebe 'onSave' como prop injetada pelo App.js
const CadastroEdicaoPacienteScreen = ({ route, navigation, onSave }) => {
  // A prop 'paciente' virá via route.params
  const { paciente } = route.params || {}; 

  const handleSave = (novoDadosPaciente) => {
    if (onSave) {
      onSave(novoDadosPaciente);
    } else {
      console.error("Função onSave não foi injetada corretamente.");
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <PacienteForm
        paciente={paciente}
        onSave={handleSave} 
        onCancel={handleCancel}
        navigation={navigation}
      />
    </View>
  );
};

export default CadastroEdicaoPacienteScreen;
