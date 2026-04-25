import 'reflect-metadata';
import { appDataSource } from 'database/app-data-source';
import NcYearSequence from 'entities/nc-year-sequence';
import NonConformity from 'entities/non-conformity';
import User from 'entities/user';
import { Profile } from 'enums/profile.enum';
import { SeverityNc } from 'enums/severity_nc.enum';
import { StatusNc } from 'enums/status_nc.enum';
import { TypeNc } from 'enums/type_nc.enum';
import Bcrypt from 'utils/bcrypt';

type NonConformitySeed = {
  number: string;
  title: string;
  description: string;
  type: TypeNc;
  severity: SeverityNc;
  status: StatusNc;
  processLine: string;
  department: string;
  rootCause?: string;
  createdById: string;
  createdBy: User;
  assignedToId?: string | null;
  assignedTo?: User | null;
  openedAt: Date;
  dueDate?: Date;
  closedAt?: Date | null;
};

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
  const existingUsers = await userRepository.find({
    order: {
      createdAt: 'ASC',
    },
  });

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

function buildSeedData(users: User[]): NonConformitySeed[] {
  const creator = users[0];
  const secondaryUser = users[1] ?? users[0];
  const tertiaryUser = users[2] ?? users[0];
  const now = new Date();

  const daysFromNow = (days: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    return date;
  };

  return [
    {
      number: 'NC-2026-000001',
      title: 'Etiqueta de validade ilegivel em lote de reagentes',
      description:
        'Durante a inspecao de recebimento, duas caixas chegaram com etiqueta borrada, impedindo a rastreabilidade do lote.',
      type: TypeNc.MATERIAL,
      severity: SeverityNc.MEDIA,
      status: StatusNc.ABERTA,
      processLine: 'Recebimento de insumos',
      department: 'Qualidade',
      rootCause: 'Falha no armazenamento durante transporte terceirizado',
      createdBy: creator,
      assignedTo: secondaryUser,
      createdById: creator.id,
      assignedToId: secondaryUser.id,
      openedAt: daysFromNow(-18),
      dueDate: daysFromNow(4),
      closedAt: null,
    },
    {
      number: 'NC-2026-000002',
      title: 'Produto final com dimensao fora da tolerancia',
      description: 'A amostra da linha 02 apresentou variacao acima da tolerancia definida no plano de controle.',
      type: TypeNc.PRODUTO,
      severity: SeverityNc.ALTA,
      status: StatusNc.EM_TRATAMENTO,
      processLine: 'Usinagem linha 02',
      department: 'Producao',
      rootCause: 'Desgaste prematuro da ferramenta de corte',
      createdBy: creator,
      assignedTo: secondaryUser,
      createdById: creator.id,
      assignedToId: secondaryUser.id,
      openedAt: daysFromNow(-14),
      dueDate: daysFromNow(2),
      closedAt: null,
    },
    {
      number: 'NC-2026-000003',
      title: 'Pallet sem identificacao de origem',
      description: 'Foi identificado pallet de materia-prima sem informacao de fornecedor e data de recebimento.',
      type: TypeNc.MATERIAL,
      severity: SeverityNc.BAIXA,
      status: StatusNc.AGUARDANDO_VERIFICACAO,
      processLine: 'Almoxarifado central',
      department: 'Logistica',
      rootCause: 'Etiqueta nao impressa no ato do recebimento',
      createdBy: creator,
      assignedTo: tertiaryUser,
      createdById: creator.id,
      assignedToId: tertiaryUser.id,
      openedAt: daysFromNow(-12),
      dueDate: daysFromNow(7),
      closedAt: null,
    },
    {
      number: 'NC-2026-000004',
      title: 'Ausencia de checklist no setup do turno B',
      description: 'O equipamento iniciou operacao sem registro do checklist de setup previsto no procedimento.',
      type: TypeNc.PROCESSO,
      severity: SeverityNc.MEDIA,
      status: StatusNc.AGUARDANDO_VERIFICACAO,
      processLine: 'Envase automatico',
      department: 'Producao',
      rootCause: 'Treinamento incompleto da equipe do turno B',
      createdBy: creator,
      assignedTo: tertiaryUser,
      createdById: creator.id,
      assignedToId: tertiaryUser.id,
      openedAt: daysFromNow(-10),
      dueDate: daysFromNow(1),
      closedAt: null,
    },
    {
      number: 'NC-2026-000005',
      title: 'Detector de fumaca do corredor tecnico inoperante',
      description: 'Durante auditoria interna, o detector do corredor tecnico nao respondeu ao teste funcional.',
      type: TypeNc.SEGURANÇA,
      severity: SeverityNc.CRITICA,
      status: StatusNc.ENCERRADA,
      processLine: 'Infraestrutura predial',
      department: 'Seguranca do Trabalho',
      rootCause: 'Manutencao preventiva executada fora da periodicidade',
      createdBy: creator,
      assignedTo: secondaryUser,
      createdById: creator.id,
      assignedToId: secondaryUser.id,
      openedAt: daysFromNow(-30),
      dueDate: daysFromNow(-22),
      closedAt: daysFromNow(-20),
    },
    {
      number: 'NC-2026-000006',
      title: 'Documento de instrucao obsoleto em uso na bancada',
      description: 'A equipe utilizava uma instrucao impressa antiga, divergente da revisao vigente no sistema.',
      type: TypeNc.PROCESSO,
      severity: SeverityNc.MEDIA,
      status: StatusNc.CANCELADA,
      processLine: 'Montagem final',
      department: 'Engenharia de Processos',
      rootCause: 'Copia fisica antiga nao recolhida apos revisao documental',
      createdBy: creator,
      assignedTo: null,
      createdById: creator.id,
      assignedToId: null,
      openedAt: daysFromNow(-9),
      dueDate: daysFromNow(5),
      closedAt: null,
    },
    {
      number: 'NC-2026-000007',
      title: 'Parafuso com torque abaixo do especificado',
      description: 'Auditoria de processo encontrou torque medio abaixo do limite minimo em 3 amostras consecutivas.',
      type: TypeNc.PRODUTO,
      severity: SeverityNc.ALTA,
      status: StatusNc.EM_TRATAMENTO,
      processLine: 'Montagem mecanica',
      department: 'Qualidade',
      rootCause: 'Chave dinamometrica descalibrada',
      createdBy: secondaryUser,
      assignedTo: tertiaryUser,
      createdById: secondaryUser.id,
      assignedToId: tertiaryUser.id,
      openedAt: daysFromNow(-7),
      dueDate: daysFromNow(-1),
      closedAt: null,
    },
    {
      number: 'NC-2026-000008',
      title: 'Residuos descartados em recipiente inadequado',
      description: 'Foi observado descarte de material contaminado em coletor incorreto na area de limpeza.',
      type: TypeNc.SEGURANÇA,
      severity: SeverityNc.ALTA,
      status: StatusNc.ABERTA,
      processLine: 'Area de higienizacao',
      department: 'Meio Ambiente',
      rootCause: 'Sinalizacao visual insuficiente nos pontos de descarte',
      createdBy: secondaryUser,
      assignedTo: null,
      createdById: secondaryUser.id,
      assignedToId: null,
      openedAt: daysFromNow(-6),
      dueDate: daysFromNow(3),
      closedAt: null,
    },
    {
      number: 'NC-2026-000009',
      title: 'Lacre rompido em embalagem secundaria',
      description: 'No embarque, foi identificado lacre rompido em caixa secundaria de produto acabado.',
      type: TypeNc.PRODUTO,
      severity: SeverityNc.BAIXA,
      status: StatusNc.AGUARDANDO_VERIFICACAO,
      processLine: 'Expedicao',
      department: 'Logistica',
      rootCause: 'Ajuste incorreto da seladora automatica',
      createdBy: secondaryUser,
      assignedTo: creator,
      createdById: secondaryUser.id,
      assignedToId: creator.id,
      openedAt: daysFromNow(-5),
      dueDate: daysFromNow(6),
      closedAt: null,
    },
    {
      number: 'NC-2026-000010',
      title: 'Cadastro de fornecedor sem documento obrigatório',
      description: 'A homologacao de novo fornecedor foi concluida sem anexar o certificado fiscal exigido.',
      type: TypeNc.OUTRO,
      severity: SeverityNc.MEDIA,
      status: StatusNc.AGUARDANDO_VERIFICACAO,
      processLine: 'Suprimentos',
      department: 'Compras',
      rootCause: 'Checklist de onboarding incompleto no portal interno',
      createdBy: secondaryUser,
      assignedTo: creator,
      createdById: secondaryUser.id,
      assignedToId: creator.id,
      openedAt: daysFromNow(-4),
      dueDate: daysFromNow(8),
      closedAt: null,
    },
    {
      number: 'NC-2026-000011',
      title: 'Lote aprovado sem anexo do laudo laboratorial',
      description: 'O sistema permitiu aprovacao de lote sem upload do laudo laboratorial previsto.',
      type: TypeNc.PROCESSO,
      severity: SeverityNc.CRITICA,
      status: StatusNc.EM_TRATAMENTO,
      processLine: 'Liberacao de lote',
      department: 'Controle de Qualidade',
      rootCause: 'Regra de validacao ausente no fluxo do sistema',
      createdBy: tertiaryUser,
      assignedTo: secondaryUser,
      createdById: tertiaryUser.id,
      assignedToId: secondaryUser.id,
      openedAt: daysFromNow(-3),
      dueDate: daysFromNow(-2),
      closedAt: null,
    },
    {
      number: 'NC-2026-000012',
      title: 'Empilhadeira operando com checklist vencido',
      description: 'Veiculo interno operou com checklist diario nao preenchido durante o turno da manha.',
      type: TypeNc.SEGURANÇA,
      severity: SeverityNc.CRITICA,
      status: StatusNc.ABERTA,
      processLine: 'Movimentacao interna',
      department: 'Logistica',
      rootCause: 'Falha de bloqueio operacional para checklist vencido',
      createdBy: tertiaryUser,
      assignedTo: null,
      createdById: tertiaryUser.id,
      assignedToId: null,
      openedAt: daysFromNow(-2),
      dueDate: daysFromNow(1),
      closedAt: null,
    },
    {
      number: 'NC-2026-000013',
      title: 'Sensor de temperatura sem calibracao vigente',
      description: 'O sensor da camara fria estava em uso com certificacao de calibracao expirada.',
      type: TypeNc.MATERIAL,
      severity: SeverityNc.ALTA,
      status: StatusNc.ENCERRADA,
      processLine: 'Camara fria 01',
      department: 'Manutencao',
      rootCause: 'Plano anual de calibracao nao atualizado',
      createdBy: tertiaryUser,
      assignedTo: creator,
      createdById: tertiaryUser.id,
      assignedToId: creator.id,
      openedAt: daysFromNow(-25),
      dueDate: daysFromNow(-15),
      closedAt: daysFromNow(-14),
    },
    {
      number: 'NC-2026-000014',
      title: 'Divergencia entre quantidade fisica e sistema',
      description: 'Inventario ciclico apontou divergencia de 18 unidades entre estoque fisico e ERP.',
      type: TypeNc.OUTRO,
      severity: SeverityNc.MEDIA,
      status: StatusNc.AGUARDANDO_VERIFICACAO,
      processLine: 'Estoque de acabados',
      department: 'PCP',
      rootCause: 'Baixa manual nao realizada apos retrabalho',
      createdBy: creator,
      assignedTo: tertiaryUser,
      createdById: creator.id,
      assignedToId: tertiaryUser.id,
      openedAt: daysFromNow(-11),
      dueDate: daysFromNow(-3),
      closedAt: null,
    },
    {
      number: 'NC-2026-000015',
      title: 'Falha intermitente no leitor de codigo de barras',
      description: 'O leitor da linha de expedicao falhou em leituras consecutivas, gerando retrabalho operacional.',
      type: TypeNc.PROCESSO,
      severity: SeverityNc.BAIXA,
      status: StatusNc.AGUARDANDO_VERIFICACAO,
      processLine: 'Separacao e expedicao',
      department: 'TI Industrial',
      rootCause: 'Firmware desatualizado no coletor de dados',
      createdBy: creator,
      assignedTo: secondaryUser,
      createdById: creator.id,
      assignedToId: secondaryUser.id,
      openedAt: daysFromNow(-1),
      dueDate: daysFromNow(10),
      closedAt: null,
    },
  ];
}

async function run() {
  await appDataSource.initialize();

  try {
    const nonConformityRepository = appDataSource.getRepository(NonConformity);

    const users = await ensureUsers();
    const seedData = buildSeedData(users);

    const numbers = seedData.map((item) => item.number);
    const existing = await nonConformityRepository.find({
      select: {
        number: true,
      },
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
        status: item.status,
        processLine: item.processLine,
        department: item.department,
        rootCause: item.rootCause,
        openedAt: item.openedAt,
        dueDate: item.dueDate,
        closedAt: item.closedAt,
        createdBy: item.createdBy,
        ...(item.assignedTo ? { assignedTo: item.assignedTo } : {}),
      }),
    );

    await nonConformityRepository.save(entities);

    const sequenceRepository = appDataSource.getRepository(NcYearSequence);
    const allNcs = await nonConformityRepository.find({ select: { number: true } });
    const seqByYear = new Map<number, number>();
    for (const nc of allNcs) {
      const parts = nc.number.split('-');
      const year = parseInt(parts[1], 10);
      const seq = parseInt(parts[2], 10);
      if (!seqByYear.has(year) || seq > (seqByYear.get(year) ?? 0)) {
        seqByYear.set(year, seq);
      }
    }
    for (const [year, lastSeq] of seqByYear) {
      await sequenceRepository.upsert({ year, lastSeq }, ['year']);
    }

    const assignedCount = itemsToInsert.filter((item) => item.assignedToId).length;
    const expiredCount = itemsToInsert.filter(
      (item) => item.dueDate && item.dueDate < new Date() && ![StatusNc.ENCERRADA, StatusNc.CANCELADA].includes(item.status),
    ).length;

    console.log(`${itemsToInsert.length} nao conformidades inseridas com sucesso.`);
    console.log(`${users.length} usuarios disponiveis para relacionamento.`);
    console.log(`${assignedCount} registros atribuidos e ${itemsToInsert.length - assignedCount} nao atribuidos.`);
    console.log(`${expiredCount} registros com prazo vencido para teste de filtro.`);
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
