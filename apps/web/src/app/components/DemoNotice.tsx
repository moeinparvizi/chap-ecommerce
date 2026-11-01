'use client';
import { resetDemo } from '../lib/demo';
export function DemoNotice() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') return null;
  return <aside aria-label="حالت نمایشی" style={{background:'#172554',color:'#fff',padding:'10px 16px',fontSize:12,display:'flex',gap:16,justifyContent:'center',alignItems:'center',flexWrap:'wrap'}}>
    <span>نسخهٔ نمایشی · اطلاعات ساختگی · پرداخت واقعی انجام نمی‌شود</span>
    <a href="/auth/login" style={{color:'#bfdbfe'}}>ورود به دمو</a>
    <button onClick={()=>{resetDemo();window.location.href='/';}} style={{border:'1px solid #93c5fd',borderRadius:6,padding:'3px 10px',color:'#fff',background:'transparent',cursor:'pointer'}}>بازنشانی دمو</button>
  </aside>;
}
