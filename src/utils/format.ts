export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

// Converte o valor digitado pelo usuário (string com máscara) para número decimal
export function parseCurrencyInput(value: string): number {
  const numericValue = value.replace(/\D/g, ""); // Remove tudo que não for número
  return parseFloat((Number(numericValue) / 100).toFixed(2)); // Divide por 100 e retorna como decimal
}

// Formata o valor durante a digitação no formato R$ 0,00
export function formatCurrencyInput(value: string): string {
  const numericValue = value.replace(/\D/g, ""); // Remove caracteres não numéricos
  const decimalValue = (Number(numericValue) / 100).toFixed(2); // Converte para decimal
  return `R$ ${decimalValue.replace(".", ",")}`; // Retorna o valor formatado
}