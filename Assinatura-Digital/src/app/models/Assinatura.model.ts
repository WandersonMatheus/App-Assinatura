import { Cliente } from "./Cliente.model";
import { Termo } from "./Termo.model";

export interface Assinatura {
  id: string;

  // Relacionamentos
  clienteId: string;
  funcionarioId?: string;   // Se não for obrigatório, coloque opcional
  termoId: string;           // Se for único termo, ok assim

  cliente?: Cliente;         // Opcional caso venha carregado do backend
  termo?: Termo;             // Opcional idem

  // Informações do PDF
  pdfUrl?: string;           // Pode ser opcional se nem sempre disponível
  titulo?: string;

  // Datas como strings ISO ou Date? Ideal usar string ISO e converter na UI
  dataCriacao: string;       // exemplo: "2025-06-30T15:00:00Z"
  dataEnvioLink?: string;
  dataAssinatura?: string;

  // Status da assinatura - enum string literal
  status: 'CRIADA' | 'LINK_ENVIADO' | 'ASSINADA' | 'CANCELADA' | 'PENDENTE';

  // Link dinâmico gerado para assinatura
  linkAssinatura?: string;
}
