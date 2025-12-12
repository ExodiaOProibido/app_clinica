// src/screens/Medico/CadastroEdicaoMedicoScreen.js
import React from "react";
import MedicoForm from "../../components/MedicoForm";
import { View } from "react-native";

const CadastroEdicaoMedicoScreen = ({ route, navigation, onSave }) => {
  // A prop 'medico' virá via route.params
  const { medico } = route.params || {}; // A prop 'onSave' virá diretamente do App.js (via MedicoFormScreen wrapper) // O MedicoForm chama o onSave desta tela, que por sua vez chama o handleSaveMedico do App.js

  const handleSave = (novoDadosMedico) => {
    onSave(novoDadosMedico); // O restante do fluxo (Alert.alert e navigation.goBack) está dentro do MedicoForm.js
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <MedicoForm
        medico={medico}
        onSave={handleSave} // Passa o handler que executa o onSave do App.js
        onCancel={handleCancel}
        navigation={navigation}
      />
    </View>
  );
};

export default CadastroEdicaoMedicoScreen;
