import 'reflect-metadata';
import { appDataSource } from 'database/app-data-source';
import NcHistory from 'entities/nc-history';
import NcYearSequence from 'entities/nc-year-sequence';
import NonConformity from 'entities/non-conformity';
import User from 'entities/user';
import { NcHistoryEventType } from 'enums/nc-history-event-type.enum';
import { Profile } from 'enums/profile.enum';
import { SeverityNc } from 'enums/severity_nc.enum';
import { StatusNc } from 'enums/status_nc.enum';
import { TypeNc } from 'enums/type_nc.enum';
import Bcrypt from 'utils/bcrypt';

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

type NcSeedData = {
  number: string;
  title: string;
  description: string;
  type: TypeNc;
  severity: SeverityNc;
  processLine: string;
  department: string;
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
  ];
}

async function run() {
  await appDataSource.initialize();

  try {
    const nonConformityRepository = appDataSource.getRepository(NonConformity);
    const ncHistoryRepository = appDataSource.getRepository(NcHistory);
    const sequenceRepository = appDataSource.getRepository(NcYearSequence);

    const users = await ensureUsers();
    const operator = users.find((u) => u.profile === Profile.OPERADOR);

    if (!operator) {
      throw new Error('Nenhum usuario com perfil OPERADOR encontrado.');
    }

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

    const entities = itemsToInsert.map((item) =>
      nonConformityRepository.create({
        number: item.number,
        title: item.title,
        description: item.description,
        type: item.type,
        severity: item.severity,
        status: StatusNc.ABERTA,
        processLine: item.processLine,
        department: item.department,
        createdBy: operator,
      }),
    );

    const saved = await nonConformityRepository.save(entities);

    const historyRecords = saved.map((nc) =>
      ncHistoryRepository.create({
        ncId: nc.id,
        actorId: operator.id,
        eventType: NcHistoryEventType.CREATED,
        metadata: { number: nc.number, title: nc.title },
      }),
    );
    await ncHistoryRepository.save(historyRecords);

    await sequenceRepository.upsert({ year: 2026, lastSeq: 5 }, ['year']);

    console.log(`${saved.length} nao conformidades inseridas com sucesso (status: ABERTA).`);
    console.log(`${historyRecords.length} registros de historico de criacao inseridos.`);
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
