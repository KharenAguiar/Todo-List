import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import EmojiPicker from 'react-native-emoji-chooser';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { TaskFormState } from '@/types/task';

// Props do modal de criação de tarefa
// manter simples; `initialEmoji` é opcional
type AddTaskModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddTask: (task: TaskFormState) => void;
  initialEmoji?: string;
};

const DEFAULT_EMOJI = '📌'; // nada melhor q um pin

export function AddTaskModal({ visible, onClose, onAddTask, initialEmoji = DEFAULT_EMOJI }: AddTaskModalProps) {
  // hooks + estado local
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const [taskName, setTaskName] = useState(''); // nome da task
  const [category, setCategory] = useState(''); // categoria (opcional)
  const [selectedEmoji, setSelectedEmoji] = useState(initialEmoji); // emoji p/ tarefa
  const [showPicker, setShowPicker] = useState(false); // controla se o seletor aparece

  // pra habilitar botão de adicionar
  const canSubmit = useMemo(() => taskName.trim().length > 0, [taskName]);

  // reseta o formulário (útil após submit)
  function resetForm() {
    setTaskName('');
    setCategory('');
    setSelectedEmoji(initialEmoji);
    setShowPicker(false);
  }

  // handler de envio: invoca callback do pai e fecha modal
  function handleAdd() {
    if (!canSubmit) return; // proteção extra, nér

    onAddTask({ title: taskName.trim(), category: category.trim(), emoji: selectedEmoji });
    resetForm();
    onClose();
  }

  // JSX: estrutura do modal (KeyboardAvoidingView p/ iOS)
  // Pressable externo fecha modal; interno evita propagação p/ não fechar ao clicar dentro
  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={event => event.stopPropagation()}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={[styles.modalContent, { backgroundColor: theme.background }]}
          >
            <ThemedText style={styles.modalTitle} type="subtitle">
              Nova tarefa
            </ThemedText>

            <ThemedView style={styles.fieldGroup} type="backgroundElement">
              <ThemedText type="smallBold">Nome</ThemedText>
              <TextInput
                placeholder="Nome da tarefa"
                placeholderTextColor={theme.placeholder}
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                value={taskName}
                onChangeText={setTaskName}
              />
            </ThemedView>

            <ThemedView style={styles.fieldGroup} type="backgroundElement">
              <ThemedText type="smallBold">Categoria</ThemedText>
              <TextInput
                placeholder="Categoria"
                placeholderTextColor={theme.placeholder}
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                value={category}
                onChangeText={setCategory}
              />
            </ThemedView>

            {/* botão p/ abrir seletor de emoji */}
            <Pressable style={styles.emojiButton} onPress={() => setShowPicker(prev => !prev)}>
              <ThemedText style={styles.emojiText}>{selectedEmoji}</ThemedText>
            </Pressable>

            {showPicker && (
              <View style={styles.pickerWrapper}>
                <EmojiPicker
                  mode={colorScheme === 'dark' ? 'dark' : 'light'}
                  onSelect={emoji => {
                    setSelectedEmoji(emoji);
                    setShowPicker(false);
                  }}
                />
              </View>
            )}

            <Pressable
              style={[styles.addButton, !canSubmit && styles.addButtonDisabled]}
              onPress={handleAdd}
            >
              <ThemedText style={styles.addButtonText} type="default">
                Adicionar
              </ThemedText>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// estilos do modal (simples, com foco em usabilidade e clareza)
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.48)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'transparent',
  },
  modalContent: {
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: 'transparent',
  },
  modalTitle: {
    marginBottom: 20,
  },
  fieldGroup: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
  },
  emojiButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  emojiText: {
    fontSize: 40,
  },
  pickerWrapper: {
    height: 300,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#6200ee',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
