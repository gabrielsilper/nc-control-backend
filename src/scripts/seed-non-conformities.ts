import 'reflect-metadata';
import { appDataSource } from 'database/app-data-source';
import CorrectiveAction from 'entities/corrective-action';
import NcHistory from 'entities/nc-history';
import NcYearSequence from 'entities/nc-year-sequence';
import NonConformity from 'entities/non-conformity';
import User from 'entities/user';
import { NcHistoryEventType } from 'enums/nc-history-event-type.enum';
import { Profile } from 'enums/profile.enum';
import { SeverityNc } from 'enums/severity_nc.enum';
import { StatusCa } from 'enums/status.enum';
import { StatusNc } from 'enums/status_nc.enum';
import { TypeNc } from 'enums/type_nc.enum';
import Bcrypt from 'utils/bcrypt';

function relativeDate(offsetDays: number, hours = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hours, 0, 0, 0);
  return d;
}

const seedUsers = [
  {
    name: 'Ana Martins',
    email: 'ana.martins@nc-control.local',
    password: '12345678',
    profile: Profile.GESTOR,
  },
  {
    name: 'Bruno Costa',
    email: 'bruno.costa@nc-control.local',
    password: '12345678',
    profile: Profile.RESPONSAVEL,
  },
  {
    name: 'Diego Ferreira',
    email: 'diego.ferreira@nc-control.local',
    password: '12345678',
    profile: Profile.RESPONSAVEL,
  },
  {
    name: 'Carla Souza',
    email: 'carla.souza@nc-control.local',
    password: '12345678',
    profile: Profile.OPERADOR,
  },
];

async function ensureUsers(): Promise<User[]> {
  const userRepository = appDataSource.getRepository(User);
  const existingUsers = await userRepository.find({ order: { createdAt: 'ASC' } });

  if (existingUsers.length > 0) {
    return existingUsers;
  }

  const bcrypt = new Bcrypt();
  const usersToInsert = await Promise.all(
    seedUsers.map(async (user) =>
      userRepository.create({
        ...user,
        password: await bcrypt.encrypt(user.password),
      }),
    ),
  );

  return userRepository.save(usersToInsert);
}

type CorrectiveActionSeedData = {
  description: string;
  status: StatusCa;
  deadline: Date;
  assigneeEmail: string;
  finishedAt?: Date;
  evidence?: string;
};

type NcSeedData = {
  number: string;
  title: string;
  description: string;
  type: TypeNc;
  severity: SeverityNc;
  processLine: string;
  department: string;
  assignedToEmail?: string;
  dueDate?: Date;
  status?: StatusNc;
  rootCause?: string;
  openedAt?: Date;
  closedAt?: Date;
  correctiveAction?: CorrectiveActionSeedData;
};

function buildSeedData(): NcSeedData[] {
  return [
    {
      number: 'NC-2026-0001',
      title: 'Etiqueta de validade ilegivel em lote de reagentes',
      description:
        'Durante a inspecao de recebimento, duas caixas chegaram com etiqueta borrada, impedindo a rastreabilidade do lote.',
      type: TypeNc.MATERIAL,
      severity: SeverityNc.MEDIA,
      processLine: 'Recebimento de insumos',
      department: 'Qualidade',
    },
    {
      number: 'NC-2026-0002',
      title: 'Produto final com dimensao fora da tolerancia',
      description: 'A amostra da linha 02 apresentou variacao acima da tolerancia definida no plano de controle.',
      type: TypeNc.PRODUTO,
      severity: SeverityNc.ALTA,
      processLine: 'Usinagem linha 02',
      department: 'Producao',
    },
    {
      number: 'NC-2026-0003',
      title: 'Ausencia de checklist no setup do turno B',
      description: 'O equipamento iniciou operacao sem registro do checklist de setup previsto no procedimento.',
      type: TypeNc.PROCESSO,
      severity: SeverityNc.MEDIA,
      processLine: 'Envase automatico',
      department: 'Producao',
    },
    {
      number: 'NC-2026-0004',
      title: 'Detector de fumaca do corredor tecnico inoperante',
      description: 'Durante auditoria interna, o detector do corredor tecnico nao respondeu ao teste funcional.',
      type: TypeNc.SEGURANCA,
      severity: SeverityNc.CRITICA,
      processLine: 'Infraestrutura predial',
      department: 'Seguranca do Trabalho',
    },
    {
      number: 'NC-2026-0005',
      title: 'Residuos descartados em recipiente inadequado',
      description: 'Foi observado descarte de material contaminado em coletor incorreto na area de limpeza.',
      type: TypeNc.SEGURANCA,
      severity: SeverityNc.ALTA,
      processLine: 'Area de higienizacao',
      department: 'Meio Ambiente',
    },
    {
      number: 'NC-2026-0006',
      title: 'Vazamento identificado na linha de ar comprimido',
      description: 'Operador relatou perda de pressao na linha principal de ar comprimido do setor de montagem. Vazamento confirmado durante inspeção com detector de ultrassom.',
      type: TypeNc.PROCESSO,
      severity: SeverityNc.MEDIA,
      processLine: 'Linha de montagem',
      department: 'Manutencao',
      status: StatusNc.EM_TRATAMENTO,
      assignedToEmail: 'bruno.costa@nc-control.local',
      dueDate: relativeDate(49),
    },
    {
      number: 'NC-2026-0007',
      title: 'Temperatura da camara fria acima do limite na madrugada',
      description: 'Sensor registrou temperatura de 8 graus C durante tres horas consecutivas, acima do limite maximo de 5 graus C previsto no POP de armazenamento.',
      type: TypeNc.PRODUTO,
      severity: SeverityNc.ALTA,
      processLine: 'Armazenamento frigorifico',
      department: 'Logistica',
      status: StatusNc.EM_TRATAMENTO,
      assignedToEmail: 'diego.ferreira@nc-control.local',
      dueDate: relativeDate(-42),
    },
    {
      number: 'NC-2026-0008',
      title: 'EPI sem Certificado de Aprovacao em uso na linha de montagem',
      description: 'Auditoria interna identificou dois operadores utilizando protetor auricular sem numero de CA valido, em desconformidade com a NR-6.',
      type: TypeNc.SEGURANCA,
      severity: SeverityNc.ALTA,
      processLine: 'Linha de montagem',
      department: 'Seguranca do Trabalho',
      status: StatusNc.EM_TRATAMENTO,
      assignedToEmail: 'bruno.costa@nc-control.local',
      dueDate: relativeDate(-32),
    },
    {
      number: 'NC-2026-0009',
      title: 'Calibracao do torquimetro vencida ha 30 dias',
      description: 'Instrumento de medicao utilizado na linha de apertamento de parafusos estava com calibracao vencida ha 30 dias, comprometendo a rastreabilidade das medicoes.',
      type: TypeNc.MATERIAL,
      severity: SeverityNc.MEDIA,
      processLine: 'Linha de apertamento',
      department: 'Qualidade',
      status: StatusNc.ENCERRADA,
      assignedToEmail: 'diego.ferreira@nc-control.local',
      dueDate: relativeDate(8),
      openedAt: relativeDate(-11, 8),
      closedAt: relativeDate(-7, 10),
      rootCause:
        'Falha no sistema de controle de calibracao dos instrumentos de medicao. O alerta automatico nao foi configurado corretamente, permitindo o uso do equipamento apos o vencimento.',
      correctiveAction: {
        description:
          'Revisar e atualizar o sistema de alertas de calibracao, incluindo notificacao automatica por email 30 dias antes do vencimento e revisao mensal da lista de instrumentos.',
        status: StatusCa.CONCLUIDA,
        deadline: relativeDate(8),
        assigneeEmail: 'diego.ferreira@nc-control.local',
        finishedAt: relativeDate(-8, 14),
        evidence:
          'Relatorio de revisao do sistema de calibracao emitido em 23/04/2026 e comprovante de recalibracao do torquimetro (cert. CAL-2026-0847).',
      },
    },
    {
      number: 'NC-2026-0010',
      title: 'Documentacao de treinamento desatualizada para novos colaboradores',
      description:
        'Revisao do manual de integracao indicou que procedimentos referentes ao uso de equipamentos foram atualizados em 2025, mas o material de treinamento nao foi revisado.',
      type: TypeNc.PROCESSO,
      severity: SeverityNc.BAIXA,
      processLine: 'Integracao de colaboradores',
      department: 'Recursos Humanos',
    },
  ];
}

async function run() {
  await appDataSource.initialize();

  try {
    const nonConformityRepository = appDataSource.getRepository(NonConformity);
    const ncHistoryRepository = appDataSource.getRepository(NcHistory);
    const correctiveActionRepository = appDataSource.getRepository(CorrectiveAction);
    const sequenceRepository = appDataSource.getRepository(NcYearSequence);

    const users = await ensureUsers();
    const operator = users.find((u) => u.profile === Profile.OPERADOR);
    const manager = users.find((u) => u.profile === Profile.GESTOR);

    if (!operator) throw new Error('Nenhum usuario com perfil OPERADOR encontrado.');
    if (!manager) throw new Error('Nenhum usuario com perfil GESTOR encontrado.');

    const userByEmail = new Map(users.map((u) => [u.email, u]));

    const seedData = buildSeedData();
    const numbers = seedData.map((item) => item.number);

    const existing = await nonConformityRepository.find({
      select: { number: true },
      where: numbers.map((number) => ({ number })),
    });
    const existingNumbers = new Set(existing.map((item) => item.number));
    const itemsToInsert = seedData.filter((item) => !existingNumbers.has(item.number));

    if (itemsToInsert.length === 0) {
      console.log('Nenhuma nao conformidade nova para inserir. Seed ja aplicado.');
      return;
    }

    const entities = itemsToInsert.map((item) => {
      const assignee = item.assignedToEmail ? userByEmail.get(item.assignedToEmail) : undefined;
      return nonConformityRepository.create({
        number: item.number,
        title: item.title,
        description: item.description,
        type: item.type,
        severity: item.severity,
        status: item.status ?? StatusNc.ABERTA,
        processLine: item.processLine,
        department: item.department,
        rootCause: item.rootCause,
        openedAt: item.openedAt,
        dueDate: item.dueDate,
        closedAt: item.closedAt,
        assignedTo: assignee,
        createdBy: operator,
      });
    });

    const saved = await nonConformityRepository.save(entities);

    const allHistoryRecords: NcHistory[] = [];

    for (const nc of saved) {
      const item = itemsToInsert.find((i) => i.number === nc.number)!;
      const assignee = item.assignedToEmail ? userByEmail.get(item.assignedToEmail) : undefined;
      const isEncerrada = item.status === StatusNc.ENCERRADA;

      allHistoryRecords.push(
        ncHistoryRepository.create({
          ncId: nc.id,
          actorId: operator.id,
          eventType: NcHistoryEventType.CREATED,
          metadata: { number: nc.number, title: nc.title },
          ...(item.openedAt ? { occurredAt: item.openedAt } : {}),
        }),
      );

      if (assignee) {
        const assignmentTime = item.openedAt
          ? new Date(item.openedAt.getTime() + 3600 * 1000)
          : undefined;

        allHistoryRecords.push(
          ncHistoryRepository.create({
            ncId: nc.id,
            actorId: manager.id,
            eventType: NcHistoryEventType.ASSIGNEE_SET,
            metadata: { assigneeId: assignee.id, assigneeName: assignee.name, dueDate: item.dueDate },
            ...(assignmentTime ? { occurredAt: assignmentTime } : {}),
          }),
        );

        allHistoryRecords.push(
          ncHistoryRepository.create({
            ncId: nc.id,
            actorId: manager.id,
            eventType: NcHistoryEventType.STATUS_CHANGED,
            metadata: { previousStatus: StatusNc.ABERTA, newStatus: StatusNc.EM_TRATAMENTO },
            ...(assignmentTime ? { occurredAt: assignmentTime } : {}),
          }),
        );

        if (isEncerrada && item.closedAt) {
          const verificationAt = new Date(item.closedAt.getTime() - 24 * 3600 * 1000);

          allHistoryRecords.push(
            ncHistoryRepository.create({
              ncId: nc.id,
              actorId: assignee.id,
              eventType: NcHistoryEventType.STATUS_CHANGED,
              metadata: { previousStatus: StatusNc.EM_TRATAMENTO, newStatus: StatusNc.AGUARDANDO_VERIFICACAO },
              occurredAt: verificationAt,
            }),
          );

          allHistoryRecords.push(
            ncHistoryRepository.create({
              ncId: nc.id,
              actorId: manager.id,
              eventType: NcHistoryEventType.STATUS_CHANGED,
              metadata: { previousStatus: StatusNc.AGUARDANDO_VERIFICACAO, newStatus: StatusNc.ENCERRADA },
              occurredAt: item.closedAt,
            }),
          );
        }
      }
    }

    await ncHistoryRepository.save(allHistoryRecords);

    for (const nc of saved) {
      const item = itemsToInsert.find((i) => i.number === nc.number)!;
      if (item.correctiveAction) {
        const caData = item.correctiveAction;
        const caAssignee = userByEmail.get(caData.assigneeEmail)!;
        await correctiveActionRepository.save(
          correctiveActionRepository.create({
            description: caData.description,
            status: caData.status,
            deadline: caData.deadline,
            assigneeId: caAssignee.id,
            nonConformityId: nc.id,
            finishedAt: caData.finishedAt,
            evidence: caData.evidence,
          }),
        );
      }
    }

    await sequenceRepository.upsert({ year: 2026, lastSeq: 10 }, ['year']);

    console.log(`${saved.length} nao conformidades inseridas com sucesso.`);
    console.log(`${allHistoryRecords.length} registros de historico inseridos.`);
    console.log(`Operador responsavel pela criacao: ${operator.name} (${operator.email})`);
  } finally {
    if (appDataSource.isInitialized) {
      await appDataSource.destroy();
    }
  }
}

run().catch((error) => {
  console.error('Erro ao executar seed de nao conformidades:', error);
  process.exit(1);
});
