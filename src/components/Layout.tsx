import { BookOpen, Leaf, Menu, X } from './Icons'
import { useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

const nav = [
  ['/', '首页'],
  ['/groups', '六类人群'],
  ['/survey', '需求调查'],
  ['/results', '推荐结果'],
  ['/evidence', '文献依据'],
]

export default function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen bg-[#f7f5ef] paper-noise">
      <header className="sticky top-0 z-40 border-b border-pine-100/80 bg-[#f7f5ef]/90 backdrop-blur-xl">
        <div className="page-shell flex h-20 items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-pine-800 text-white"><Leaf size={21} /></span>
            <span><strong className="block font-serif text-xl text-pine-900">森愈智行</strong><small className="hidden text-[10px] tracking-[.18em] text-pine-700 sm:block">FOREST WELLBEING LAB</small></span>
          </NavLink>
          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-semibold transition ${isActive ? 'bg-pine-800 text-white' : 'text-pine-800 hover:bg-pine-100'}`}>{label}</NavLink>)}
          </nav>
          <button className="rounded-xl p-2 text-pine-900 lg:hidden" onClick={() => setOpen(!open)} aria-label="切换导航">{open ? <X /> : <Menu />}</button>
        </div>
        {open && <nav className="page-shell grid gap-2 border-t border-pine-100 py-4 lg:hidden">{nav.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `rounded-xl px-4 py-3 text-sm font-semibold ${isActive ? 'bg-pine-800 text-white' : 'text-pine-800'}`}>{label}</NavLink>)}</nav>}
      </header>
      <main>{children}</main>
      <footer className="mt-20 bg-pine-900 text-pine-50">
        <div className="page-shell grid gap-8 py-12 md:grid-cols-[1fr_auto] md:items-end">
          <div><div className="flex items-center gap-2 font-serif text-2xl font-bold"><Leaf size={22} />森愈智行</div><p className="mt-3 max-w-xl text-sm leading-7 text-pine-100">本系统是基于本地知识库的研究与设计原型，不提供医疗诊断或疗效承诺。出行前需核实开放、天气、交通与个人安全条件。</p></div>
          <NavLink to="/evidence" className="flex items-center gap-2 text-sm font-bold"><BookOpen size={17} />查看证据边界</NavLink>
        </div>
      </footer>
    </div>
  )
}

