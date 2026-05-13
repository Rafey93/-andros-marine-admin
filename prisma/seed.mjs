import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const students = [
  ['Ahmed Al-Rashidi', 'ahmed.r@masfleet.com', 'Chief Officer', 'STCW Basic Safety Training', '2025-01-15', 'Active', 82, 85],
  ['Maria Santos', 'm.santos@masfleet.com', 'Deck Cadet', 'Navigation & Watchkeeping', '2025-01-20', 'Active', 45, 42],
  ['James Okafor', 'j.okafor@masfleet.com', 'Second Engineer', 'Tanker Safety (Oil)', '2025-02-01', 'Completed', 100, 91],
  ['Priya Nair', 'p.nair@masfleet.com', 'Third Officer', 'GMDSS Radio Operations', '2025-02-10', 'Active', 67, 73],
  ['Carlos Mendes', 'c.mendes@masfleet.com', 'Bosun', 'Firefighting & Fire Prevention', '2025-02-14', 'Inactive', 30, 38],
  ['Yuki Tanaka', 'y.tanaka@masfleet.com', 'Chief Engineer', 'Ship Security Officer', '2025-02-20', 'Completed', 100, 88],
  ['Grace Obi', 'g.obi@masfleet.com', 'Deck Cadet', 'Navigation & Watchkeeping', '2025-03-15', 'Active', 22, 28],
  ['Chen Wei', 'c.wei@masfleet.com', 'Second Engineer', 'Firefighting & Fire Prevention', '2025-04-08', 'Completed', 100, 90],
];

const courses = [
  ['c1', 'STCW Basic Safety Training', 'Safety', '40 hours', 62, 74, 'Active', '#36c6d3'],
  ['c2', 'Firefighting & Fire Prevention', 'Safety', '24 hours', 38, 81, 'Active', '#F44336'],
  ['c3', 'Elementary First Aid', 'Medical', '16 hours', 45, 68, 'Active', '#8BC34A'],
  ['c4', 'Personal Survival Techniques', 'Safety', '20 hours', 31, 77, 'Active', '#FFCA28'],
  ['c5', 'Navigation & Watchkeeping', 'Navigation', '80 hours', 27, 55, 'Active', '#212a7a'],
  ['c6', 'GMDSS Radio Operations', 'Communication', '48 hours', 19, 63, 'Active', '#9C27B0'],
  ['c7', 'Tanker Safety (Oil)', 'Tanker Ops', '32 hours', 22, 82, 'Active', '#FF9800'],
  ['c8', 'Ship Security Officer', 'Security', '36 hours', 15, 70, 'Inactive', '#607D8B'],
];

const certificates = [
  ['MAS-2025-001', 'James Okafor', 'Tanker Safety (Oil)', '2025-03-01', '2028-03-01', 'Valid'],
  ['MAS-2025-002', 'Yuki Tanaka', 'Ship Security Officer', '2025-03-20', '2028-03-20', 'Valid'],
  ['MAS-2025-003', 'Mohammed Al-Farsi', 'STCW Basic Safety Training', '2025-04-10', '2030-04-10', 'Valid'],
  ['MAS-2022-041', 'Ahmed Al-Rashidi', 'STCW Basic Safety Training', '2022-06-15', '2025-06-15', 'Expired'],
];

const campaigns = [
  ['Q1 STCW Refresher', 'Deck Officers', ['c1', 'c4'], '2025-03-31', 84, 'Completed', 25, 21, 'Mandatory annual STCW refresher for all deck officers.'],
  ['Engine Room Safety Q2', 'Engine Room Crew', ['c2', 'c3'], '2025-06-30', 52, 'Active', 18, 9, 'Fire safety and first aid training for engineering department.'],
  ['New Cadet Onboarding', 'Cadets', ['c1', 'c3', 'c4'], '2025-05-15', 33, 'Active', 12, 4, 'Comprehensive onboarding program for newly joined cadets.'],
  ['Tanker Certification Drive', 'Tanker Fleet', ['c7'], '2025-04-01', 40, 'Overdue', 20, 8, 'Oil tanker safety certification for all tanker fleet crew.'],
];

const smartGroups = [
  ['Deck Officers', 'Rank: Captain, Chief Officer, Second Officer, Third Officer', 42, 76],
  ['Engine Room Crew', 'Rank: Chief Engineer, Second Engineer, Third Engineer', 31, 68],
  ['Cadets', 'Rank: Deck Cadet, Engine Cadet', 18, 34],
  ['Ratings', 'Rank: Bosun, AB Seaman, OS', 55, 52],
  ['Tanker Fleet', 'Vessel type: Oil Tanker, Chemical Tanker', 63, 71],
];

const chartData = [
  ['Jan', 18, 10, 8],
  ['Feb', 24, 15, 12],
  ['Mar', 31, 20, 17],
  ['Apr', 27, 22, 19],
  ['May', 35, 18, 14],
  ['Jun', 42, 28, 22],
  ['Jul', 38, 31, 26],
  ['Aug', 29, 25, 21],
  ['Sep', 44, 33, 28],
  ['Oct', 51, 40, 35],
  ['Nov', 47, 38, 32],
  ['Dec', 39, 29, 24],
];

const exams = [
  {
    id: '1',
    title: 'STCW Basic Safety - Final Assessment',
    courseId: 'c1',
    duration: 30,
    questions: [
      ['q1', 'What is the first action when discovering a fire onboard?', ['Sound the general alarm', 'Attempt to extinguish the fire', 'Abandon ship immediately', 'Call the captain'], 0],
      ['q2', 'Which lifejacket colour is internationally recognised for maritime use?', ['Red', 'Blue', 'Orange', 'Yellow'], 2],
      ['q3', 'How often must fire drills be conducted on passenger vessels?', ['Monthly', 'Weekly', 'Quarterly', 'Annually'], 1],
      ['q4', 'What does MUSTER mean in a maritime emergency context?', ['Prepare the lifeboats', 'Assemble at designated stations', 'Signal for help', 'Secure all watertight doors'], 1],
      ['q5', 'Personal survival techniques include which of the following?', ['Swimming to shore', 'Staying with the vessel', 'Using a life raft and signalling', 'Discarding your lifejacket if it slows swimming'], 2],
    ],
  },
  {
    id: '2',
    title: 'Firefighting - Practical Knowledge Test',
    courseId: 'c2',
    duration: 20,
    questions: [
      ['q1', 'Which class of fire involves flammable liquids?', ['Class A', 'Class B', 'Class C', 'Class D'], 1],
      ['q2', 'CO2 extinguishers are most suitable for which environment?', ['Open deck', 'Engine room', 'Crew cabins', 'Galley'], 1],
      ['q3', 'What is the correct order of firefighting (PASS)?', ['Pull, Aim, Squeeze, Sweep', 'Push, Aim, Start, Shoot', 'Prepare, Aim, Spray, Stop', 'Pull, Apply, Spray, Secure'], 0],
    ],
  },
];

async function main() {
  const username = process.env.ADMIN_USERNAME || 'maya';
  const password = process.env.ADMIN_PASSWORD || 'change-this-before-production';
  const name = process.env.ADMIN_NAME || 'Maya';

  await prisma.user.upsert({
    where: { username },
    update: { name, passwordHash: await bcrypt.hash(password, 12) },
    create: { username, name, passwordHash: await bcrypt.hash(password, 12) },
  });

  for (const [id, title, category, duration, enrolledCount, completionRate, status, color] of courses) {
    await prisma.course.upsert({
      where: { title },
      update: { category, duration, enrolledCount, completionRate, status, color },
      create: { id, title, category, duration, enrolledCount, completionRate, status, color },
    });
  }

  for (const [name, email, rank, course, enrollmentDate, status, progress, riskScore] of students) {
    await prisma.student.upsert({
      where: { email },
      update: { name, rank, course, enrollmentDate: new Date(enrollmentDate), status, progress, riskScore },
      create: { name, email, rank, course, enrollmentDate: new Date(enrollmentDate), status, progress, riskScore },
    });
  }

  for (const [certificateNo, studentName, courseName, issueDate, expiryDate, status] of certificates) {
    await prisma.certificate.upsert({
      where: { certificateNo },
      update: { studentName, courseName, issueDate: new Date(issueDate), expiryDate: new Date(expiryDate), status },
      create: { certificateNo, studentName, courseName, issueDate: new Date(issueDate), expiryDate: new Date(expiryDate), status },
    });
  }

  for (const [title, assignedGroup, courseIds, deadline, completionRate, status, totalAssigned, completed, description] of campaigns) {
    const existing = await prisma.campaign.findFirst({ where: { title } });
    const data = { title, assignedGroup, coursesJson: courseIds, deadline: new Date(deadline), completionRate, status, totalAssigned, completed, description };
    if (existing) await prisma.campaign.update({ where: { id: existing.id }, data });
    else await prisma.campaign.create({ data });
  }

  for (const [name, criteria, memberCount, avgRiskScore] of smartGroups) {
    await prisma.smartGroup.upsert({
      where: { name },
      update: { criteria, memberCount, avgRiskScore },
      create: { name, criteria, memberCount, avgRiskScore },
    });
  }

  await prisma.chartMetric.deleteMany();
  for (const [index, [month, enrollments, completions, certificatesCount]] of chartData.entries()) {
    await prisma.chartMetric.create({ data: { month, enrollments, completions, certificates: certificatesCount, sortOrder: index } });
  }

  for (const exam of exams) {
    await prisma.exam.upsert({
      where: { id: exam.id },
      update: { title: exam.title, courseId: exam.courseId, duration: exam.duration },
      create: { id: exam.id, title: exam.title, courseId: exam.courseId, duration: exam.duration },
    });
    for (const [index, [id, question, optionsJson, correctIndex]] of exam.questions.entries()) {
      await prisma.examQuestion.upsert({
        where: { id: `${exam.id}-${id}` },
        update: { question, optionsJson, correctIndex, sortOrder: index },
        create: { id: `${exam.id}-${id}`, examId: exam.id, question, optionsJson, correctIndex, sortOrder: index },
      });
    }
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
