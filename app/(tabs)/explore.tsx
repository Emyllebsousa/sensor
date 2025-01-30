import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";
import { LightSensor } from "expo-sensors";
import Animated, { Easing, withRepeat, withTiming, useSharedValue, useAnimatedStyle } from "react-native-reanimated";

export default function About() {
  const [lightLevel, setLightLevel] = useState<number | null>(null);

  const starPosition = useSharedValue(0);

  useEffect(() => {
    let subscription: { remove: any; };

    if (LightSensor) {
      subscription = LightSensor.addListener((data) => {
        setLightLevel(data.illuminance);
      });
    } else {
      console.error("Sensor de luz não disponível nesta plataforma.");
    }

    starPosition.value = withRepeat(
      withTiming(1, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
      true
    );

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const animatedStarStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withRepeat(
            withTiming(starPosition.value * 200, {
              duration: 2000,
              easing: Easing.linear,
            }),
            -1,
            true
          ),
        },
      ],
    };
  });

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      alert("Não foi possível abrir o link.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Animação de fundo com estrelas */}
      <View style={styles.starsContainer}>
        {[...Array(50)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.star,
              animatedStarStyle,
              { left: Math.random() * 100 + "%", top: Math.random() * 100 + "%" },
            ]}
          />
        ))}
      </View>

      <View style={styles.content}>
  <Text style={styles.title}>🌙 Sobre o Aplicativo</Text>
  <Text style={styles.text}>
  O universo sempre nos fascinou com seus mistérios, e a lua, em especial, nos guia noite após noite com suas fases
    cíclicas. Este aplicativo traz essa magia para a palma da sua mão! 
  </Text>
  <Text style={styles.text}>
    Utilizando o sensor de luz do seu dispositivo, simulamos as diferentes fases da lua com base na iluminação do 
    ambiente. Assim, você pode acompanhar as mudanças de um jeito interativo e inovador. 
  </Text>

  <Text style={styles.sectionTitle}>👨‍💻 Desenvolvedores</Text>
  <Text style={styles.text}>Este projeto foi desenvolvido por:</Text>
  <Text style={styles.text}>🚀 Êmylle Beatriz & João Fernandes</Text>

  <Text style={styles.sectionTitle}>📌 Versão</Text>
  <Text style={styles.text}>1.0.0</Text>

  <Text style={styles.sectionTitle}>🔗 Links Úteis</Text>
  <TouchableOpacity onPress={() => openLink("https://github.com/Emyllebsousa")}>
    <Text style={styles.link}>🌟 Repositório no GitHub - Êmylle</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => openLink("https://github.com/billiezinha")}>
    <Text style={styles.link}>🌟 Repositório no GitHub - João</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => openLink("https://expo.dev/")}>
    <Text style={styles.link}>📖 Saiba mais sobre o Expo</Text>
  </TouchableOpacity>
</View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  starsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  star: {
    position: "absolute",
    backgroundColor: "white",
    width: 3,
    height: 3,
    borderRadius: 2,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 12,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 16,
    marginBottom: 8,
  },
  link: {
    fontSize: 16,
    color: "#fff",
    textDecorationLine: "underline",
    marginBottom: 8,
  },
});
