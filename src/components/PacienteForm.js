import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Platform,
} from 'react-native';

// Importa o componente Picker se você precisar, mas para PacienteForm não é necessário,
// então vamos remover para simplificar, já que você não listou campos de seleção para paciente.
// import { Picker } from 'react-native'; 

// 🎯 Paciente: Nome, Email, Telefone, CPF, Endereço completo (logradouro, número, complemento, bairro, cidade, UF e CEP)
const initialPacienteState = {
  nome: '',
  email: '',
  telefone: '',
  cpf: '', // NOVO CAMPO
  // Campos de Endereço
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '', // NOVO CAMPO para endereço completo
  cidade: '',
  uf: '',
  cep: '',
};

/**
 * Componente PacienteForm para Cadastro ou Edição.
 * Adaptação do MedicoForm.
 * @param {object} props.paciente - Objeto do paciente para edição, ou null para cadastro.
 * @param {function} props.onSave - Função chamada ao concluir com sucesso.
 * @param {function} props.onCancel - Função chamada ao cancelar.
 * @param {object} props.navigation - Objeto de navegação.
 */
const PacienteForm = ({ paciente, onSave, onCancel, navigation }) => {
  // 1. Inicializa o estado com base na prop 'paciente'
  const [formData, setFormData] = useState(paciente || initialPacienteState);
  
  // 2. Estado para rastrear erros de validação
  const [errors, setErrors] = useState({});

  // 3. Define o título do botão e o modo do formulário
  const isEditing = !!paciente;
  const buttonTitle = isEditing ? 'Concluir Edição' : 'Concluir Cadastro';

  // Note que 'complemento' é frequentemente opcional, mas 'bairro' é essencial.
  const requiredFields = [
    'nome', 'cpf', 'email', 'telefone', 
    'logradouro', 'numero', 'bairro', 'cidade', 'uf', 'cep'
  ];

  // Atualiza o formData quando o prop 'paciente' muda
  useEffect(() => {
    setFormData(paciente || initialPacienteState);
  }, [paciente]);

  // Função genérica para atualizar o estado do formulário
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Remove o erro assim que o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Função de Validação (Mantida do MedicoForm)
  const validate = () => {
    let valid = true;
    const newErrors = {};

    requiredFields.forEach(field => {
      if (!formData[field] || String(formData[field]).trim() === '') {
        newErrors[field] = 'Campo Obrigatório';
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  // Função de submissão do formulário (Mantida do MedicoForm)
  const handleSubmit = () => {
    if (validate()) {
      // Supondo que a função onSave lida com a lógica de API/Estado
      onSave(formData); 
      Alert.alert(
        isEditing ? 'Sucesso' : 'Cadastro Concluído', 
        isEditing ? 'Dados do paciente atualizados.' : 'Novo paciente cadastrado com sucesso!'
      );
      // navigation.goBack(); // Descomente se você estiver usando navegação de tela
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
    }
  };
  
  // =========================================================================
  // SUB-COMPONENTE: INPUT COM VALIDAÇÃO (Mantido)
  // =========================================================================
  const ValidatedInput = ({ label, name, ...props }) => (
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.title}>{isEditing ? 'Editar Paciente' : 'Novo Paciente'}</Text>

        {/* ====================================
            1. DADOS PESSOAIS
            ==================================== */}
        <Text style={styles.sectionHeader}>1. Dados Pessoais</Text>
        <ValidatedInput 
          label="Nome Completo" 
          name="nome" 
          placeholder="Ex: João da Silva" 
        />
        <ValidatedInput 
          label="CPF" 
          name="cpf" 
          placeholder="XXX.XXX.XXX-XX" 
          keyboardType="numeric"
          maxLength={14}
        />
        
        {/* ====================================
            2. CONTATOS
            ==================================== */}
        <Text style={styles.sectionHeader}>2. Contatos</Text>
        <ValidatedInput 
          label="Email" 
          name="email" 
          placeholder="email@exemplo.com" 
          keyboardType="email-address"
        />
        <ValidatedInput 
          label="Telefone Celular" 
          name="telefone" 
          placeholder="(XX) XXXXX-XXXX" 
          keyboardType="phone-pad"
        />

        {/* ====================================
            3. ENDEREÇO COMPLETO
            ==================================== */}
        <Text style={styles.sectionHeader}>3. Endereço Residencial</Text>
        
        <ValidatedInput 
          label="CEP" 
          name="cep" 
          placeholder="XXXXX-XXX" 
          keyboardType="numeric"
          maxLength={9}
        />

        <ValidatedInput 
          label="Logradouro" 
          name="logradouro" 
          placeholder="Ex: Rua das Flores" 
        />

        <View style={formStyles.row}>
          <ValidatedInput 
            label="Número" 
            name="numero" 
            placeholder="Nº" 
            keyboardType="numeric"
            style={formStyles.inputQuarter} // Menor
          />
          <ValidatedInput 
            label="Complemento" 
            name="complemento" 
            placeholder="Apto/Casa (Opcional)"
            style={formStyles.inputThreeQuarter} // Maior, mas não obrigatório
            // Nota: Você pode remover o 'complemento' do 'requiredFields' se ele for opcional
          />
        </View>

        <ValidatedInput 
          label="Bairro" 
          name="bairro" 
          placeholder="Ex: Centro" 
        />

        <View style={formStyles.row}>
          <ValidatedInput 
            label="Cidade" 
            name="cidade" 
            placeholder="Ex: Belo Horizonte" 
            style={formStyles.inputThreeQuarter}
          />
          <ValidatedInput 
            label="UF" 
            name="uf" 
            placeholder="UF" 
            maxLength={2}
            style={formStyles.inputQuarter}
          />
        </View>

      </ScrollView>

      {/* BOTÕES FIXOS NA PARTE INFERIOR (Mantido) */}
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

// =========================================================================
// ESTILOS (Mantidos do MedicoForm)
// =========================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Espaço para os botões fixos
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#007AFF', // Cor de destaque
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const formStyles = StyleSheet.create({
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    height: 45,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 2,
    backgroundColor: '#ffe8e8',
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10, // Espaçamento entre os campos na linha
  },
  inputHalf: {
    flex: 1, // Ocupa metade do espaço
  },
  inputQuarter: {
    flex: 0.3, // Ocupa cerca de 30%
  },
  inputThreeQuarter: {
    flex: 0.7, // Ocupa o restante
  },
  // Estilos dos Botões de Ação
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: '#007AFF', // Azul primário
  },
  cancelButton: {
    backgroundColor: '#6c757d', // Cinza
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PacienteForm;