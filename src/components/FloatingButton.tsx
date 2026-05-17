import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

// Botão flutuante (UI)
// Uso: componente simples p/ acionar criação de nova tarefa
type FloatingButtonProps = {
  onPress: () => void;
};

export function FloatingButton({ onPress }: FloatingButtonProps) {
  // obs.: usamos `android_ripple` p/ efeito nativo no Android
  return (
    <Pressable style={styles.button} onPress={onPress} android_ripple={{ color: 'rgba(255,255,255,0.2)' }}>
      <MaterialIcons name="add" size={28} color="#fff" />
    </Pressable>
  );
}

// estilos locais do botão (posição, tamanho, cor, sombra)
const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
  },
});
