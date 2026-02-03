// src/components/PageHeader.jsx
const PageHeader = ({ title, subtitle }) => {
  return (
    <div className="relative bg-gray-900 overflow-hidden py-24 md:py-32">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-full bg-cyan-500/10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-6 relative z-10 text-center md:text-left">
        <div className="inline-block py-1 px-3 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
          PrimeAuto Solutions
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-4 text-white tracking-tight">
          {title.split(' ').map((word, i) => (
            <span key={i} className={i === 1 ? 'text-blue-500' : ''}>
              {word}{' '}
            </span>
          ))}
        </h1>
        {subtitle && (
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;