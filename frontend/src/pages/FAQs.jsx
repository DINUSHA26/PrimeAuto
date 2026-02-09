// src/pages/FAQs.jsx
import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { FaChevronDown, FaSearch } from 'react-icons/fa';

const FAQs = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const faqData = [
        {
            category: "Ordering & Delivery",
            questions: [
                {
                    q: "How long does delivery take?",
                    a: "Standard delivery within Colombo and suburbs takes 1-2 business days. Outstation deliveries typically take 3-4 business days."
                },
                {
                    q: "Do you offer cash on delivery?",
                    a: "Yes, we offer Cash on Delivery for orders up to LKR 50,000. For higher amounts, we require online payment or bank transfer."
                },
                {
                    q: "Can I track my order?",
                    a: "Absoluteley! Once your order is shipped, you will receive a tracking link via SMS or email to monitor your package."
                }
            ]
        },
        {
            category: "Parts & Compatibility",
            questions: [
                {
                    q: "Are your parts genuine?",
                    a: "We offer both genuine (OEM) parts and high-quality aftermarket alternatives. Each product page clearly specifies the brand and origin."
                },
                {
                    q: "How do I know if a part fits my car?",
                    a: "You can use our vehicle search tool on the products page. Enter your car's make, model, and year to find compatible parts."
                },
                {
                    q: "What if the part doesn't fit?",
                    a: "If the part is recommended by us and doesn't fit, we offer a 100% money-back guarantee or an immediate exchange."
                }
            ]
        },
        {
            category: "Service & Maintenance",
            questions: [
                {
                    q: "How do I book a service appointment?",
                    a: "You can book directly through our 'Book Service' page. Choose your service, select a date and time, and we'll confirm via SMS."
                },
                {
                    q: "Do you provide a warranty on repairs?",
                    a: "Yes, all our services come with a 3-month or 5,000km warranty, whichever comes first."
                }
            ]
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <PageHeader
                title="Frequently Asked Questions"
                subtitle="Everything you need to know about our products and services"
            />

            <div className="container mx-auto px-6 py-16">
                <div className="max-w-3xl mx-auto">
                    {/* Search Bar */}
                    <div className="relative mb-12">
                        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
                        />
                    </div>

                    <div className="space-y-12">
                        {faqData.map((category, catIndex) => (
                            <div key={catIndex}>
                                <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                                    <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
                                    {category.category}
                                </h2>
                                <div className="space-y-4">
                                    {category.questions.map((faq, qIndex) => {
                                        const globalIndex = `${catIndex}-${qIndex}`;
                                        const isOpen = openIndex === globalIndex;

                                        return (
                                            <div
                                                key={qIndex}
                                                className={`bg-white rounded-2xl border transition-all duration-300 ${isOpen ? 'border-blue-200 shadow-lg' : 'border-gray-100 shadow-sm'}`}
                                            >
                                                <button
                                                    onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                                                    className="w-full px-8 py-6 flex items-center justify-between text-left"
                                                >
                                                    <span className={`font-bold text-lg ${isOpen ? 'text-blue-600' : 'text-gray-700'}`}>
                                                        {faq.q}
                                                    </span>
                                                    <FaChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : 'text-gray-400'}`} />
                                                </button>
                                                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                                                    <div className="px-8 pb-8 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                                                        {faq.a}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 text-center bg-blue-600 rounded-3xl p-12 text-white shadow-2xl">
                        <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
                        <p className="mb-8 opacity-90 text-lg">
                            Our support team is here to help you 24/7.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <a href="mailto:support@primeauto.com" className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition shadow-lg">
                                Email Us
                            </a>
                            <a href="tel:+94729044825" className="px-8 py-4 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition shadow-lg">
                                Call Now
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQs;
