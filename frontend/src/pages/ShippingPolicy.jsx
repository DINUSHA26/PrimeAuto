// src/pages/ShippingPolicy.jsx
import PageHeader from '../components/PageHeader';

const ShippingPolicy = () => {
    return (
        <div className="bg-white min-h-screen">
            <PageHeader
                title="Shipping Policy"
                subtitle="How we deliver your automotive parts to your doorstep"
            />

            <div className="container mx-auto px-6 py-16 scroll-mt-20">
                <div className="max-w-4xl mx-auto space-y-12">
                    <section className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 border-l-4 border-blue-600 pl-4">Delivery Overview</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            At PrimeAuto, we understand that getting your vehicle back on the road is a priority. We offer reliable and efficient shipping services across Sri Lanka, ensuring your spare parts reach you in perfect condition and on time.
                        </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-bold mb-4 text-blue-600">Shipping Methods</h3>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 font-bold">•</span>
                                    <span>Standard Delivery (2-4 business days)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 font-bold">•</span>
                                    <span>Express Delivery (1-2 business days)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 font-bold">•</span>
                                    <span>Store Pickup (Available within 4 hours)</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-bold mb-4 text-blue-600">Shipping Costs</h3>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 font-bold">•</span>
                                    <span>Free delivery for orders over LKR 15,000</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 font-bold">•</span>
                                    <span>Flat rate of LKR 500 for standard delivery</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 font-bold">•</span>
                                    <span>Express shipping rates based on weight and distance</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <section className="bg-blue-600 text-white p-8 rounded-2xl shadow-xl">
                        <h2 className="text-2xl font-bold mb-4">Track Your Order</h2>
                        <p className="mb-6 opacity-90">
                            Once your order is dispatched, you will receive a tracking number via email and SMS. Use this number to monitor your shipment's progress in real-time.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                placeholder="Enter Tracking ID"
                                className="flex-1 px-6 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                            <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition shadow-lg">
                                Track Now
                            </button>
                        </div>
                    </section>

                    <section className="prose prose-blue max-w-none">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">Important Notes</h2>
                        <div className="space-y-4 text-gray-600 text-lg">
                            <p>
                                Delivery times are estimated and might vary due to external factors such as weather conditions or public holidays.
                            </p>
                            <p>
                                Please ensure someone is available to receive the package at the provided address. If our courier is unable to deliver after two attempts, the package will be returned to our warehouse.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicy;
