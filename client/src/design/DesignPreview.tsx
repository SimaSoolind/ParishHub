// DesignPreview — interaktiv prototyp av hela designsystemet
// Visar färger, typografi, komponenter och alla planerade skärmar
// Stödjer svenska + arabiska (RTL) och ljust + mörkt läge
//
// Öppnas på /design i webbläsaren. Detta är en referens/prototyp — inte
// produktionskod. Riktiga sidor byggs med Tailwind enligt CLAUDE.md.

import { useState } from "react";
import type { ReactNode, CSSProperties } from "react";

// Språk som stöds i prototypen
type Lang = "sv" | "ar";

const SV = {
  appName: "Kyrko-appen", appSub: "Digital förvaltning för din kyrka",
  tabs: ["🎨 Färger","✏️ Typografi","🧱 Komponenter","📱 Dashboard","👥 Medlemmar","⛪ Gudstjänst","📣 Kommunikation","📋 Planering","📝 Predikan","📺 Skärm-vy","📅 Kalender"],
  dashboard: { greeting: "God morgon, Fader Korollos", date: "Söndagen 22 juni 2025", stats: ["Medlemmar","Närvaro idag","Att kontakta"], birthday: "🎂 Födelsedag denna vecka", priority: "⚠️ Prioriterad kontaktlista" },
  members: { search: "Sök på namn...", all: "Alla 47", active: "Aktiva", youth: "Ungdom", choir: "Kör" },
  service: { morning: "Morgongudstjänst", present: "Närv.", absent: "Från.", ai: "AI-tolkning live", aiDesc: "Text visas på kyrkans skärm på svenska och arabiska.", startAI: "▶ Starta tolkning" },
  comm: { title: "Kommunikation", sms: "Skicka SMS", group: "Gruppmeddelande", templates: "Mallar", placeholder: "Skriv meddelande...", send: "Skicka", recipients: "Mottagare" },
  plan: { title: "Gudstjänstplanering", subtitle: "Söndagen 22 juni 2025 · Alla kan se · Präst och diakon kan redigera", addSection: "+ Lägg till sektion", save: "Spara plan", assigned: "Tilldelad", duration: "min", sections: ["Öppning","Bibelläsning","Predikan","Bön","Sång","Nattvard","Avslutning"] },
  sermon: { title: "Predikanarkiv", subtitle: "Gudstjänst 22 juni 2025", raw: "AI-transkription (obearbetad)", edited: "Redigerad version", edit: "Redigera", saveEdit: "Spara ändringar", youtube: "YouTube-länk", duration: "Längd: 42 minuter", copy: "Kopiera text" },
  screen: { title: "Skärm-vy — Projektor", subtitle: "Denna sida visas på kyrkans stora skärm via OBS Studio", active: "● LIVE", swedish: "Svenska", arabic: "Arabiska", obsGuide: "OBS-guide", obsStep1: "1. Ladda ner OBS Studio (gratis)", obsStep2: "2. Lägg till Browser Source", obsStep3: "3. Klistra in URL till denna sida", obsStep4: "4. Starta gudstjänsten — AI gör resten" },
  calendar: { title: "Kyrklig Kalender", subtitle: "Koptisk-ortodox kalender + Google Calendar", addEvent: "+ Ny händelse", sync: "Synkronisera Google Calendar", today: "Idag", upcoming: "Kommande", fasts: "Fastedagar", feasts: "Högtider" },
  badges: { present: "Närvarande", absent: "Frånvarande", notContacted: "Ej kontaktad", tried: "Försökt nå", gdpr: "GDPR ✓", encrypted: "🔒 Krypterat", family: "Familj: 3", admin: "Admin", pastor: "Pastor", deacon: "Diakon" },
  buttons: { call: "Ring Anna", email: "Mejla", edit: "Redigera", save: "Spara", cancel: "Avbryt", delete: "Radera", startAI: "Starta tolkning" },
};

const AR = {
  appName: "تطبيق الكنيسة", appSub: "إدارة رعية الكنيسة رقمياً",
  tabs: ["🎨 الألوان","✏️ الخطوط","🧱 المكوّنات","📱 الرئيسية","👥 الأعضاء","⛪ القداس","📣 التواصل","📋 التخطيط","📝 العظة","📺 الشاشة","📅 التقويم"],
  dashboard: { greeting: "صباح الخير، الأب كورولوس", date: "الأحد 22 يونيو 2025", stats: ["الأعضاء","الحاضرون","للتواصل"], birthday: "🎂 أعياد ميلاد هذا الأسبوع", priority: "⚠️ قائمة التواصل الأولوية" },
  members: { search: "ابحث عن عضو...", all: "الكل 47", active: "نشطون", youth: "الشباب", choir: "الجوقة" },
  service: { morning: "القداس الصباحي", present: "حاضر", absent: "غائب", ai: "الترجمة الفورية", aiDesc: "يعرض النص على شاشة الكنيسة بالعربية والسويدية معاً.", startAI: "▶ بدء الترجمة" },
  comm: { title: "التواصل", sms: "إرسال SMS", group: "رسالة جماعية", templates: "القوالب", placeholder: "اكتب الرسالة...", send: "إرسال", recipients: "المستلمون" },
  plan: { title: "تخطيط القداس", subtitle: "الأحد 22 يونيو 2025 · الجميع يرى · القسيس والشماس يعدّلان", addSection: "+ إضافة قسم", save: "حفظ الخطة", assigned: "المسؤول", duration: "د", sections: ["الافتتاح","القراءة","العظة","الصلاة","الترنيمة","القربان","الختام"] },
  sermon: { title: "أرشيف العظة", subtitle: "قداس 22 يونيو 2025", raw: "النص الأصلي (ذكاء اصطناعي)", edited: "النسخة المعدّلة", edit: "تعديل", saveEdit: "حفظ التعديلات", youtube: "رابط يوتيوب", duration: "المدة: 42 دقيقة", copy: "نسخ النص" },
  screen: { title: "عرض الشاشة — البروجيكتور", subtitle: "تُعرض هذه الصفحة على الشاشة الكبيرة عبر OBS Studio", active: "● مباشر", swedish: "السويدية", arabic: "العربية", obsGuide: "دليل OBS", obsStep1: "1. تنزيل OBS Studio (مجاناً)", obsStep2: "2. إضافة Browser Source", obsStep3: "3. لصق رابط هذه الصفحة", obsStep4: "4. ابدأ القداس — الذكاء الاصطناعي يتولى الباقي" },
  calendar: { title: "التقويم الكنسي", subtitle: "التقويم القبطي الأرثوذكسي + Google Calendar", addEvent: "+ حدث جديد", sync: "مزامنة Google Calendar", today: "اليوم", upcoming: "القادمة", fasts: "أيام الصوم", feasts: "الأعياد" },
  badges: { present: "حاضر", absent: "غائب", notContacted: "لم يتم التواصل", tried: "تمت المحاولة", gdpr: "GDPR ✓", encrypted: "🔒 مشفّر", family: "العائلة: 3", admin: "مسؤول", pastor: "قسيس", deacon: "شماس" },
  buttons: { call: "اتصل بآنا", email: "راسل", edit: "تعديل", save: "حفظ", cancel: "إلغاء", delete: "حذف", startAI: "بدء الترجمة" },
};

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400&family=Cairo:wght@400;600;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root{--bg:#F5F3EE;--surface:#FFFFFF;--surface-alt:#EEECEA;--border:#DDD9D0;--accent:#8B5E3C;--accent-hover:#A8743A;--text:#1A1C18;--text-muted:#6B6E60;--green:#3D6B3B;--red:#8B3A3A;--blue:#3A5E8B;--purple:#5A4A7A;--pink:#7A4060;--shadow:0 1px 4px rgba(0,0,0,0.08),0 4px 16px rgba(0,0,0,0.04);}
  [data-theme="dark"]{--bg:#181B16;--surface:#222520;--surface-alt:#2A2E27;--border:#363A2E;--accent:#C4956A;--accent-hover:#D4A97E;--text:#EAE7DE;--text-muted:#8E9180;--green:#5E8A5C;--red:#A05858;--blue:#5A7EA0;--purple:#7A6A9A;--pink:#9A6080;--shadow:0 1px 4px rgba(0,0,0,0.3),0 4px 16px rgba(0,0,0,0.2);}
`;

const TOKENS = [
  {token:"--bg",dark:"#181B16",light:"#F5F3EE",label:{sv:"Bakgrund",ar:"الخلفية"}},
  {token:"--surface",dark:"#222520",light:"#FFFFFF",label:{sv:"Yta / Kort",ar:"السطح"}},
  {token:"--border",dark:"#363A2E",light:"#DDD9D0",label:{sv:"Kanter",ar:"الحدود"}},
  {token:"--accent",dark:"#C4956A",light:"#8B5E3C",label:{sv:"★ Koppar",ar:"★ نحاسي"}},
  {token:"--text",dark:"#EAE7DE",light:"#1A1C18",label:{sv:"Text",ar:"النص"}},
  {token:"--text-muted",dark:"#8E9180",light:"#6B6E60",label:{sv:"Sekundär",ar:"ثانوي"}},
  {token:"--green",dark:"#5E8A5C",light:"#3D6B3B",label:{sv:"Närvarande",ar:"حاضر"}},
  {token:"--red",dark:"#A05858",light:"#8B3A3A",label:{sv:"Frånvarande",ar:"غائب"}},
  {token:"--blue",dark:"#5A7EA0",light:"#3A5E8B",label:{sv:"Info",ar:"معلومات"}},
  {token:"--purple",dark:"#7A6A9A",light:"#5A4A7A",label:{sv:"AI / Krypterat",ar:"ذكاء اصطناعي"}},
];

function Badge({ color, children }: { color: string; children: ReactNode }) {
  return <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:9999,padding:"3px 10px",fontSize:11,fontWeight:600}}>{children}</span>;
}

function Btn({ variant = "primary", children, size = "md", style = {}, onClick }: {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "green";
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  style?: CSSProperties;
  onClick?: () => void;
}) {
  const sz = { sm:{padding:"5px 12px",fontSize:12}, md:{padding:"8px 18px",fontSize:14}, lg:{padding:"11px 24px",fontSize:15} };
  const vr = {
    primary:{background:"var(--accent)",color:"#fff",border:"none"},
    secondary:{background:"transparent",color:"var(--accent)",border:"1.5px solid var(--accent)"},
    ghost:{background:"transparent",color:"var(--text-muted)",border:"1.5px solid var(--border)"},
    danger:{background:"transparent",color:"var(--red)",border:"1.5px solid var(--red)"},
    green:{background:"var(--green)",color:"#fff",border:"none"},
  };
  return <button onClick={onClick} style={{...vr[variant],...sz[size],borderRadius:8,cursor:"pointer",fontFamily:"var(--ff)",fontWeight:600,...style}}>{children}</button>;
}

function Card({ children, style = {} }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:14,padding:"16px 20px",boxShadow:"var(--shadow)",...style}}>{children}</div>;
}

function Avatar({ name, size = 40, status }: { name: string; size?: number; status?: string }) {
  const colors = ["var(--accent)","var(--green)","var(--blue)","var(--purple)"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <div style={{width:size,height:size,borderRadius:"50%",background:color+"22",border:`2px solid ${color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.4,color,fontWeight:600}}>{name[0]}</div>
      {status && <div style={{position:"absolute",bottom:1,right:1,width:size*0.28,height:size*0.28,borderRadius:"50%",background:status==="active"?"var(--green)":"var(--text-muted)",border:"2px solid var(--surface)"}}/>}
    </div>
  );
}

function StatCard({ label, value, color, icon }: { label: string; value: string; color: string; icon: ReactNode }) {
  return <div style={{background:color+"15",border:`1px solid ${color}33`,borderRadius:12,padding:"14px 10px",textAlign:"center",flex:1}}><div style={{fontSize:18,marginBottom:2}}>{icon}</div><div style={{fontSize:26,fontWeight:700,color,fontFamily:"JetBrains Mono"}}>{value}</div><div style={{fontSize:11,color:"var(--text-muted)",marginTop:2,lineHeight:1.3}}>{label}</div></div>;
}

function Section({ title, children }: { title: ReactNode; children: ReactNode }) {
  return <div style={{marginBottom:24}}><div style={{fontFamily:"Cormorant Garamond",fontSize:20,color:"var(--accent)",marginBottom:12,paddingBottom:6,borderBottom:"2px solid var(--border)",fontWeight:700}}>{title}</div>{children}</div>;
}

function LangSwitcher({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return <div style={{display:"flex",gap:4,background:"var(--surface-alt)",borderRadius:8,padding:3,border:"1px solid var(--border)"}}>{(["sv","ar"] as const).map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:"5px 14px",borderRadius:6,border:"none",cursor:"pointer",background:lang===l?"var(--accent)":"transparent",color:lang===l?"#fff":"var(--text-muted)",fontSize:12,fontWeight:600,fontFamily:l==="ar"?"Cairo":"Inter"}}>{l==="sv"?"🇸🇪 SV":"🇸🇦 AR"}</button>)}</div>;
}

const PLAN_SECTIONS = [
  {type:"opening",icon:"✝",title:{sv:"Öppning",ar:"الافتتاح"},assigned:{sv:"Fader Korollos",ar:"الأب كورولوس"},duration:10,role:"pastor"},
  {type:"reading",icon:"📖",title:{sv:"Bibelläsning",ar:"القراءة"},assigned:{sv:"Diakon Marcus",ar:"الشماس ماركوس"},duration:8,role:"deacon"},
  {type:"sermon",icon:"🎙️",title:{sv:"Predikan",ar:"العظة"},assigned:{sv:"Fader Korollos",ar:"الأب كورولوس"},duration:30,role:"pastor"},
  {type:"prayer",icon:"🙏",title:{sv:"Bön",ar:"الصلاة"},assigned:{sv:"Diakon Marcus",ar:"الشماس ماركوس"},duration:10,role:"deacon"},
  {type:"closing",icon:"🕊️",title:{sv:"Avslutning",ar:"الختام"},assigned:{sv:"Fader Korollos",ar:"الأب كورولوس"},duration:5,role:"pastor"},
];

const COPTIC_EVENTS = [
  {date:"22 jun",name:{sv:"Petrus och Paulus dag",ar:"عيد القديسين بطرس وبولس"},type:"feast",color:"var(--gold,#C4956A)"},
  {date:"29 jun",name:{sv:"Apostlarnas fastas slut",ar:"نهاية صوم الرسل"},type:"feast",color:"var(--green)"},
  {date:"7 jul",name:{sv:"Jungfru Marias högtid",ar:"عيد السيدة العذراء"},type:"feast",color:"var(--pink)"},
  {date:"15 jul",name:{sv:"Fastedagen (Nineveh)",ar:"صوم نينوى"},type:"fast",color:"var(--text-muted)"},
];

const SERMON_TEXT_SV = "Kära bröder och systrar i Kristus. Idag läser vi ur Johannes evangelium, kapitel 15. Jesus säger: Jag är vinträdet, ni är grenarna. Den som förblir i mig och jag i honom, han bär mycket frukt.";
const SERMON_TEXT_AR = "أحبائي في المسيح. نقرأ اليوم من إنجيل يوحنا الإصحاح الخامس عشر. يقول يسوع: أنا الكرمة وأنتم الأغصان. من يثبت فيّ وأنا فيه يأتي بثمر كثير.";

const LIVE_TEXT_SV = "من يثبت فيّ وأنا فيه يأتي بثمر كثير";
const LIVE_TEXT_AR = "Den som förblir i mig bär mycket frukt";

export default function DesignPreview() {
  const [dark,setDark] = useState(true);
  const [lang,setLang] = useState<Lang>("sv");
  const [page,setPage] = useState(0);
  const [liveActive,setLiveActive] = useState(false);
  const t = lang==="sv"?SV:AR;
  const isRTL = lang==="ar";
  const ff = isRTL?"Cairo,sans-serif":"Inter,sans-serif";

  return (
    <div data-theme={dark?"dark":"light"} dir={isRTL?"rtl":"ltr"} style={{minHeight:"100vh",background:"var(--bg)",color:"var(--text)",fontFamily:ff,"--ff":ff} as CSSProperties}>
      <style>{fonts}</style>

      {/* Header */}
      <div style={{background:"var(--surface)",borderBottom:"1px solid var(--border)",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10,gap:8,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:20}}>✝</span>
          <div>
            <div style={{fontFamily:"Cormorant Garamond",fontSize:18,color:"var(--accent)",fontWeight:700}}>{t.appName}</div>
            <div style={{fontSize:10,color:"var(--text-muted)"}}>{t.appSub}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <LangSwitcher lang={lang} setLang={setLang}/>
          <button onClick={()=>setDark(!dark)} style={{background:"var(--surface-alt)",border:"1px solid var(--border)",borderRadius:8,padding:"6px 10px",cursor:"pointer",color:"var(--text)",fontSize:12}}>{dark?"☀️":"🌙"}</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{background:"var(--surface)",borderBottom:"1px solid var(--border)",padding:"0 12px",display:"flex",gap:0,overflowX:"auto"}}>
        {t.tabs.map((p,i)=>(
          <button key={i} onClick={()=>setPage(i)} style={{background:"transparent",color:page===i?"var(--accent)":"var(--text-muted)",borderBottom:page===i?"2px solid var(--accent)":"2px solid transparent",border:"none",padding:"10px 10px",fontSize:11,fontFamily:ff,fontWeight:page===i?600:400,cursor:"pointer",whiteSpace:"nowrap"}}>{p}</button>
        ))}
      </div>

      <div style={{padding:"16px 14px",maxWidth:640,margin:"0 auto"}}>

        {/* COLORS */}
        {page===0&&<Section title={isRTL?"لوحة الألوان":"Färgpalett — Varm Olivsten"}><Card style={{padding:0,overflow:"hidden"}}>{TOKENS.map((tk,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 14px",borderBottom:"1px solid var(--border)"}}><div style={{width:36,height:36,borderRadius:8,flexShrink:0,background:dark?tk.dark:tk.light,border:"1px solid var(--border)"}}/><div style={{flex:1}}><div style={{fontSize:11,fontFamily:"JetBrains Mono",color:"var(--text)"}}>{tk.token}</div><div style={{fontSize:11,color:"var(--text-muted)"}}>{tk.label[lang]||tk.label.sv}</div></div><div style={{fontSize:11,fontFamily:"JetBrains Mono",color:"var(--text-muted)"}}>{dark?tk.dark:tk.light}</div></div>)}</Card></Section>}

        {/* TYPOGRAPHY */}
        {page===1&&<div><Section title={isRTL?"الخطوط":"Typografi"}><Card style={{marginBottom:12}}><div style={{fontFamily:"Cormorant Garamond",fontSize:32,color:"var(--accent)",fontWeight:700}}>{t.appName}</div><div style={{fontFamily:"Cormorant Garamond",fontSize:22,color:"var(--text)",fontWeight:600}}>{t.dashboard.greeting}</div></Card><Card style={{marginBottom:12}}><div style={{fontSize:16,fontWeight:600,color:"var(--text)",marginBottom:4}}>Anna Lindgren / آنا لندغرن</div><div style={{fontSize:14,color:"var(--text)",marginBottom:4}}>{isRTL?"يُظهر التطبيق تلقائياً أعياد الميلاد.":"Appen visar automatiskt vems födelsedag det är."}</div><div style={{fontSize:12,color:"var(--text-muted)"}}>{isRTL?"آخر تواصل · العائلة: 3 · GDPR ✓":"Senast kontaktad · Familj: 3 · GDPR ✓"}</div></Card><Card><div style={{fontFamily:"JetBrains Mono",fontSize:36,color:"var(--accent)"}}>47</div><div style={{fontFamily:"JetBrains Mono",fontSize:13,color:"var(--text)"}}>070-123 45 67</div></Card></Section></div>}

        {/* COMPONENTS */}
        {page===2&&<div>
          <Section title={isRTL?"أزرار":"Knappar"}><Card><div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}><Btn variant="primary">📞 {t.buttons.call}</Btn><Btn variant="secondary">{t.buttons.edit}</Btn><Btn variant="ghost">{t.buttons.cancel}</Btn><Btn variant="danger">{t.buttons.delete}</Btn></div></Card></Section>
          <Section title={isRTL?"شارات":"Badges"}><Card><div style={{display:"flex",gap:8,flexWrap:"wrap"}}><Badge color="var(--green)">{t.badges.present}</Badge><Badge color="var(--red)">{t.badges.absent}</Badge><Badge color="var(--blue)">{t.badges.gdpr}</Badge><Badge color="var(--purple)">{t.badges.encrypted}</Badge><Badge color="var(--accent)">{t.badges.pastor}</Badge><Badge color="var(--blue)">{t.badges.deacon}</Badge></div></Card></Section>
          <Section title="LanguageSwitcher"><Card><p style={{fontSize:13,color:"var(--text-muted)",marginBottom:10}}>{isRTL?"يغيّر اللغة واتجاه النص فوراً":"Byter språk och textriktning direkt"}</p><LangSwitcher lang={lang} setLang={setLang}/></Card></Section>
        </div>}

        {/* DASHBOARD */}
        {page===3&&<div>
          <div style={{fontSize:11,color:"var(--text-muted)",marginBottom:4,fontFamily:"JetBrains Mono"}}>{t.dashboard.date}</div>
          <div style={{fontFamily:"Cormorant Garamond",fontSize:20,color:"var(--accent)",marginBottom:16,fontWeight:700}}>{t.dashboard.greeting}</div>
          <div style={{display:"flex",gap:10,marginBottom:14}}><StatCard label={t.dashboard.stats[0]} value="47" color="var(--blue)" icon="👥"/><StatCard label={t.dashboard.stats[1]} value="38" color="var(--green)" icon="✓"/><StatCard label={t.dashboard.stats[2]} value="5" color="var(--red)" icon="⚠️"/></div>
          <Card style={{marginBottom:14}}><div style={{fontSize:12,color:"var(--pink,#9A6080)",fontWeight:700,marginBottom:10}}>{t.dashboard.birthday}</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0"}}><div><span style={{fontSize:14,fontWeight:600}}>{isRTL?"ماريا سفنسون":"Maria Svensson"}</span><span style={{fontSize:11,color:"var(--text-muted)",margin:"0 8px"}}>{isRTL?"تكمل 52 عاماً":"fyller 52 år"}</span></div><div style={{display:"flex",gap:8}}><span style={{fontSize:11,color:"var(--pink,#9A6080)",fontFamily:"JetBrains Mono"}}>{isRTL?"اليوم":"idag"}</span><span style={{cursor:"pointer",fontSize:16}}>📞</span></div></div></Card>
          <Card><div style={{fontSize:13,fontWeight:700,color:"var(--accent)",marginBottom:10}}>{t.dashboard.priority}</div>{[{name:isRTL?"آنا لندغرن":"Anna Lindgren",status:isRTL?"غائبة 3 أسابيع":"Frånvarande 3v",badge:t.badges.notContacted,bc:"var(--red)"},{name:isRTL?"لارس":"Lars Eriksson",status:isRTL?"غائب أسبوعين":"Frånv. 2v",badge:t.badges.tried,bc:"var(--blue)"}].map((m,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i===0?"1px solid var(--border)":"none"}}><div style={{display:"flex",gap:10,alignItems:"center"}}><Avatar name={m.name} size={34} status="away"/><div><div style={{fontSize:13,fontWeight:600}}>{m.name}</div><div style={{fontSize:11,color:"var(--text-muted)"}}>{m.status}</div></div></div><div style={{display:"flex",gap:8,alignItems:"center"}}><Badge color={m.bc}>{m.badge}</Badge><span style={{cursor:"pointer",fontSize:16}}>📞</span></div></div>)}</Card>
        </div>}

        {/* MEMBERS */}
        {page===4&&<div>
          <input placeholder={"🔍  "+t.members.search} style={{width:"100%",padding:"10px 14px",background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:12,color:"var(--text)",fontSize:13,fontFamily:ff,outline:"none",boxSizing:"border-box",marginBottom:12}}/>
          <Card style={{marginBottom:12}}><div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}><Badge color="var(--accent)">{t.members.all}</Badge><Badge color="var(--text-muted)">{t.members.active}</Badge><Badge color="var(--text-muted)">{t.members.youth}</Badge><Badge color="var(--text-muted)">{t.members.choir}</Badge></div>{[{name:isRTL?"آنا لندغرن":"Anna Lindgren",sub:isRTL?"العائلة: 3 · 🎂 5 أغسطس":"Familj: 3 · 🎂 5 aug",status:"away"},{name:isRTL?"ماريا سفنسون":"Maria Svensson",sub:isRTL?"منفردة · 🎂 اليوم":"Ensam · 🎂 Idag",status:"active"}].map((m,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid var(--border)"}}><Avatar name={m.name} size={38} status={m.status}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{m.name}</div><div style={{fontSize:11,color:"var(--text-muted)"}}>{m.sub}</div></div><div style={{display:"flex",gap:8}}><span style={{fontSize:16,cursor:"pointer"}}>📞</span><span style={{fontSize:16,cursor:"pointer"}}>✉️</span></div></div>)}</Card>
        </div>}

        {/* SERVICE */}
        {page===5&&<div>
          <Card style={{marginBottom:12}}><div style={{fontFamily:"Cormorant Garamond",color:"var(--accent)",fontSize:18,marginBottom:4,fontWeight:700}}>✝ {isRTL?"قداس — 22 يونيو 2025":"Gudstjänst — 22 juni 2025"}</div><div style={{fontSize:12,color:"var(--text-muted)",marginBottom:12}}>{t.service.morning} · 38/47</div>{[{name:isRTL?"آنا لندغرن":"Anna Lindgren",present:false},{name:isRTL?"ماريا سفنسون":"Maria Svensson",present:true},{name:isRTL?"يوهان بيرغ":"Johan Berg",present:true}].map((m,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid var(--border)"}}><span style={{fontSize:13}}>{m.name}</span><div style={{display:"flex",gap:6}}><button style={{background:m.present?"var(--green)"+"33":"transparent",border:`1.5px solid ${m.present?"var(--green)":"var(--border)"}`,color:m.present?"var(--green)":"var(--text-muted)",borderRadius:8,padding:"4px 10px",fontSize:11,cursor:"pointer",fontFamily:ff,fontWeight:600}}>✓ {t.service.present}</button><button style={{background:!m.present?"var(--red)"+"33":"transparent",border:`1.5px solid ${!m.present?"var(--red)":"var(--border)"}`,color:!m.present?"var(--red)":"var(--text-muted)",borderRadius:8,padding:"4px 10px",fontSize:11,cursor:"pointer",fontFamily:ff,fontWeight:600}}>✗ {t.service.absent}</button></div></div>)}</Card>
          <Card style={{background:"var(--purple)"+"15",borderColor:"var(--purple)"+"44"}}><div style={{fontSize:13,fontWeight:700,color:"var(--purple)",marginBottom:6}}>🤖 {t.service.ai}</div><div style={{fontSize:12,color:"var(--text-muted)",marginBottom:10}}>{t.service.aiDesc}</div><Btn variant="primary">{t.service.startAI}</Btn></Card>
        </div>}

        {/* COMMUNICATION */}
        {page===6&&<div>
          <Section title={t.comm.title}>
            <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}><Btn variant="primary" size="sm">💬 {t.comm.sms}</Btn><Btn variant="secondary" size="sm">👥 {t.comm.group}</Btn><Btn variant="ghost" size="sm">📋 {t.comm.templates}</Btn></div>
            <Card style={{marginBottom:12}}><div style={{fontSize:12,fontWeight:600,marginBottom:8,color:"var(--text-muted)"}}>{t.comm.recipients}</div><div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>{["Anna L.","Lars E.","Maria S."].map((n,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:4,background:"var(--accent)"+"22",borderRadius:9999,padding:"3px 8px"}}><span style={{fontSize:11,color:"var(--accent)",fontWeight:600}}>{n}</span><span style={{fontSize:13,cursor:"pointer",color:"var(--text-muted)"}}>×</span></div>)}</div><textarea placeholder={t.comm.placeholder} style={{width:"100%",background:"var(--surface-alt)",border:"1.5px solid var(--border)",borderRadius:10,padding:"10px 12px",color:"var(--text)",fontSize:13,fontFamily:ff,resize:"none",minHeight:70,outline:"none",boxSizing:"border-box",marginBottom:8}}/><div style={{display:"flex",justifyContent:"flex-end"}}><Btn variant="primary" size="sm">📤 {t.comm.send}</Btn></div></Card>
            <Card><div style={{fontSize:12,fontWeight:600,marginBottom:8,color:"var(--text-muted)"}}>📋 {t.comm.templates}</div>{[isRTL?"نفتقدك في القداس، نأمل أن تكون بخير.":"Vi saknar dig i gudstjänsten. Hoppas allt är bra!",isRTL?"عيد ميلاد سعيد! نصلي من أجلك 🙏":"Grattis på födelsedagen! Vi ber för dig. 🙏"].map((tmpl,i)=><div key={i} style={{padding:"8px 10px",background:"var(--surface-alt)",borderRadius:8,marginBottom:6,cursor:"pointer",border:"1px solid var(--border)"}}><div style={{fontSize:12,color:"var(--text)",lineHeight:1.5}}>{tmpl}</div></div>)}</Card>
          </Section>
        </div>}

        {/* PLANERING */}
        {page===7&&<div>
          <Section title={t.plan.title}>
            <div style={{fontSize:12,color:"var(--text-muted)",marginBottom:12}}>{t.plan.subtitle}</div>
            {PLAN_SECTIONS.map((s,i)=>(
              <Card key={i} style={{marginBottom:8,borderLeft:isRTL?"none":"4px solid "+(s.role==="pastor"?"var(--accent)":"var(--blue)"),borderRight:isRTL?"4px solid "+(s.role==="pastor"?"var(--accent)":"var(--blue)"):"none"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontSize:20}}>{s.icon}</span>
                    <div>
                      <div style={{fontSize:14,fontWeight:600,color:"var(--text)"}}>{s.title[lang]||s.title.sv}</div>
                      <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
                        <Badge color={s.role==="pastor"?"var(--accent)":"var(--blue)"}>{s.assigned[lang]||s.assigned.sv}</Badge>
                        <Badge color="var(--text-muted)">⏱ {s.duration} {t.plan.duration}</Badge>
                      </div>
                    </div>
                  </div>
                  <button style={{background:"transparent",border:"1px solid var(--border)",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:11,color:"var(--text-muted)",fontFamily:ff}}>{t.buttons.edit}</button>
                </div>
              </Card>
            ))}
            <div style={{display:"flex",gap:8,marginTop:4}}>
              <Btn variant="ghost" size="sm">{t.plan.addSection}</Btn>
              <Btn variant="primary" size="sm">{t.plan.save}</Btn>
            </div>
          </Section>
        </div>}

        {/* PREDIKAN */}
        {page===8&&<div>
          <Section title={t.sermon.title}>
            <div style={{fontSize:12,color:"var(--text-muted)",marginBottom:12}}>{t.sermon.subtitle}</div>
            <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
              <Badge color="var(--green)">✅ {isRTL?"محفوظ":"Sparad"}</Badge>
              <Badge color="var(--text-muted)">⏱ {t.sermon.duration}</Badge>
              <Badge color="var(--purple)">🤖 AI</Badge>
            </div>
            <Card style={{marginBottom:10}}>
              <div style={{fontSize:12,fontWeight:600,color:"var(--text-muted)",marginBottom:8}}>📝 {t.sermon.raw}</div>
              <div style={{fontSize:13,color:"var(--text)",lineHeight:1.7,marginBottom:10}}>{lang==="ar"?SERMON_TEXT_AR:SERMON_TEXT_SV}</div>
              <div style={{display:"flex",gap:6}}><Btn variant="ghost" size="sm">📋 {t.sermon.copy}</Btn></div>
            </Card>
            <Card style={{borderColor:"var(--green)44"}}>
              <div style={{fontSize:12,fontWeight:600,color:"var(--green)",marginBottom:8}}>✏️ {t.sermon.edited}</div>
              <textarea style={{width:"100%",background:"var(--surface-alt)",border:"1.5px solid var(--border)",borderRadius:10,padding:"10px 12px",color:"var(--text)",fontSize:13,fontFamily:ff,resize:"none",minHeight:80,outline:"none",boxSizing:"border-box",marginBottom:8}} defaultValue={lang==="ar"?SERMON_TEXT_AR:SERMON_TEXT_SV}/>
              <div style={{display:"flex",gap:8,justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",gap:6,alignItems:"center"}}><span style={{fontSize:12,color:"var(--text-muted)"}}>📺 YouTube:</span><input placeholder="https://youtube.com/..." style={{background:"var(--surface-alt)",border:"1px solid var(--border)",borderRadius:6,padding:"4px 8px",color:"var(--text)",fontSize:12,fontFamily:ff,outline:"none",width:200}}/></div>
                <Btn variant="primary" size="sm">{t.sermon.saveEdit}</Btn>
              </div>
            </Card>
          </Section>
        </div>}

        {/* SKÄRM-VY */}
        {page===9&&<div>
          <div style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{fontFamily:"Cormorant Garamond",fontSize:20,color:"var(--accent)",fontWeight:700}}>📺 {t.screen.title}</div>
              {liveActive&&<Badge color="var(--red)">{t.screen.active}</Badge>}
            </div>
            <div style={{fontSize:12,color:"var(--text-muted)",marginBottom:12}}>{t.screen.subtitle}</div>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              <Btn variant={liveActive?"danger":"primary"} onClick={()=>setLiveActive(!liveActive)}>{liveActive?(isRTL?"⏹ إيقاف":"⏹ Stoppa"):(isRTL?"▶ بدء البث":"▶ Starta sändning")}</Btn>
              <Btn variant="ghost" size="md">{t.screen.obsGuide}</Btn>
            </div>
          </div>

          {/* Live preview */}
          <div style={{background:"#0a0a0a",borderRadius:14,padding:"24px 20px",marginBottom:12,border:"2px solid "+(liveActive?"var(--red)":"var(--border)"),minHeight:160,display:"flex",flexDirection:"column",justifyContent:"center",gap:16}}>
            {liveActive?(
              <>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:10,color:"#666",textTransform:"uppercase",letterSpacing:2,marginBottom:6}}>🇸🇪 {t.screen.swedish}</div>
                  <div style={{fontFamily:"Cormorant Garamond",fontSize:22,color:"#EAE7DE",fontWeight:700,lineHeight:1.4}}>{LIVE_TEXT_AR}</div>
                </div>
                <div style={{height:1,background:"#333"}}/>
                <div dir="rtl" style={{textAlign:"center"}}>
                  <div style={{fontSize:10,color:"#666",textTransform:"uppercase",letterSpacing:2,marginBottom:6}}>🇸🇦 {t.screen.arabic}</div>
                  <div style={{fontFamily:"Cairo",fontSize:22,color:"#C4956A",fontWeight:700,lineHeight:1.5}}>{LIVE_TEXT_SV}</div>
                </div>
              </>
            ):(
              <div style={{textAlign:"center",color:"#444",fontSize:13}}>{isRTL?"انقر 'بدء البث' لتفعيل النص المباشر":"Klicka 'Starta sändning' för att aktivera live-text"}</div>
            )}
          </div>

          <Card>
            <div style={{fontSize:12,fontWeight:600,color:"var(--blue)",marginBottom:10}}>🎬 OBS Studio</div>
            {[t.screen.obsStep1,t.screen.obsStep2,t.screen.obsStep3,t.screen.obsStep4].map((step,i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"6px 0",fontSize:12,color:"var(--text)",borderBottom:i<3?"1px solid var(--border)":"none"}}>
                <span style={{color:"var(--blue)",fontWeight:700,fontFamily:"JetBrains Mono",fontSize:13}}>{i+1}</span>
                {step.substring(3)}
              </div>
            ))}
          </Card>
        </div>}

        {/* KALENDER */}
        {page===10&&<div>
          <Section title={t.calendar.title}>
            <div style={{fontSize:12,color:"var(--text-muted)",marginBottom:12}}>{t.calendar.subtitle}</div>
            <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
              <Btn variant="primary" size="sm">🔄 {t.calendar.sync}</Btn>
              <Btn variant="ghost" size="sm">+ {t.calendar.addEvent}</Btn>
            </div>

            <Card style={{marginBottom:10,borderColor:"var(--gold,#C4956A)"+"44"}}>
              <div style={{fontSize:12,fontWeight:700,color:"var(--accent)",marginBottom:10}}>✝ {t.calendar.feasts} & {t.calendar.fasts}</div>
              {COPTIC_EVENTS.map((ev,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<COPTIC_EVENTS.length-1?"1px solid var(--border)":"none"}}>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:ev.type==="feast"?"var(--accent)":"var(--text-muted)",flexShrink:0}}/>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>{ev.name[lang]||ev.name.sv}</div>
                      <div style={{fontSize:11,color:"var(--text-muted)"}}>{ev.type==="feast"?(isRTL?"عيد":"Högtid"):(isRTL?"صوم":"Fasta")}</div>
                    </div>
                  </div>
                  <div style={{fontSize:11,fontFamily:"JetBrains Mono",color:"var(--accent)"}}>{ev.date}</div>
                </div>
              ))}
            </Card>

            <Card>
              <div style={{fontSize:12,fontWeight:700,color:"var(--blue)",marginBottom:10}}>📅 {t.calendar.upcoming}</div>
              {[{icon:"💧",title:{sv:"Dop — Familjen Svensson",ar:"معمودية — عائلة سفنسون"},date:"29 jun"},{icon:"💍",title:{sv:"Bröllop — Maria & Johan",ar:"زواج — ماريا ويوهان"},date:"15 jul"}].map((ev,i)=>(
                <div key={i} style={{display:"flex",gap:12,alignItems:"center",padding:"8px 0",borderBottom:i===0?"1px solid var(--border)":"none"}}>
                  <span style={{fontSize:22}}>{ev.icon}</span>
                  <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>{ev.title[lang]||ev.title.sv}</div></div>
                  <div style={{fontSize:11,fontFamily:"JetBrains Mono",color:"var(--blue)"}}>{ev.date}</div>
                </div>
              ))}
            </Card>
          </Section>
        </div>}

      </div>
    </div>
  );
}
