import { Cliente } from "./Cliente.model";
import { Termo } from "./Termo.model";

export interface Assinatura {
  id: string;

  // Relacionamentos
  clienteId: string;
  funcionarioId: string;
  termoId: string; // ✅ Se quiser permitir múltiplos termos. Se só permitir um, use termoId: string
  cliente: Cliente; // ✅ Tipar corretamente se o modelo Cliente existir
  termo: Termo;     // ✅ Mesmo acima

  // Informações do PDF
  pdfUrl: string; // ✅ Apenas se estiver disponível no backend
  titulo: string;

  // Datas
  dataCriacao: string;       // ou Date — veja abaixo
  dataEnvioLink?: string;
  dataAssinatura?: string;

  // Status da assinatura
  status: 'CRIADA' | 'LINK_ENVIADO' | 'ASSINADA' | 'CANCELADA' | 'PENDENTE';

  // Link dinâmico
  linkAssinatura?: string;
}
