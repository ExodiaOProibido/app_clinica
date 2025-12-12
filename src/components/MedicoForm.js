import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

// Lista de Especialidades para o Picker
const especialidades = [
  "Cardiologia",
  "Pediatria",
  "Dermatologia",
  "Ginecologia",
  "Neurologia",
  "Oftalmologia",
  "Clínica Geral",
];

const initialMedicoState = {
  nome: "",
  especialidade: especialidades[0],
  crm: "",
  email: "",
  telefone: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
  cep: "",
};

const ValidatedInput = ({
  label,
  name,
  formData,
  errors,
  handleChange,
  ...props
}) => (
  <View style={formStyles.inputGroup}>
    <Text style={formStyles.label}>{label}</Text>
    <TextInput
      style={[formStyles.input, errors[name] && formStyles.inputError]}
      value={formData[name]}
      onChangeText={(text) => handleChange(name, text)}
      {...props}
    />
    {errors[name] && <Text style={formStyles.errorText}>{errors[name]}</Text>}
  </View>
);

const MedicoForm = ({ medico, onSave, onCancel, navigation }) => {
  const [formData, setFormData] = useState(medico || initialMedicoState);
  const [errors, setErrors] = useState({});

  const isEditing = !!medico;
  const buttonTitle = isEditing ? "Concluir Edição" : "Concluir Cadastro";

  const requiredFields = [
    "nome",
    "especialidade",
    "crm",
    "email",
    "telefone",
    "logradouro",
    "numero",
    "bairro",
    "cidade",
    "uf",
    "cep",
  ];

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field] || String(formData[field]).trim() === "") {
        newErrors[field] = "Campo Obrigatório";
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData);
      Alert.alert(
        isEditing ? "Sucesso" : "Cadastro Concluído",
        isEditing
          ? "Dados do médico atualizados."
          : "Novo médico cadastrado com sucesso!"
      );
      navigation.goBack();
    } else {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          {isEditing ? "Editar Perfil Médico" : "Novo Cadastro Médico"}
        </Text>
        <Text style={styles.sectionHeader}>1. Profissional</Text>
        <ValidatedInput
          label="Nome Completo"
          name="nome"
          placeholder="Ex: Ana Maria da Silva"
          formData={formData}
          errors={errors}
          handleChange={handleChange}
        />
        <View style={formStyles.inputGroup}>
          <Text style={formStyles.label}>Especialidade</Text>
          <View
            style={[
              formStyles.pickerWrapper,
              errors.especialidade && formStyles.inputError,
            ]}
          >
            <Picker
              selectedValue={formData.especialidade}
              onValueChange={(itemValue) =>
                handleChange("especialidade", itemValue)
              }
              style={formStyles.picker}
            >
              {especialidades.map((esp) => (
                <Picker.Item key={esp} label={esp} value={esp} />
              ))}
            </Picker>
          </View>
          {errors.especialidade && (
            <Text style={formStyles.errorText}>{errors.especialidade}</Text>
          )}
        </View>
        <ValidatedInput
          label="CRM"
          name="crm"
          placeholder="Ex: 12345/MG"
          formData={formData}
          errors={errors}
          handleChange={handleChange}
        />
        <Text style={styles.sectionHeader}>2. Contatos</Text>
        <ValidatedInput
          label="Email"
          name="email"
          placeholder="email@exemplo.com"
          keyboardType="email-address"
          formData={formData}
          errors={errors}
          handleChange={handleChange}
        />
        <ValidatedInput
          label="Telefone Celular"
          name="telefone"
          placeholder="(XX) XXXXX-XXXX"
          keyboardType="phone-pad"
          formData={formData}
          errors={errors}
          handleChange={handleChange}
        />
        <Text style={styles.sectionHeader}>3. Endereço Profissional</Text>
        <ValidatedInput
          label="Logradouro"
          name="logradouro"
          placeholder="Ex: Rua das Flores"
          formData={formData}
          errors={errors}
          handleChange={handleChange}
        />
        <View style={formStyles.row}>
          <ValidatedInput
            label="Número"
            name="numero"
            placeholder="Nº"
            keyboardType="numeric"
            style={formStyles.inputHalf}
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />
          <ValidatedInput
            label="Complemento"
            name="complemento"
            placeholder="Apto/Sala (Opcional)"
            style={formStyles.inputHalf}
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />
        </View>
        <ValidatedInput
          label="Bairro"
          name="bairro"
          placeholder="Ex: Savassi"
          formData={formData}
          errors={errors}
          handleChange={handleChange}
        />
        <ValidatedInput
          label="Cidade"
          name="cidade"
          placeholder="Ex: Belo Horizonte"
          formData={formData} 
          errors={errors}
          handleChange={handleChange}
        />
        <View style={formStyles.row}>
          <ValidatedInput
            label="UF"
            name="uf"
            placeholder="Ex: MG"
            maxLength={2}
            style={formStyles.inputQuarter}
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />
          <ValidatedInput
            label="CEP"
            name="cep"
            placeholder="XXXXX-XXX"
            keyboardType="numeric"
            maxLength={9}
            style={formStyles.inputThreeQuarter}
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[formStyles.button, formStyles.saveButton]}
          onPress={handleSubmit}
        >
          <Text style={formStyles.buttonText}>{buttonTitle}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[formStyles.button, formStyles.cancelButton]}
          onPress={onCancel || (() => navigation.goBack())}
        >
          <Text style={formStyles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const formStyles = StyleSheet.create({
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "500",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    height: 45,
  },
  inputError: {
    borderColor: "red",
    borderWidth: 2,
    backgroundColor: "#ffe8e8",
  },
  errorText: {
    fontSize: 12,
    color: "red",
    marginTop: 4,
    alignSelf: "flex-start",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  inputHalf: {
    flex: 1,
  },
  inputQuarter: {
    flex: 0.3,
  },
  inputThreeQuarter: {
    flex: 0.7,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    height: 45,
    overflow: "hidden",
  },
  picker: {
    height: Platform.OS === "ios" ? undefined : 45,
    width: "100%",
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#007AFF",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default MedicoForm;
