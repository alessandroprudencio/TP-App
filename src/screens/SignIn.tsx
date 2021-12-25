import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, TextInput, useTheme } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { IAuth } from '../interfaces/auth.interface';
import { AuthScreenNavigationProp } from '../routes';
import api from '../services/api';

interface IError {
  email?: boolean;
  password?: boolean;
}

export default function SignInScreen() {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [isError, setIsError] = useState<IError>({} as IError);
  const [loading, setLoading] = useState<boolean>(false);
  const { navigate } = useNavigation<AuthScreenNavigationProp>();

  const { setToken, setUser } = useAuth();

  const { colors, roundness } = useTheme();

  useEffect(() => {
    if (email === '') setIsError((oldValue) => ({ ...oldValue, email: true }));

    if (password === '') setIsError((oldValue) => ({ ...oldValue, password: true }));

    // return () => {
    //   setPassword('');

    //   setIsError({});

    //   setLoading(false);
    // };
  }, [email, password]);

  const signIn = async () => {
    try {
      if (!email) setIsError((oldValue) => ({ ...oldValue, email: true }));
      if (!password) setIsError((oldValue) => ({ ...oldValue, password: true }));

      if (!email || !password) return;

      setLoading(true);

      const resp: IAuth = await (await api.post('/auth/login', { email, password })).data;

      const token = resp.jwtToken;

      const user = resp.user;

      await AsyncStorage.setItem('@token', token);

      await AsyncStorage.setItem('@user', JSON.stringify(user));

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(user);

      setToken(token);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const messages: any = error.response.data.error.message;

        let stringError = '';

        if (messages instanceof Array) messages.map((m: String) => (stringError += m + ' '));
        else stringError = messages;

        Alert.alert('Erro ao efetuar login', stringError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground style={styles.background} resizeMode="cover" source={require('../../src/assets/background.jpg')}>
      <View style={styles.container}>
        <Image style={styles.image} source={require('../../src/assets/logo-transparent.png')} />

        <Text style={styles.title}>Entrar</Text>

        <View style={styles.inputView}>
          <TextInput
            outlineColor={colors.grey}
            label="Email"
            value={email}
            autoCapitalize={'none'}
            error={isError.email}
            keyboardType="email-address"
            returnKeyType="previous"
            onChangeText={(text) => {
              setEmail(text);

              if (email === '') return setIsError((oldValue) => ({ ...oldValue, email: true }));

              setIsError((oldValue) => ({ ...oldValue, email: false }));
            }}
            mode="outlined"
            style={styles.input}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            outlineColor={colors.grey}
            label="Senha"
            value={password}
            error={isError.password}
            secureTextEntry={true}
            returnKeyType="send"
            onSubmitEditing={() => signIn()}
            onChangeText={(text) => {
              setPassword(text);

              if (password === '') return setIsError((oldValue) => ({ ...oldValue, password: true }));

              setIsError((oldValue) => ({ ...oldValue, password: false }));
            }}
            mode="outlined"
            style={styles.input}
          />
        </View>

        <TouchableOpacity>
          <Text style={styles.forgotButton}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: colors.grey2 }}>Não tem uma conta ?</Text>

          <TouchableOpacity onPress={() => navigate('SignUp')} style={styles.signUpText}>
            <Text style={styles.signUpText}>Cadastrar-se</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          disabled={isError.email || isError.password}
          onPress={() => signIn()}
          style={[styles.loginBtn, { backgroundColor: colors.primary, borderRadius: roundness }]}
        >
          {loading ? (
            <ActivityIndicator color={'#fff'} animating={true} />
          ) : (
            <Text style={styles.loginText}>ENTRAR</Text>
          )}
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  background: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
  },

  image: {
    marginBottom: 20,
    width: 250,
    height: 250,
  },

  inputView: {
    // backgroundColor: '#FFC0CB',
    width: '85%',
    // height: 45,
    // marginBottom: 20,
  },

  input: {
    borderRadius: 30,
    borderColor: '#ccc',
    marginBottom: 20,
    backgroundColor: '#fff',
    height: 50,
  },

  title: {
    fontWeight: 'bold',
    fontSize: 26,
    marginBottom: 20,
    color: 'white',
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

  forgotButton: {
    height: 30,
    color: 'white',
    fontWeight: '500',
    marginBottom: 30,
  },

  signUpText: {
    height: 30,
    fontWeight: '500',
    marginBottom: 30,
    color: 'white',
  },

  loginBtn: {
    width: '85%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
});
