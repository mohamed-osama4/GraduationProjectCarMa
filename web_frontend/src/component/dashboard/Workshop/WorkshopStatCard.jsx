const WorkshopStatCard = ({ title, keyValue, icon: Icon, colorClass, bgClass ,data }) => {

  return (
    <div className="bg-[#121212] p-4 lg:p-5 rounded-[2rem] shadow-2xl border border-white/5 flex  items-center justify-between text-center hover:border-[#D9B07C]/20 hover:-translate-y-1 transition-all duration-300 h-full relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-16 h-16 bg-[#D9B07C]/5 blur-2xl rounded-full -mr-8 -mt-8 group-hover:bg-[#D9B07C]/10 transition-all"></div>
      <div className={`p-2.5 rounded-2xl mb-3 relative z-10 transition-transform duration-500 group-hover:rotate-12 ${bgClass} ${colorClass}`}>
        <Icon size={22} strokeWidth={2.5} />
      </div>
      <div  className='flex flex-col gap-[6px]'>
      <p className="text-slate-500 font-bold text-[11px] uppercase tracking-widest mb-1 relative z-10">{title}</p>
      <h3 className="text-[28px] font-black text-white tracking-tight leading-none mt-1 relative z-10">{data.stats[keyValue]}</h3>
      </div>
    </div>
  );
};

export default WorkshopStatCard;