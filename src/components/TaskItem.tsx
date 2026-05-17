import Checkbox from 'expo-checkbox';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Task } from '@/types/task';

// Componente que representa uma tarefa individual
// separa comportamento (checkbox) e apresentação (texto, categoria)
type TaskItemProps = {
  task: Task;
  onToggle: (taskId: number) => void;
  showCategory?: boolean;
};

export function TaskItem({ task, onToggle, showCategory = false }: TaskItemProps) {
  return (
    <ThemedView style={[styles.taskCard, task.completed && styles.taskCardCompleted]} type="backgroundElement">
      {/* Checkbox: alterna `completed` */}
      <Checkbox
        value={task.completed}
        onValueChange={() => onToggle(task.id)}
        color={task.completed ? '#6200ee' : undefined}
      />

      <View style={styles.taskContent}>
        {/* título com emoji */}
        <ThemedText style={[styles.taskText, task.completed && styles.completedText]}>
          {task.emoji} {task.title}
        </ThemedText>

        {/* categoria (opcional) */}
        {showCategory && task.category ? (
          <ThemedText style={styles.categoryText} themeColor="textSecondary" type="small">
            {task.category}
          </ThemedText>
        ) : null}
      </View>
    </ThemedView>
  );
}
// estilos locais do TaskItem (cartão, texto, categoria)
const styles = StyleSheet.create({
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  taskCardCompleted: {
    opacity: 0.8,
  },
  taskContent: {
    flex: 1,
    marginLeft: 12,
  },
  taskText: {
    fontWeight: '600',
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  categoryText: {
    marginTop: 4,
  },
});
