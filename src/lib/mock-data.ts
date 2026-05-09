import type { Student, Course, Certificate, ChartDataPoint, Campaign, SmartGroup, Exam, ExamSession } from '@/types';

export const students: Student[] = [
  { id: 's1',  name: 'Ahmed Al-Rashidi',    email: 'ahmed.r@masfleet.com',    rank: 'Chief Officer',     course: 'STCW Basic Safety Training',       enrollmentDate: '2025-01-15', status: 'Active',    progress: 82, riskScore: 85 },
  { id: 's2',  name: 'Maria Santos',        email: 'm.santos@masfleet.com',   rank: 'Deck Cadet',        course: 'Navigation & Watchkeeping',         enrollmentDate: '2025-01-20', status: 'Active',    progress: 45, riskScore: 42 },
  { id: 's3',  name: 'James Okafor',        email: 'j.okafor@masfleet.com',   rank: 'Second Engineer',   course: 'Tanker Safety (Oil)',                enrollmentDate: '2025-02-01', status: 'Completed', progress: 100, riskScore: 91 },
  { id: 's4',  name: 'Priya Nair',          email: 'p.nair@masfleet.com',     rank: 'Third Officer',     course: 'GMDSS Radio Operations',            enrollmentDate: '2025-02-10', status: 'Active',    progress: 67, riskScore: 73 },
  { id: 's5',  name: 'Carlos Mendes',       email: 'c.mendes@masfleet.com',   rank: 'Bosun',             course: 'Firefighting & Fire Prevention',    enrollmentDate: '2025-02-14', status: 'Inactive',  progress: 30, riskScore: 38 },
  { id: 's6',  name: 'Yuki Tanaka',         email: 'y.tanaka@masfleet.com',   rank: 'Chief Engineer',    course: 'Ship Security Officer',             enrollmentDate: '2025-02-20', status: 'Completed', progress: 100, riskScore: 88 },
  { id: 's7',  name: 'Ibrahim Hassan',      email: 'i.hassan@masfleet.com',   rank: 'AB Seaman',         course: 'Personal Survival Techniques',      enrollmentDate: '2025-03-01', status: 'Active',    progress: 55, riskScore: 61 },
  { id: 's8',  name: 'Elena Volkov',        email: 'e.volkov@masfleet.com',   rank: 'Second Officer',    course: 'Elementary First Aid',              enrollmentDate: '2025-03-05', status: 'Active',    progress: 78, riskScore: 79 },
  { id: 's9',  name: 'Mohammed Al-Farsi',   email: 'm.alfarsi@masfleet.com',  rank: 'Captain',           course: 'STCW Basic Safety Training',        enrollmentDate: '2025-03-10', status: 'Completed', progress: 100, riskScore: 95 },
  { id: 's10', name: 'Grace Obi',           email: 'g.obi@masfleet.com',      rank: 'Deck Cadet',        course: 'Navigation & Watchkeeping',         enrollmentDate: '2025-03-15', status: 'Active',    progress: 22, riskScore: 28 },
  { id: 's11', name: 'Lars Eriksen',        email: 'l.eriksen@masfleet.com',  rank: 'Third Engineer',    course: 'Tanker Safety (Oil)',               enrollmentDate: '2025-03-20', status: 'Active',    progress: 60, riskScore: 65 },
  { id: 's12', name: 'Fatima Al-Zahra',     email: 'f.alzahra@masfleet.com',  rank: 'Purser',            course: 'Ship Security Officer',             enrollmentDate: '2025-03-25', status: 'Inactive',  progress: 15, riskScore: 22 },
  { id: 's13', name: 'Raj Patel',           email: 'r.patel@masfleet.com',    rank: 'Chief Officer',     course: 'GMDSS Radio Operations',            enrollmentDate: '2025-04-01', status: 'Active',    progress: 88, riskScore: 82 },
  { id: 's14', name: 'Sofia Andrade',       email: 's.andrade@masfleet.com',  rank: 'Catering Officer',  course: 'Elementary First Aid',              enrollmentDate: '2025-04-05', status: 'Active',    progress: 50, riskScore: 55 },
  { id: 's15', name: 'Chen Wei',            email: 'c.wei@masfleet.com',      rank: 'Second Engineer',   course: 'Firefighting & Fire Prevention',    enrollmentDate: '2025-04-08', status: 'Completed', progress: 100, riskScore: 90 },
  { id: 's16', name: 'Kwame Asante',        email: 'k.asante@masfleet.com',   rank: 'AB Seaman',         course: 'Personal Survival Techniques',      enrollmentDate: '2025-04-10', status: 'Active',    progress: 40, riskScore: 44 },
  { id: 's17', name: 'Natasha Ivanova',     email: 'n.ivanova@masfleet.com',  rank: 'Bosun',             course: 'STCW Basic Safety Training',        enrollmentDate: '2025-04-12', status: 'Active',    progress: 72, riskScore: 70 },
  { id: 's18', name: 'Pedro Alves',         email: 'p.alves@masfleet.com',    rank: 'Third Officer',     course: 'Navigation & Watchkeeping',         enrollmentDate: '2025-04-13', status: 'Inactive',  progress: 10, riskScore: 18 },
  { id: 's19', name: 'Aisha Bello',         email: 'a.bello@masfleet.com',    rank: 'Deck Cadet',        course: 'Elementary First Aid',              enrollmentDate: '2025-04-14', status: 'Active',    progress: 35, riskScore: 36 },
  { id: 's20', name: 'Viktor Kovalenko',    email: 'v.kovalenko@masfleet.com',rank: 'Captain',           course: 'Ship Security Officer',             enrollmentDate: '2025-04-15', status: 'Active',    progress: 95, riskScore: 92 },
];

export const courses: Course[] = [
  { id: 'c1', title: 'STCW Basic Safety Training',    category: 'Safety',      duration: '40 hours', enrolledCount: 62, completionRate: 74, status: 'Active', color: '#36c6d3' },
  { id: 'c2', title: 'Firefighting & Fire Prevention', category: 'Safety',      duration: '24 hours', enrolledCount: 38, completionRate: 81, status: 'Active', color: '#F44336' },
  { id: 'c3', title: 'Elementary First Aid',           category: 'Medical',     duration: '16 hours', enrolledCount: 45, completionRate: 68, status: 'Active', color: '#8BC34A' },
  { id: 'c4', title: 'Personal Survival Techniques',  category: 'Safety',      duration: '20 hours', enrolledCount: 31, completionRate: 77, status: 'Active', color: '#FFCA28' },
  { id: 'c5', title: 'Navigation & Watchkeeping',     category: 'Navigation',  duration: '80 hours', enrolledCount: 27, completionRate: 55, status: 'Active', color: '#212a7a' },
  { id: 'c6', title: 'GMDSS Radio Operations',        category: 'Communication', duration: '48 hours', enrolledCount: 19, completionRate: 63, status: 'Active', color: '#9C27B0' },
  { id: 'c7', title: 'Tanker Safety (Oil)',            category: 'Tanker Ops',  duration: '32 hours', enrolledCount: 22, completionRate: 82, status: 'Active', color: '#FF9800' },
  { id: 'c8', title: 'Ship Security Officer',          category: 'Security',    duration: '36 hours', enrolledCount: 15, completionRate: 70, status: 'Inactive', color: '#607D8B' },
];

export const certificates: Certificate[] = [
  { id: 'cert1',  studentName: 'James Okafor',      courseName: 'Tanker Safety (Oil)',              issueDate: '2025-03-01', expiryDate: '2028-03-01', certificateNo: 'MAS-2025-001', status: 'Valid' },
  { id: 'cert2',  studentName: 'Yuki Tanaka',        courseName: 'Ship Security Officer',            issueDate: '2025-03-20', expiryDate: '2028-03-20', certificateNo: 'MAS-2025-002', status: 'Valid' },
  { id: 'cert3',  studentName: 'Mohammed Al-Farsi',  courseName: 'STCW Basic Safety Training',      issueDate: '2025-04-10', expiryDate: '2030-04-10', certificateNo: 'MAS-2025-003', status: 'Valid' },
  { id: 'cert4',  studentName: 'Chen Wei',           courseName: 'Firefighting & Fire Prevention',   issueDate: '2025-04-08', expiryDate: '2028-04-08', certificateNo: 'MAS-2025-004', status: 'Valid' },
  { id: 'cert5',  studentName: 'Viktor Kovalenko',   courseName: 'Ship Security Officer',            issueDate: '2025-04-14', expiryDate: '2028-04-14', certificateNo: 'MAS-2025-005', status: 'Valid' },
  { id: 'cert6',  studentName: 'Ahmed Al-Rashidi',   courseName: 'STCW Basic Safety Training',      issueDate: '2022-06-15', expiryDate: '2025-06-15', certificateNo: 'MAS-2022-041', status: 'Expired' },
  { id: 'cert7',  studentName: 'Lars Eriksen',       courseName: 'Elementary First Aid',             issueDate: '2021-11-20', expiryDate: '2024-11-20', certificateNo: 'MAS-2021-089', status: 'Expired' },
  { id: 'cert8',  studentName: 'Priya Nair',         courseName: 'Personal Survival Techniques',    issueDate: '2025-01-10', expiryDate: '2030-01-10', certificateNo: 'MAS-2025-006', status: 'Valid' },
  { id: 'cert9',  studentName: 'Elena Volkov',       courseName: 'Elementary First Aid',             issueDate: '2024-12-05', expiryDate: '2027-12-05', certificateNo: 'MAS-2024-112', status: 'Valid' },
  { id: 'cert10', studentName: 'Raj Patel',          courseName: 'GMDSS Radio Operations',          issueDate: '2023-08-22', expiryDate: '2026-08-22', certificateNo: 'MAS-2023-067', status: 'Valid' },
  { id: 'cert11', studentName: 'Carlos Mendes',      courseName: 'Firefighting & Fire Prevention',  issueDate: '2021-03-18', expiryDate: '2024-03-18', certificateNo: 'MAS-2021-034', status: 'Expired' },
  { id: 'cert12', studentName: 'Fatima Al-Zahra',    courseName: 'Ship Security Officer',            issueDate: '2025-02-01', expiryDate: '2028-02-01', certificateNo: 'MAS-2025-007', status: 'Revoked' },
  { id: 'cert13', studentName: 'Ibrahim Hassan',     courseName: 'Personal Survival Techniques',    issueDate: '2024-09-14', expiryDate: '2029-09-14', certificateNo: 'MAS-2024-098', status: 'Valid' },
  { id: 'cert14', studentName: 'Sofia Andrade',      courseName: 'STCW Basic Safety Training',      issueDate: '2024-07-03', expiryDate: '2029-07-03', certificateNo: 'MAS-2024-075', status: 'Valid' },
  { id: 'cert15', studentName: 'Kwame Asante',       courseName: 'Navigation & Watchkeeping',       issueDate: '2025-03-28', expiryDate: '2028-03-28', certificateNo: 'MAS-2025-008', status: 'Valid' },
];

export const chartData: ChartDataPoint[] = [
  { month: 'Jan', enrollments: 18, completions: 10, certificates: 8  },
  { month: 'Feb', enrollments: 24, completions: 15, certificates: 12 },
  { month: 'Mar', enrollments: 31, completions: 20, certificates: 17 },
  { month: 'Apr', enrollments: 27, completions: 22, certificates: 19 },
  { month: 'May', enrollments: 35, completions: 18, certificates: 14 },
  { month: 'Jun', enrollments: 42, completions: 28, certificates: 22 },
  { month: 'Jul', enrollments: 38, completions: 31, certificates: 26 },
  { month: 'Aug', enrollments: 29, completions: 25, certificates: 21 },
  { month: 'Sep', enrollments: 44, completions: 33, certificates: 28 },
  { month: 'Oct', enrollments: 51, completions: 40, certificates: 35 },
  { month: 'Nov', enrollments: 47, completions: 38, certificates: 32 },
  { month: 'Dec', enrollments: 39, completions: 29, certificates: 24 },
];

export const riskTrendData = [
  { month: 'Oct', score: 61 },
  { month: 'Nov', score: 64 },
  { month: 'Dec', score: 67 },
  { month: 'Jan', score: 69 },
  { month: 'Feb', score: 71 },
  { month: 'Mar', score: 73 },
];

export const campaigns: Campaign[] = [
  {
    id: 'camp1',
    title: 'Q1 STCW Refresher',
    assignedGroup: 'Deck Officers',
    courses: ['c1', 'c4'],
    deadline: '2025-03-31',
    completionRate: 84,
    status: 'Completed',
    totalAssigned: 25,
    completed: 21,
    description: 'Mandatory annual STCW refresher for all deck officers.',
  },
  {
    id: 'camp2',
    title: 'Engine Room Safety Q2',
    assignedGroup: 'Engine Room Crew',
    courses: ['c2', 'c3'],
    deadline: '2025-06-30',
    completionRate: 52,
    status: 'Active',
    totalAssigned: 18,
    completed: 9,
    description: 'Fire safety and first aid training for engineering department.',
  },
  {
    id: 'camp3',
    title: 'New Cadet Onboarding',
    assignedGroup: 'Cadets',
    courses: ['c1', 'c3', 'c4'],
    deadline: '2025-05-15',
    completionRate: 33,
    status: 'Active',
    totalAssigned: 12,
    completed: 4,
    description: 'Comprehensive onboarding program for newly joined cadets.',
  },
  {
    id: 'camp4',
    title: 'Tanker Certification Drive',
    assignedGroup: 'Tanker Fleet',
    courses: ['c7'],
    deadline: '2025-04-01',
    completionRate: 40,
    status: 'Overdue',
    totalAssigned: 20,
    completed: 8,
    description: 'Oil tanker safety certification for all tanker fleet crew.',
  },
  {
    id: 'camp5',
    title: 'Security Awareness Q3',
    assignedGroup: 'All Crew',
    courses: ['c8'],
    deadline: '2025-09-30',
    completionRate: 0,
    status: 'Scheduled',
    totalAssigned: 89,
    completed: 0,
    description: 'Ship security awareness training for entire fleet crew.',
  },
];

export const smartGroups: SmartGroup[] = [
  { id: 'g1', name: 'Deck Officers',    criteria: 'Rank: Captain, Chief Officer, Second Officer, Third Officer', memberCount: 42, avgRiskScore: 76 },
  { id: 'g2', name: 'Engine Room Crew', criteria: 'Rank: Chief Engineer, Second Engineer, Third Engineer',       memberCount: 31, avgRiskScore: 68 },
  { id: 'g3', name: 'Cadets',           criteria: 'Rank: Deck Cadet, Engine Cadet',                             memberCount: 18, avgRiskScore: 34 },
  { id: 'g4', name: 'Ratings',          criteria: 'Rank: Bosun, AB Seaman, OS',                                 memberCount: 55, avgRiskScore: 52 },
  { id: 'g5', name: 'Tanker Fleet',     criteria: 'Vessel type: Oil Tanker, Chemical Tanker',                   memberCount: 63, avgRiskScore: 71 },
];

export const exams: Exam[] = [
  {
    id: '1',
    title: 'STCW Basic Safety — Final Assessment',
    courseId: 'c1',
    duration: 30,
    questions: [
      { id: 'q1', question: 'What is the first action when discovering a fire onboard?', options: ['Sound the general alarm', 'Attempt to extinguish the fire', 'Abandon ship immediately', 'Call the captain'], correctIndex: 0 },
      { id: 'q2', question: 'Which lifejacket colour is internationally recognised for maritime use?', options: ['Red', 'Blue', 'Orange', 'Yellow'], correctIndex: 2 },
      { id: 'q3', question: 'How often must fire drills be conducted on passenger vessels?', options: ['Monthly', 'Weekly', 'Quarterly', 'Annually'], correctIndex: 1 },
      { id: 'q4', question: 'What does MUSTER mean in a maritime emergency context?', options: ['Prepare the lifeboats', 'Assemble at designated stations', 'Signal for help', 'Secure all watertight doors'], correctIndex: 1 },
      { id: 'q5', question: 'Personal survival techniques include which of the following?', options: ['Swimming to shore', 'Staying with the vessel', 'Using a life raft and signalling', 'Discarding your lifejacket if it slows swimming'], correctIndex: 2 },
    ],
  },
  {
    id: '2',
    title: 'Firefighting — Practical Knowledge Test',
    courseId: 'c2',
    duration: 20,
    questions: [
      { id: 'q1', question: 'Which class of fire involves flammable liquids?', options: ['Class A', 'Class B', 'Class C', 'Class D'], correctIndex: 1 },
      { id: 'q2', question: 'CO2 extinguishers are most suitable for which environment?', options: ['Open deck', 'Engine room', 'Crew cabins', 'Galley'], correctIndex: 1 },
      { id: 'q3', question: 'What is the correct order of firefighting (PASS)?', options: ['Pull, Aim, Squeeze, Sweep', 'Push, Aim, Start, Shoot', 'Prepare, Aim, Spray, Stop', 'Pull, Apply, Spray, Secure'], correctIndex: 0 },
      { id: 'q4', question: 'Fixed CO2 fire suppression systems require crew to?', options: ['Enter to verify fire is out', 'Evacuate the space before activation', 'Wear cotton clothing only', 'Open all ventilation'], correctIndex: 1 },
      { id: 'q5', question: 'The International Fire Safety Systems (FSS) Code is adopted by?', options: ['IMO', 'ILO', 'USCG', 'Classification societies only'], correctIndex: 0 },
    ],
  },
];

export const mockExamSessions: ExamSession[] = [
  { id: 'ses1', examId: '1', examTitle: 'STCW Basic Safety — Final Assessment', studentName: 'Ahmed Al-Rashidi',   startTime: Date.now() - 3600000 * 5, endTime: Date.now() - 3600000 * 4.5, snapshotCount: 5, flagCount: 0, status: 'Completed', score: 80 },
  { id: 'ses2', examId: '2', examTitle: 'Firefighting — Practical Knowledge Test', studentName: 'Carlos Mendes',  startTime: Date.now() - 3600000 * 3, endTime: Date.now() - 3600000 * 2.6, snapshotCount: 4, flagCount: 2, status: 'Flagged',   score: 60 },
  { id: 'ses3', examId: '1', examTitle: 'STCW Basic Safety — Final Assessment', studentName: 'Priya Nair',        startTime: Date.now() - 3600000 * 2, endTime: Date.now() - 3600000 * 1.5, snapshotCount: 5, flagCount: 1, status: 'Flagged',   score: 100 },
  { id: 'ses4', examId: '2', examTitle: 'Firefighting — Practical Knowledge Test', studentName: 'Ibrahim Hassan', startTime: Date.now() - 3600000 * 1, endTime: Date.now() - 3600000 * 0.6, snapshotCount: 4, flagCount: 0, status: 'Completed', score: 80 },
];
