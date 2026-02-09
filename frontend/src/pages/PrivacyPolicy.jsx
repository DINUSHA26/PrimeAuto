// src/pages/PrivacyPolicy.jsx
import PageHeader from '../components/PageHeader';

const PrivacyPolicy = () => {
    const lastUpdated = "February 09, 2026";

    return (
        <div className="bg-white min-h-screen">
            <PageHeader
                title="Privacy Policy"
                subtitle="How we handle and protect your personal information"
            />

            <div className="container mx-auto px-6 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="text-sm text-gray-500 mb-8 font-medium">
                        Last Updated: {lastUpdated}
                    </div>

                    <div className="prose prose-blue max-w-none space-y-12">
                        <section>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Introduction</h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                At PrimeAuto, we take your privacy seriously. This policy describes how we collect, use, and share your personal information when you visit our website or use our services. By using PrimeAuto, you agree to the practices described in this policy.
                            </p>
                        </section>

                        <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                                Information We Collect
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-bold text-blue-600 mb-3 uppercase tracking-wider text-sm">Directly Provided</h3>
                                    <ul className="space-y-2 text-gray-600">
                                        <li>• Name and contact details</li>
                                        <li>• Vehicle information (VIN, Make, Model)</li>
                                        <li>• Shipping and billing addresses</li>
                                        <li>• Payment information (processed securely)</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-bold text-blue-600 mb-3 uppercase tracking-wider text-sm">Automatically Collected</h3>
                                    <ul className="space-y-2 text-gray-600">
                                        <li>• IP address and browser type</li>
                                        <li>• Device information</li>
                                        <li>• Browsing history on our site</li>
                                        <li>• Cookie preferences</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Use Your Data</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    "To process and deliver your orders",
                                    "To book and manage service appointments",
                                    "To send order status and tracking info",
                                    "To improve our products and services",
                                    "To communicate special offers (if opted in)",
                                    "To prevent fraudulent transactions"
                                ].map((text, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                            {i + 1}
                                        </div>
                                        <span className="text-gray-700">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="border-t border-gray-100 pt-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Measures</h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                We implement industry-standard security measures to protect your personal information. All sensitive data is encrypted using Secure Socket Layer (SSL) technology and stored behind firewalls. We do not store full credit card information on our servers.
                            </p>
                        </section>

                        <section className="bg-gray-900 text-white p-10 rounded-3xl">
                            <h2 className="text-2xl font-bold mb-6">Your Rights</h2>
                            <p className="mb-6 opacity-80">You have the right to access, correct, or delete your personal data at any time. You can also object to processing your data for marketing purposes.</p>
                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="flex-1 p-6 bg-white/5 rounded-2xl border border-white/10">
                                    <h3 className="font-bold mb-2">Request Data</h3>
                                    <p className="text-sm opacity-60">Request a full copy of your personal data stored with us.</p>
                                </div>
                                <div className="flex-1 p-6 bg-white/5 rounded-2xl border border-white/10">
                                    <h3 className="font-bold mb-2">Delete Account</h3>
                                    <p className="text-sm opacity-60">Permanently remove all your account data from PrimeAuto.</p>
                                </div>
                            </div>
                        </section>

                        <div className="text-center pt-8">
                            <p className="text-gray-500 mb-4">Questions about our Privacy Policy?</p>
                            <a href="mailto:privacy@primeauto.com" className="text-blue-600 font-bold hover:underline">
                                privacy@primeauto.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
