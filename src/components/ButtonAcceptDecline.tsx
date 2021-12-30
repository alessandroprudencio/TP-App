import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { useChallenge } from '../context/ChallengeContext';
import DialogAcceptChallenge from './DialogAcceptChallenge';

export default function ButtonAcceptDecline({ challengeId }: { challengeId: string }) {
  const [fadeAnimation] = useState(new Animated.Value(0));

  const { setIsRefreshChallenges } = useChallenge();

  const [duration] = useState(500);

  const { colors } = useTheme();

  const showDialog = async () => {
    console.log('entrou show dialog');

    const isAccept = await DialogAcceptChallenge(challengeId);

    if (isAccept) {
      setIsRefreshChallenges(true);
    }
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnimation, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Animated.View style={{ opacity: fadeAnimation }}>
          <IconButton
            icon="check"
            size={30}
            color={colors.primary}
            style={{
              backgroundColor: 'white',
            }}
            onPress={() => showDialog()}
          />
        </Animated.View>
      </View>
      <View style={{ flex: 1 }}>
        <IconButton
          icon="close"
          color="red"
          style={{ backgroundColor: 'white' }}
          size={30}
          onPress={() => console.log('Pressed')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 110,
    flexDirection: 'row',
  },
});
