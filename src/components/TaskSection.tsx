import { StyleSheet, View } from 'react-native';

import { TaskItem } from '@/components/TaskItem';
import { ThemedText } from '@/components/themed-text';
import { Task } from '@/types/task';

// Seção de tarefas: agrupa e exibe lista (pendentes / concluídas)
// o componente é puramente de apresentação
type TaskSectionProps = {
  title: string;
  tasks: Task[];
  onToggle: (taskId: number) => void;
  emptyMessage: string;
  showCategory?: boolean;
};

export function TaskSection({ title, tasks, onToggle, emptyMessage, showCategory = false }: TaskSectionProps) {
  return (
    <View style={styles.sectionContainer}>
      <ThemedText style={styles.sectionTitle} type="subtitle">
        {title}
      </ThemedText>

      {/* if: exibe mensagem quando não há tarefas */}
      {tasks.length === 0 ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.emptyText}>
          {emptyMessage}
        </ThemedText>
      ) : (
        /* map: renderiza cada TaskItem */
        tasks.map(task => (
          <TaskItem key={task.id} task={task} onToggle={onToggle} showCategory={showCategory} />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  emptyText: {
    marginTop: 8,
  },
});
