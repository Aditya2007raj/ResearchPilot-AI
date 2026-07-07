export const MOCK_USER = {
  name: 'Aditya Raj',
  email: 'aditya@example.edu',
  role: 'Researcher',
  institution: 'Department of Computer Science',
};

export const MOCK_STATISTICS = [
  { label: 'Total Papers', value: 12 },
  { label: 'Analyses Generated', value: 8 },
  { label: 'Active Workspaces', value: 3 },
  { label: 'Favorites', value: 4 },
];

export const MOCK_RECENT_PAPERS = [
  {
    id: 'paper-101',
    title: 'Attention Is All You Need',
    authors: 'Vaswani et al.',
    tags: ['Transformer', 'NLP', 'Deep Learning'],
    lastModified: '2 hours ago',
    researchHealth: 'Fully Analyzed', // Options: Fully Analyzed, Summary Only, Not Reviewed
    favorite: true,
  },
  {
    id: 'paper-102',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    authors: 'Devlin et al.',
    tags: ['BERT', 'NLP', 'Pre-training'],
    lastModified: 'Yesterday',
    researchHealth: 'Summary Only',
    favorite: false,
  },
  {
    id: 'paper-103',
    title: 'Generative Adversarial Nets',
    authors: 'Goodfellow et al.',
    tags: ['GANs', 'Computer Vision'],
    lastModified: '3 days ago',
    researchHealth: 'Not Reviewed',
    favorite: true,
  },
  {
    id: 'paper-104',
    title: 'Adam: A Method for Stochastic Optimization',
    authors: 'Kingma & Ba',
    tags: ['Optimization', 'Deep Learning'],
    lastModified: '1 week ago',
    researchHealth: 'Fully Analyzed',
    favorite: false,
  },
];

export const MOCK_ACTIVITY_FEED = [
  {
    id: 'act-1',
    type: 'upload',
    description: 'Uploaded "Attention Is All You Need"',
    time: '2 hours ago',
  },
  {
    id: 'act-2',
    type: 'action_plan',
    description: 'Generated Action Plan for "BERT Language Understanding"',
    time: 'Yesterday',
  },
  {
    id: 'act-3',
    type: 'review',
    description: 'Completed critical review of "Generative Adversarial Nets"',
    time: '3 days ago',
  },
  {
    id: 'act-4',
    type: 'chat',
    description: 'Discussed methodology limitations on "Adam Optimization"',
    time: '1 week ago',
  },
];

export const MOCK_LAST_ACTIVE_PAPER = {
  id: 'paper-101',
  title: 'Attention Is All You Need',
  lastActivityTime: '2 hours ago',
};
