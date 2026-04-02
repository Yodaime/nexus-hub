import { Transaction } from '@/types';
import { Category } from '@/types';

/**
 * Gera um relatório CSV das transações financeiras.
 * @param transactions Lista de transações
 * @param categories Lista de categorias
 * @returns string CSV
 */
export function exportTransactionsReport(
  transactions: Transaction[],
  categories: Category[]
): string {
  // Cabeçalho CSV
  const header = [
    'Data',
    'Tipo',
    'Categoria',
    'Valor',
    'Descrição',
  ];

  // Linhas
  const rows = transactions.map((transaction) => {
    const category = categories.find((c) => c.id === transaction.categoryId);
    const date = new Date(transaction.date).toLocaleDateString('pt-BR');
    const type = transaction.type === 'income' ? 'Receita' : 'Despesa';
    const categoryName = category?.name || 'Sem categoria';
    const formattedAmount = transaction.amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return [
      date,
      type,
      categoryName,
      formattedAmount,
      transaction.description,
    ];
  });

  // Monta CSV
  const csv = [header, ...rows]
    .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  return csv;
}
