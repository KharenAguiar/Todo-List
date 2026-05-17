// Modelo de dados p/ uma tarefa
export type Task = {
  id: number; // id numérico (timestamp p/ simplicidade)
  title: string; // título/descrição curta
  category: string; // categoria (opcional)
  emoji: string; // emoji representativo
  completed: boolean; // status: concluída ou não
};

// Estado do formulário usado para criar/editar tarefas
export type TaskFormState = {
  title: string;
  category: string;
  emoji: string;
};
