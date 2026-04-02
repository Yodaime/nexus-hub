import { Task } from '@/types';

/**
 * Gera um relatório CSV dos status das tarefas do mês atual.
 * @param tasks Lista de tarefas
 * @returns string CSV
 */
export function exportTasksStatusReport(tasks: Task[]): string {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filtra tarefas do mês atual
  const filtered = tasks.filter((task) => {
    const due = new Date(task.dueDate);
    return due.getMonth() === currentMonth && due.getFullYear() === currentYear;
  });

  // Cabeçalho CSV
  const header = [
    'Título',
    'Descrição',
    'Data de Vencimento',
    'Prioridade',
    'Status',
    'Tags',
    'Criada em',
    'Atualizada em',
  ];

  // Linhas
  const rows = filtered.map((task) => [
    task.title,
    task.description,
    new Date(task.dueDate).toLocaleDateString('pt-BR'),
    task.priority,
    task.status,
    task.tags.join('; '),
    new Date(task.createdAt).toLocaleDateString('pt-BR'),
    new Date(task.updatedAt).toLocaleDateString('pt-BR'),
  ]);

  // Monta CSV
  const csv = [header, ...rows]
    .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}` + '"').join(','))
    .join('\n');

  return csv;
}
