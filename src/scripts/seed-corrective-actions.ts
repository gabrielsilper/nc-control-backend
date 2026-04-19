import 'reflect-metadata';
import { appDataSource } from 'database/app-data-source';
import CorrectiveAction from 'entities/corrective-action';
import NonConformity from 'entities/non-conformity';
import { StatusCa } from 'enums/status.enum';

type CorrectiveActionSeed = {
  nonConformityNumber: string;
  description: string;
  status: StatusCa;
  deadline: Date;
  evidence?: string;
  finishedAt?: Date;
};

function buildSeedData() {
  const now = new Date();

  const daysFromNow = (days: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    return date;
  };

  return [
    {
      nonConformityNumber: 'NC-2026-000001',
      description:
        'Reforcar o procedimento de conferência de etiquetas no recebimento e validar os lotes pendentes com o fornecedor.',
      status: StatusCa.PENDENTE,
      deadline: daysFromNow(5),
    },
    {
      nonConformityNumber: 'NC-2026-000002',
      description:
        'Substituir a ferramenta de corte da linha 02 e revisar o plano de troca preventiva para evitar novas variações dimensionais.',
      status: StatusCa.EM_ANDAMENTO,
      deadline: daysFromNow(2),
      evidence: 'OS de manutenção 4821 aberta e checklist de setup revisado pela supervisão.',
    },
    {
      nonConformityNumber: 'NC-2026-000003',
      description: 'Implantar dupla checagem na identificação de pallets e registrar o treinamento da equipe de almoxarifado.',
      status: StatusCa.PENDENTE,
      deadline: daysFromNow(7),
    },
    {
      nonConformityNumber: 'NC-2026-000004',
      description: 'Aplicar reciclagem no procedimento de setup do turno B e bloquear o início sem checklist preenchido.',
      status: StatusCa.EM_ANDAMENTO,
      deadline: daysFromNow(1),
      evidence: 'Treinamento agendado e regra de bloqueio em homologação no sistema da célula.',
    },
    {
      nonConformityNumber: 'NC-2026-000005',
      description:
        'Executar manutenção corretiva do detector e atualizar o calendário de inspeções preventivas da área técnica.',
      status: StatusCa.CONCLUIDA,
      deadline: daysFromNow(-18),
      evidence: 'Relatório de manutenção PM-105 anexado e teste funcional aprovado pela segurança do trabalho.',
      finishedAt: daysFromNow(-19),
    },
    {
      nonConformityNumber: 'NC-2026-000007',
      description:
        'Enviar a chave dinamométrica para calibração imediata e segregar os lotes produzidos desde a última verificação.',
      status: StatusCa.EM_ANDAMENTO,
      deadline: daysFromNow(-1),
      evidence: 'Equipamento segregado e lote sob contenção aguardando resultado da calibração.',
    },
    {
      nonConformityNumber: 'NC-2026-000008',
      description:
        'Reforçar a sinalização visual dos coletores e orientar a equipe de higienização sobre o descarte correto de resíduos.',
      status: StatusCa.PENDENTE,
      deadline: daysFromNow(4),
    },
    {
      nonConformityNumber: 'NC-2026-000011',
      description:
        'Adicionar validação obrigatória do laudo laboratorial no fluxo de aprovação e revisar lotes aprovados recentemente.',
      status: StatusCa.EM_ANDAMENTO,
      deadline: daysFromNow(-2),
      evidence: 'História criada no backlog e levantamento dos lotes impactados concluído.',
    },
    {
      nonConformityNumber: 'NC-2026-000013',
      description:
        'Atualizar o plano anual de calibração dos sensores críticos e anexar os novos certificados no repositório de qualidade.',
      status: StatusCa.CONCLUIDA,
      deadline: daysFromNow(-13),
      evidence: 'Plano revisado, certificados anexados e auditoria interna validou a atualização documental.',
      finishedAt: daysFromNow(-14),
    },
    {
      nonConformityNumber: 'NC-2026-000015',
      description:
        'Atualizar o firmware do leitor de código de barras e monitorar a taxa de falha da expedição por cinco dias.',
      status: StatusCa.PENDENTE,
      deadline: daysFromNow(9),
    },
  ] satisfies CorrectiveActionSeed[];
}

async function run() {
  await appDataSource.initialize();

  try {
    const nonConformityRepository = appDataSource.getRepository(NonConformity);
    const correctiveActionRepository = appDataSource.getRepository(CorrectiveAction);
    const seedData = buildSeedData();

    const numbers = seedData.map((item) => item.nonConformityNumber);
    const nonConformities = await nonConformityRepository.find({
      relations: {
        createdBy: true,
        assignedTo: true,
      },
      where: numbers.map((number) => ({ number })),
    });

    if (nonConformities.length === 0) {
      throw new Error(
        'Nenhuma nao conformidade encontrada para relacionamento. Execute antes a seed `npm run seed:non-conformities`.',
      );
    }

    const nonConformitiesByNumber = new Map(nonConformities.map((item) => [item.number, item]));
    const missingNumbers = numbers.filter((number) => !nonConformitiesByNumber.has(number));

    if (missingNumbers.length > 0) {
      throw new Error(
        `As seguintes nao conformidades nao foram encontradas: ${missingNumbers.join(', ')}. Execute a seed base antes desta.`,
      );
    }

    const existingCorrectiveActions = await correctiveActionRepository.find({
      relations: {
        assignee: true,
        nonConformity: true,
      },
    });

    const existingKeys = new Set(
      existingCorrectiveActions.map((item) => `${item.nonConformityId}:${item.description.trim()}:${item.assigneeId}`),
    );

    const itemsToInsert = seedData
      .map((item) => {
        const nonConformity = nonConformitiesByNumber.get(item.nonConformityNumber);

        if (!nonConformity) {
          return null;
        }

        const assignee = nonConformity.assignedTo ?? nonConformity.createdBy;
        const key = `${nonConformity.id}:${item.description.trim()}:${assignee.id}`;

        if (existingKeys.has(key)) {
          return null;
        }

        return correctiveActionRepository.create({
          description: item.description,
          status: item.status,
          deadline: item.deadline,
          evidence: item.evidence,
          finishedAt: item.finishedAt,
          nonConformity,
          assignee,
        });
      })
      .filter((item): item is CorrectiveAction => item !== null);

    if (itemsToInsert.length === 0) {
      console.log('Nenhuma acao corretiva nova para inserir. Seed ja aplicado.');
      return;
    }

    await correctiveActionRepository.save(itemsToInsert);

    const completedCount = itemsToInsert.filter((item) => item.status === StatusCa.CONCLUIDA).length;
    const overdueCount = itemsToInsert.filter(
      (item) => item.deadline < new Date() && item.status !== StatusCa.CONCLUIDA,
    ).length;

    console.log(`${itemsToInsert.length} acoes corretivas inseridas com sucesso.`);
    console.log(`${completedCount} acoes concluidas e ${itemsToInsert.length - completedCount} acoes abertas.`);
    console.log(`${overdueCount} acoes com prazo vencido para teste de filtros.`);
  } finally {
    if (appDataSource.isInitialized) {
      await appDataSource.destroy();
    }
  }
}

run().catch((error) => {
  console.error('Erro ao executar seed de acoes corretivas:', error);
  process.exit(1);
});
