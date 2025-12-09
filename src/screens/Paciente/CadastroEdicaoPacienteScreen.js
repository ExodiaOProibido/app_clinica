// src/screens/Paciente/CadastroEdicaoPacienteScreen.js

import React from "react";
import PacienteForm from "../../components/PacienteForm"; // 🎯 Ajuste o caminho e importe o componente PacienteForm
import { View } from "react-native";

/**
 * Tela de Cadastro/Edição de Paciente.
 * Reutiliza a estrutura do MedicoScreen, mas usa o PacienteForm.
 */
const CadastroEdicaoPacienteScreen = ({ route, navigation }) => {
  // A prop 'paciente' virá via route.params
  const { paciente } = route.params || {}; // 🎯 Alterado de 'medico' para 'paciente'

  const handleSave = (novosDadosPaciente) => {
    // ⚠️ ATENÇÃO: Aqui você deve implementar a lógica real de API/Estado
    // para salvar ou editar os dados do paciente.
    console.log(
      "Dados do paciente a serem salvos/editados:",
      novosDadosPaciente
    );

    // O retorno (navigation.goBack()) já é tratado dentro do PacienteForm
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <PacienteForm
        // 🎯 Passa o objeto paciente (ou undefined/null se for novo cadastro)
        paciente={paciente}
        onSave={handleSave}
        onCancel={handleCancel}
        navigation={navigation}
      />
    </View>
  );
};

export default CadastroEdicaoPacienteScreen;
