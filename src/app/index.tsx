import { useEffect, useMemo, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

import {
  LogBox,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { AddTaskModal } from '@/components/AddTaskModal';
import { FloatingButton } from '@/components/FloatingButton';
import { TaskSection } from '@/components/TaskSection';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { useTheme } from '@/hooks/use-theme';

import { Task, TaskFormState } from '@/types/task';

// remove warning interno da lib de emoji
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

// chave usada pra salvar localmente
const TASKS_STORAGE_KEY = '@todo_list_tasks';

// Tela principal: lista de tarefas (Home)
export default function HomeScreen() {

  // lista principal de tarefas
  // p/ estudo: `tasks` armazena todas as tarefas em memória
  const [tasks, setTasks] = useState<Task[]>([]);

  // controla visibilidade do modal de criação
  const [modalVisible, setModalVisible] = useState(false);

  // hook de tema (p/ UI consistente com o tema do sistema)
  const theme = useTheme();

  // data formatada em pt-BR (ex.: 17 de maio de 2026)
  const currentDate = useMemo(
    () =>
      new Date().toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    []
  );

  // derive: tarefas pendentes (não concluidas)
  const pendingTasks = useMemo(
    () => tasks.filter(task => !task.completed),
    [tasks]
  );

  // derive: tarefas concluídas
  const completedTasks = useMemo(
    () => tasks.filter(task => task.completed),
    [tasks]
  );

  // Efeito: carrega tasks do armazenamento local (AsyncStorage)
  useEffect(() => {

    async function loadTasks() {

      const raw = await AsyncStorage.getItem(TASKS_STORAGE_KEY);

      // se não há dado salvo, retorna (estado inicial vazio)
      if (!raw) return;

      try {
        // parse dos dados salvos (json)
        const parsedTasks: Task[] = JSON.parse(raw);
        setTasks(parsedTasks);
      } catch {
        // fallback simples: se parse falhar, zera lista
        setTasks([]);
      }
    }

    void loadTasks();

  }, []);

  // Efeito: persiste `tasks` no AsyncStorage sempre que `tasks` muda
  useEffect(() => {

    void AsyncStorage.setItem(
      TASKS_STORAGE_KEY,
      JSON.stringify(tasks)
    );

  }, [tasks]);

  // Função: adiciona nova tarefa a partir do formulário
  // Recebe: `taskForm` com campos validados (simples)
  function handleAddTask(taskForm: TaskFormState) {
    setTasks(prev => [
      ...prev,
      {
        id: Date.now(), // id simples p/ estudo: timestamp
        title: taskForm.title,
        category: taskForm.category,
        emoji: taskForm.emoji,
        completed: false,
      },
    ]);
  }

  // Função: alterna o estado `completed` de uma tarefa
  // Implementação imutável (cria nova array p/ re-render)
  function handleToggleTask(taskId: number) {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  }

  return (

    <ThemedView
      style={[
        styles.root,
        {
          backgroundColor: theme.background,
        },
      ]}
    >

      <StatusBar style="auto" />

      <SafeAreaView style={styles.safeArea}>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >

          {/* titulo */}
          <ThemedText
            type="title"
            style={styles.title}
          >
            ToDo List
          </ThemedText>

          {/* data atual */}
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.date}
          >
            {currentDate}
          </ThemedText>

          {/* contadores */}
          <View style={styles.countersRow}>

            <ThemedText style={styles.counter}>
              Pendentes: {pendingTasks.length}
            </ThemedText>

            <ThemedText style={styles.counter}>
              Concluídas: {completedTasks.length}
            </ThemedText>

          </View>

          {/* tarefas pendentes */}
          <TaskSection
            title="Pendentes"
            tasks={pendingTasks}
            onToggle={handleToggleTask}
            emptyMessage="Nenhuma tarefa pendente por enquanto."
            showCategory
          />

          {/* tarefas concluidas */}
          <TaskSection
            title="Concluídas"
            tasks={completedTasks}
            onToggle={handleToggleTask}
            emptyMessage="Nenhuma tarefa concluída ainda."
          />

        </ScrollView>

        {/* botao flutuante */}
        <FloatingButton
          onPress={() => setModalVisible(true)}
        />

        {/* modal de add task */}
        <AddTaskModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAddTask={handleAddTask}
        />

      </SafeAreaView>

    </ThemedView>

  );
}

const styles = StyleSheet.create({

  root: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  content: {
    padding: 24,
    paddingBottom: 120,
  },

  title: {
    marginBottom: 8,
  },

  date: {
    marginBottom: 24,
  },

  // linha dos contadores
  countersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  counter: {
    fontSize: 16,
    fontWeight: '600',
  },

});