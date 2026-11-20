export const faqConfig = {
  heading: 'Frequently Asked Questions',
  subheading: 'Everything you need to know about Vantrix Screen technical assessments.',
  items: [
    {
      id: 'faq-1',
      question: 'How does Vantrix Screen ensure assessment integrity and prevent cheating?',
      answer:
        'Vantrix Screen employs multi-layered integrity monitoring including real-time session forensics, code originality analysis, window focus tracking, and AI anomaly detection. Dynamic parameter generation ensures no two candidates receive identical inputs, while automated flags provide recruiters with clear, indisputable verification.',
    },
    {
      id: 'faq-2',
      question: 'How long does it take to set up and deploy our first assessment?',
      answer:
        'Most engineering and recruiting teams configure and dispatch their first role-specific assessment in under 15 minutes. You can select pre-vetted challenges from our curated library across 10+ languages or import your team’s custom MCQs and algorithmic coding tasks via CSV, JSON, or direct ATS sync.',
    },
    {
      id: 'faq-3',
      question: 'How is candidate code and proprietary evaluation data secured?',
      answer:
        'All data is encrypted in transit using TLS 1.3 and at rest using AES-256. Organizations operate in cryptographically isolated workspaces, preventing cross-tenant access. Candidate code runs in sandboxed ephemeral micro-VMs that are instantly destroyed upon execution completion.',
    },
    {
      id: 'faq-4',
      question: 'What billing cycles and payment methods are supported?',
      answer:
        'We support both monthly and annual billing cycles. Self-serve plans (Starter and Growth) can be paid immediately via corporate credit cards, debit cards, and UPI/net banking powered by Razorpay. Enterprise contracts are eligible for net-30 invoicing, custom purchase orders, and ACH wire transfers.',
    },
    {
      id: 'faq-5',
      question: 'What is your refund policy if our hiring needs change?',
      answer:
        'We offer a 14-day risk-free satisfaction guarantee for new self-serve subscriptions. If Vantrix Screen does not streamline your engineering assessment pipeline, contact support within 14 days of purchase for a prompt, full refund with no questions asked.',
    },
  ],
};
