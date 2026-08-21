import React, { useState } from 'react';
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  User, 
  CreditCard, 
  ShieldCheck, 
  MessageSquare, 
  Mail, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

// Sample FAQ Data
const faqData = [
  {
    category: 'account',
    question: 'How do I reset my password?',
    answer: 'Go to the login page and click on "Forgot Password". Enter your registered email address, and we will send you a password reset link.'
  },
  {
    category: 'billing',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay.'
  },
  {
    category: 'billing',
    question: 'How can I download my invoices?',
    answer: 'Navigate to Settings > Billing & Plans, scroll down to Invoice History, and click "Download PDF" next to the desired invoice.'
  },
  {
    category: 'general',
    question: 'Can I change my account subscription plan?',
    answer: 'Yes! You can upgrade or downgrade your subscription plan at any time from your Account Settings under the "Billing" tab.'
  }
];

// Sample Support Categories
const categories = [
  { id: 'getting-started', title: 'Getting Started', icon: BookOpen, count: '12 articles' },
  { id: 'account', title: 'Account Settings', icon: User, count: '8 articles' },
  { id: 'billing', title: 'Billing & Subscriptions', icon: CreditCard, count: '15 articles' },
  { id: 'security', title: 'Security & Privacy', icon: ShieldCheck, count: '6 articles' },
];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Filter FAQs based on search input
  const filteredFaqs = faqData.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-16">
      {/* Hero / Search Header */}
      <section className="bg-blue-600 text-white py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            How can we help you?
          </h1>
          <p className="text-blue-100 text-lg">
            Search our knowledge base or browse popular topics below.
          </p>

          {/* Search Input Bar */}
          <div className="relative max-w-xl mx-auto pt-4">
            <Search className="absolute left-4 top-7 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for answers (e.g., billing, reset password)..."
              className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 bg-white border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md transition"
            />
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        {/* Categories Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Topic</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition cursor-pointer flex flex-col items-start"
                >
                  <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{cat.title}</h3>
                  <p className="text-sm text-gray-500">{cat.count}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {searchTerm ? `Search Results (${filteredFaqs.length})` : 'Frequently Asked Questions'}
          </h2>

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No matching questions found.</p>
              <p className="text-gray-400 text-sm mt-1">Try tweaking your search terms or contact support.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden transition"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none focus:bg-gray-50"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4 pt-1 text-gray-600 border-t border-gray-100 bg-gray-50/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Contact Support Section */}
        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900">Still need help?</h3>
            <p className="text-gray-600 text-sm max-w-md">
              Our support team is available 24/7 to assist you with any questions or technical issues.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition shadow-sm">
              <MessageSquare className="h-4 w-4" />
              Live Chat
            </button>
            <button className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-5 py-2.5 rounded-lg transition shadow-sm">
              <Mail className="h-4 w-4" />
              Email Us
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}