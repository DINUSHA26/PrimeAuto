// src/pages/ReturnsExchanges.jsx
import PageHeader from '../components/PageHeader';
import { FaUndoAlt, FaExchangeAlt, FaShieldAlt } from 'react-icons/fa';

const ReturnsExchanges = () => {
    return (
        <div className="bg-white min-h-screen">
            <PageHeader
                title="Returns & Exchanges"
                subtitle="Our commitment to your satisfaction and peace of mind"
            />

            <div className="container mx-auto px-6 py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <FaUndoAlt className="text-blue-600 text-xl" />
                            </div>
                            <h3 className="font-bold mb-2">7 Days Return</h3>
                            <p className="text-sm text-gray-500">Easy returns within 7 business days</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <FaExchangeAlt className="text-green-600 text-xl" />
                            </div>
                            <h3 className="font-bold mb-2">Quick Exchange</h3>
                            <p className="text-sm text-gray-500">Fast replacement for faulty parts</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <FaShieldAlt className="text-purple-600 text-xl" />
                            </div>
                            <h3 className="font-bold mb-2">Warranty Cover</h3>
                            <p className="text-sm text-gray-500">Manufacturer warranty support</p>
                        </div>
                    </div>

                    <div className="space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-l-4 border-blue-600 pl-4">Return Conditions</h2>
                            <div className="bg-gray-50 p-8 rounded-2xl space-y-4">
                                <p className="text-gray-600 leading-relaxed">To be eligible for a return or exchange, your item must meet the following criteria:</p>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        "Item must be unused and in original condition",
                                        "Original packaging must be intact",
                                        "Include all manuals, accessories and cables",
                                        "Proof of purchase (invoice) is required",
                                        "No damage caused by improper installation",
                                        "Security seals must not be broken"
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-center gap-3 text-gray-700">
                                            <span className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white">✓</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="text-xl font-bold mb-4 text-gray-900">Non-Returnable Items</h3>
                                <ul className="space-y-3 text-gray-500">
                                    <li>• Electrical components that have been installed</li>
                                    <li>• Custom-made or specially ordered parts</li>
                                    <li>• Items without their original packaging</li>
                                    <li>• Maintenance fluids (oils, coolants, etc.)</li>
                                </ul>
                            </div>
                            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="text-xl font-bold mb-4 text-gray-900">Processing Time</h3>
                                <p className="text-gray-600 mb-4">
                                    Once we receive and inspect your returned item, we will process your refund or exchange within:
                                </p>
                                <div className="font-bold text-blue-600">3-5 Business Days</div>
                            </div>
                        </section>

                        <section className="bg-gray-900 text-white p-10 rounded-3xl text-center">
                            <h2 className="text-3xl font-bold mb-4">Need help with a return?</h2>
                            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                                Our support team is available to guide you through the return process or answer any specific questions you might have.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 font-bold rounded-xl transition shadow-lg">
                                    Start Return Request
                                </button>
                                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 font-bold rounded-xl transition backdrop-blur-sm border border-white/20">
                                    Contact Support
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReturnsExchanges;
