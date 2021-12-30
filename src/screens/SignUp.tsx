import { NavigationProp, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { createRef, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TextInputMask } from 'react-native-masked-text';
import { Caption, Dialog, Portal, RadioButton, TextInput, Title, useTheme } from 'react-native-paper';
import { ICategory } from '../interfaces/category.interface';
import { AuthStackParamList } from '../routes';
import api from '../services/api';

interface IError {
  email?: boolean;
  password?: boolean;
  phoneNumber?: boolean;
  name?: boolean;
  category?: boolean;
}
interface IRegister {
  email: string;
  password: string;
  phoneNumber: string;
  name: string;
  category: string;
}

export default function SignInScreen() {
  const [register, setRegister] = useState<IRegister>({} as IRegister);
  const [isError, setIsError] = useState<IError>({} as IError);
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();

  const { colors, roundness } = useTheme();

  const [showDropDown, setShowDropDown] = useState(false);

  const registerRef = createRef<TextInputMask>();

  useEffect(() => {
    getCategories();

    return () => setCategories([]);
  }, []);

  const signUp = async () => {
    try {
      const { email, password, phoneNumber, name, category } = register;

      if (!email) setIsError((oldValue) => ({ ...oldValue, email: true }));
      if (!password) setIsError((oldValue) => ({ ...oldValue, password: true }));
      if (!phoneNumber) setIsError((oldValue) => ({ ...oldValue, phoneNumber: true }));
      if (!name) setIsError((oldValue) => ({ ...oldValue, name: true }));
      if (!category) setIsError((oldValue) => ({ ...oldValue, category: true }));

      if (!email || !password || !phoneNumber || !name || !category) return;

      setLoading(true);

      const formattedPhoneNumber = phoneNumber.replace(/[^\d+]/g, '');

      await api.post('/auth/register', { ...register, phoneNumber: formattedPhoneNumber });

      Alert.alert(
        'Sucesso!',
        'Foi enviado um link no seu email para confirmação, acesse e volte aqui para fazer login',
        [
          {
            text: 'Fazer login',
            onPress: async () => {
              navigate('SignIn');
            },
          },
        ],
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const messages: any = error.response.data.error.message;

        let stringError = '';

        if (messages instanceof Array) messages.map((m: String) => (stringError += m + ' '));
        else stringError = messages;

        Alert.alert('Erro ao efetuar cadastro', stringError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangeText = (value: any, fieldName: string) => {
    setRegister((oldValue: IRegister) => ({ ...oldValue, [fieldName]: value }));

    if (value === '') return setIsError((oldValue) => ({ ...oldValue, [fieldName]: true }));

    setIsError((oldValue) => ({ ...oldValue, [fieldName]: false }));
  };

  const getCategories = async () => {
    try {
      const categories: ICategory[] = await (await api.get('/categories')).data;

      setCategories(categories);
    } catch (error) {
      if (error instanceof Error) Alert.alert('Erro ao listar categorias', error.message);
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((item) => item._id === categoryId)?.name;
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../../src/assets/logo.png')} />

      <Title>Cadastrar</Title>

      <ScrollView
        style={{ width: '100%', maxHeight: Platform.OS === 'android' ? 420 : '36%' }}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        <View style={styles.inputView}>
          <TextInput
            outlineColor={colors.grey}
            label="Nome"
            value={register.name}
            error={isError.name}
            onChangeText={(value) => handleChangeText(value, 'name')}
            mode="outlined"
            style={styles.input}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            outlineColor={colors.grey}
            label="Email"
            value={register.email}
            autoCapitalize={'none'}
            error={isError.email}
            keyboardType="email-address"
            onChangeText={(text) => handleChangeText(text, 'email')}
            mode="outlined"
            style={styles.input}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            outlineColor={colors.grey}
            label="Celular"
            error={isError.phoneNumber}
            value={register.phoneNumber}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            render={(props) => (
              <TextInputMask
                {...props}
                value={register.phoneNumber}
                type={'custom'}
                options={{
                  mask: '+99 (99) 99999-9999',
                }}
                onChangeText={(value) => {
                  props.onChangeText?.(value);
                  handleChangeText(value, 'phoneNumber');
                }}
                ref={registerRef}
              />
            )}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            outlineColor={colors.grey}
            label="Senha"
            value={register.password}
            error={isError.password}
            secureTextEntry={true}
            onChangeText={(text) => handleChangeText(text, 'password')}
            mode="outlined"
            style={styles.input}
          />
        </View>

        {/* Dropdown */}
        <View style={styles.inputView}>
          <TextInput
            onFocus={() => {
              Keyboard.dismiss();
              setShowDropDown(true);
            }}
            outlineColor={colors.grey}
            label="Categoria"
            value={register.category ? getCategoryName(register.category) : ''}
            error={isError.category}
            // onChangeText={(value) => handleChangeText(value, 'category')}
            mode="outlined"
            style={styles.input}
          />

          <Portal>
            <Dialog visible={showDropDown} onDismiss={() => setShowDropDown(false)}>
              <Dialog.Title>Selecione a categoria:</Dialog.Title>

              <Dialog.Content>
                <RadioButton.Group
                  onValueChange={(value) => {
                    setRegister((oldValue) => ({ ...oldValue, category: value }));
                    setShowDropDown(false);
                  }}
                  value={register.category}
                >
                  {categories.length ? (
                    categories.map((category) => (
                      <View style={{ alignItems: 'flex-start' }} key={category._id}>
                        <RadioButton.Item
                          // labelStyle={{ backgroundColor: '#ccc' }}
                          style={{
                            paddingLeft: 0,
                          }}
                          position="leading"
                          mode="android"
                          label={category.name}
                          value={category._id}
                        />
                        <Caption>{category.description}</Caption>
                      </View>
                    ))
                  ) : (
                    <Text>Nenhuma categoria cadastrada.</Text>
                  )}
                </RadioButton.Group>
              </Dialog.Content>
            </Dialog>
          </Portal>
        </View>
      </ScrollView>

      <View style={{ alignItems: 'center', marginTop: 0, paddingTop: 0 }}>
        <Text style={{ color: colors.grey2 }}>Ja tem uma conta ?</Text>

        <TouchableOpacity onPress={() => navigate('SignIn')} style={styles.signUpText}>
          <Text style={styles.signUpText}>Entrar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => signUp()}
        style={[styles.loginBtn, { backgroundColor: colors.primary, borderRadius: roundness }]}
      >
        {loading ? (
          <ActivityIndicator color={'#fff'} animating={true} />
        ) : (
          <Text style={styles.loginText}>CADASTRAR</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    marginBottom: 20,
    width: 250,
    height: 250,
  },

  inputView: {
    width: '85%',
  },

  input: {
    borderRadius: 30,
    borderColor: '#ccc',
    marginBottom: 10,
    backgroundColor: '#fff',
    height: 50,
  },

  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  textInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },

  signUpText: {
    height: 30,
    fontWeight: '500',
    // marginBottom: 30,
  },

  loginBtn: {
    width: '85%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    position: Platform.OS === 'ios' ? 'absolute' : 'relative',
    bottom: Platform.OS === 'ios' ? 20 : 10,
  },
});
