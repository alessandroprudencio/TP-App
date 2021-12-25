import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import { AuthStackParamList } from '../routes';

export default function SignInScreen() {
  const [visible, setVisible] = useState<boolean>(false);
  const [challenges, setChallenges] = useState<Array<any>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const { colors, roundness } = useTheme();

  const signIn = () => {
    console.log('email', email);
    console.log('password', password);
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../../src/assets/logo-transparent.png')} />

      <Text style={styles.title}>Cadastrar</Text>

      <View style={styles.inputView}>
        <TextInput
          outlineColor={colors.grey}
          label="Nome"
          returnKeyType="previous"
          onChangeText={(email) => setEmail(email)}
          mode="outlined"
          style={styles.input}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          outlineColor={colors.grey}
          label="Email"
          returnKeyType="previous"
          onChangeText={(password) => setPassword(password)}
          mode="outlined"
          style={styles.input}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          outlineColor={colors.grey}
          label="Celular"
          returnKeyType="previous"
          onChangeText={(password) => setPassword(password)}
          mode="outlined"
          style={styles.input}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          outlineColor={colors.grey}
          label="Senha"
          secureTextEntry={true}
          keyboardType={'visible-password'}
          returnKeyType="previous"
          onChangeText={(password) => setPassword(password)}
          mode="outlined"
          style={styles.input}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          outlineColor={colors.grey}
          label="Categoria"
          returnKeyType="previous"
          onChangeText={(password) => setPassword(password)}
          mode="outlined"
          style={styles.input}
        />
      </View>

      <View style={{ alignItems: 'center' }}>
        <Text style={{ color: colors.grey2 }}>Ja tem uma conta ?</Text>

        <TouchableOpacity onPress={() => navigation.navigate('SignIn')} style={styles.signUpText}>
          <Text style={styles.signUpText}>Entrar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => signIn}
        style={[styles.loginBtn, { backgroundColor: colors.primary, borderRadius: roundness }]}
      >
        <Text style={styles.loginText}>CADASTRAR</Text>
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
    // backgroundColor: '#FFC0CB',
    width: '85%',
    // height: 45,
    // marginBottom: 20,
  },

  title: {
    fontWeight: 'bold',
    fontSize: 26,
    marginBottom: 20,
  },

  input: {
    borderRadius: 30,
    borderColor: '#ccc',
    marginBottom: 20,
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

  forgotButton: {
    height: 30,
    fontWeight: '500',
    marginBottom: 30,
  },

  signUpText: {
    height: 30,
    fontWeight: '500',
    marginBottom: 30,
  },

  loginBtn: {
    width: '85%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
});
