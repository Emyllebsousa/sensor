import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import Svg, { Circle, ClipPath, Defs } from "react-native-svg";
import { LightSensor } from "expo-sensors";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function MoonPhasesWithInvertedLogic() {
  const [lightLevel, setLightLevel] = useState(0);
  const shadowOffset = useSharedValue(0);

  useEffect(() => {
    let subscription: { remove: any; };

    if (LightSensor) {
      subscription = LightSensor.addListener((data) => {
        setLightLevel(data.illuminance);
      });
    } else {
      console.warn("LightSensor não é suportado nesta plataforma.");
    }

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  useEffect(() => {
    let normalizedLight = Math.min(1, Math.max(0, lightLevel / 100));

    if (lightLevel <= 10) {
      // LUA TOTALMENTE ESCURA
      shadowOffset.value = withTiming(0, { duration: 500 });
    } else if (lightLevel >= 100) {
      // LUA CHEIA (SEM SOMBRA)
      shadowOffset.value = withTiming(100, { duration: 500 });
    } else {
      // FASES INTERMEDIÁRIAS
      shadowOffset.value = withTiming(normalizedLight * 100, { duration: 500 });
    }
  }, [lightLevel]);

  const animatedProps = useAnimatedProps(() => ({
    cx: width / 2 + shadowOffset.value,
    opacity: lightLevel <= 10 ? 1 : lightLevel >= 100 ? 0 : 1, // Oculta sombra quando for Lua Cheia
  }));

  return (
    <View style={styles.container}>
      {/* Fundo estrelado */}
      <Svg height={height} width={width} style={styles.background}>
        {[...Array(50)].map((_, i) => (
          <Circle
            key={i}
            cx={Math.random() * width}
            cy={Math.random() * height}
            r={Math.random() * 2}
            fill="white"
            opacity={Math.random()}
          />
        ))}
      </Svg>

      {/* Lua e Sombra */}
      <Svg height={height} width={width} style={styles.svg}>
        <Defs>
          {/* Máscara da Lua */}
          <ClipPath id="moonClip">
            <Circle cx={width / 2} cy={height / 3} r={80} />
          </ClipPath>
        </Defs>

        {/* Lua cheia (branca) */}
        <Circle cx={width / 2} cy={height / 3} r={80} fill="white" />

        {/* Sombra dinâmica */}
        <AnimatedCircle
          animatedProps={animatedProps}
          cy={height / 3}
          r={80}
          fill="black"
          clipPath="url(#moonClip)"
        />
      </Svg>

      {/* Informações de luz */}
      <View style={styles.info}>
        <Text style={styles.text}>Nível de luz: {lightLevel.toFixed(1)} lx</Text>
        <Text style={styles.text}>Fase da Lua: {getMoonPhase(lightLevel)}</Text>
      </View>
    </View>
  );
}

// Função auxiliar para determinar a fase da Lua
function getMoonPhase(lightLevel: number): string {
  if (lightLevel <= 10) return "Lua Nova 🌑";
  if (lightLevel > 10 && lightLevel <= 40) return "Lua Crescente 🌒";
  if (lightLevel > 40 && lightLevel <= 70) return "Quarto Crescente 🌓";
  if (lightLevel > 70 && lightLevel <= 90) return "Lua Gibosa 🌔";
  if (lightLevel >= 100) return "Lua Cheia 🌕";
  return "Lua Minguante 🌘";
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    position: "absolute",
  },
  svg: {
    position: "absolute",
  },
  info: {
    position: "absolute",
    bottom: 50,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 18,
    marginVertical: 5,
  },
});
