import { useState, useEffect, type FC, type FormEvent } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithCustomToken,
  type User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  deleteDoc,
  query
} from 'firebase/firestore';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts';
import { 
  Plus, Trash2, LayoutDashboard, Settings, 
  BarChart3, Eye, Share2, LogOut, ShieldCheck, ChevronRight
} from 'lucide-react';

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU (TYPES) ---
interface LinkItem {
  id: string;
  title: string;
  url: string;
  createdAt: number;
}

interface ChartDataItem {
  name: string;
  value: number;
}

interface ChartItem {
  id: string;
  title: string;
  type: string;
  data: ChartDataItem[];
  createdAt: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

// ==========================================================
// 1. CẤU HÌNH FIREBASE
// ==========================================================
const firebaseConfig = {
  apiKey: "AIzaSyDOJ1KbVyIrXBhG3OeRjRaUzkKo5_PQVTs",
  authDomain: "marketinghub-69e93.firebaseapp.com",
  projectId: "marketinghub-69e93",
  storageBucket: "marketinghub-69e93.firebasestorage.app",
  messagingSenderId: "431588070601",
  appId: "1:431588070601:web:9288d08be6f72f53546918"
};

// ==========================================================
// 2. CẤU HÌNH ADMIN & GIAO DIỆN
// ==========================================================
const DEFAULT_ADMIN_EMAIL = "minhpv@thangloigroup.vn"; 
const COLORS = ['#7C3AED', '#A78BFA', '#8B5CF6', '#DDD6FE', '#4C1D95', '#6366F1'];

// Khởi tạo Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const googleProvider = new GoogleAuthProvider();
const APP_IDENTIFIER = 'marketing-hub-v2-production';

// --- CÁC THÀNH PHẦN HỖ TRỢ ---

const CustomTooltip: FC<TooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-3 border border-purple-100 rounded-xl shadow-xl ring-1 ring-purple-500/10 text-left">
        <p className="font-serif font-bold text-purple-900 text-sm">{label}</p>
        <p className="text-purple-600 font-medium text-xs">
          {Number(payload[0].value).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const RenderChart: FC<{ chart: ChartItem }> = ({ chart }) => {
  const commonProps = { data: chart.data, margin: { top: 20, right: 20, left: 0, bottom: 0 } };
  if (!chart || !chart.data) return null;

  switch (chart.type) {
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart {...commonProps}>
            <defs>
              <linearGradient id={`grad-${chart.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity={1}/>
                <stop offset="100%" stopColor="#C084FC" stopOpacity={0.6}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f3ff" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#7C3AED', fontSize: 10}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#7C3AED', fontSize: 10}} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: '#f3e8ff'}} />
            <Bar dataKey="value" fill={`url(#grad-${chart.id})`} radius={[8, 8, 0, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      );
    case 'line':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f3ff" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#7C3AED', fontSize: 10}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#7C3AED', fontSize: 10}} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="value" stroke="#7C3AED" strokeWidth={3} dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: '#7C3AED' }} />
          </LineChart>
        </ResponsiveContainer>
      );
    case 'pie':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chart.data} innerRadius={60} outerRadius={85} paddingAngle={10} dataKey="value">
              {chart.data.map((_entry: ChartDataItem, i: number) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '10px'}} />
          </PieChart>
        </ResponsiveContainer>
      );
    default:
      return null;
  }
};

// --- THÀNH PHẦN CHÍNH ỨNG DỤNG ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'public' | 'admin'>('public'); 
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [charts, setCharts] = useState<ChartItem[]>([]);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  const [newLink, setNewLink] = useState<{title: string, url: string}>({ title: '', url: '' });
  const [newChart, setNewChart] = useState<{title: string, type: string, dataInput: string}>({ 
    title: '', 
    type: 'bar', 
    dataInput: 'Tháng 1: 450, Tháng 2: 620, Tháng 3: 580' 
  });

  const isAdmin = user && user.email === DEFAULT_ADMIN_EMAIL;

  // (1) Khởi tạo Xác thực
  useEffect(() => {
    const initAuth = async () => {
      try {
        const globalToken = (window as any).__initial_auth_token;
        const initialToken = typeof globalToken !== 'undefined' ? globalToken : null;
        
        if (initialToken) {
          try {
            await signInWithCustomToken(auth, initialToken);
          } catch (tokenErr) {
            console.warn("Mã xác thực không khớp, đang chuyển sang chế độ ẩn danh...");
            await signInAnonymously(auth);
          }
        } else if (!auth.currentUser) {
          await signInAnonymously(auth);
        }
      } catch (err: any) {
        console.warn("Chế độ ẩn danh chưa được kích hoạt:", err.code);
        if (err.code === 'auth/admin-restricted-operation' || err.code === 'auth/operation-not-allowed') {
          setInitError('firebase-config');
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email === DEFAULT_ADMIN_EMAIL) {
        setView('admin');
        setShowAuthModal(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // (2) Đồng bộ dữ liệu Firestore
  useEffect(() => {
    if (!user) return;

    const linksRef = collection(db, 'artifacts', APP_IDENTIFIER, 'public', 'data', 'links');
    const chartsRef = collection(db, 'artifacts', APP_IDENTIFIER, 'public', 'data', 'charts');

    const unsubLinks = onSnapshot(query(linksRef), (snapshot) => {
      const data = snapshot.docs.map(d => {
        const docData = d.data();
        return {
          id: d.id,
          title: String(docData.title || ''),
          url: String(docData.url || ''),
          createdAt: Number(docData.createdAt || 0)
        } as LinkItem;
      });
      setLinks(data);
    }, (err) => console.error("Lỗi đồng bộ links:", err));

    const unsubCharts = onSnapshot(query(chartsRef), (snapshot) => {
      const data = snapshot.docs.map(d => {
        const docData = d.data();
        return {
          id: d.id,
          title: String(docData.title || ''),
          type: String(docData.type || 'bar'),
          data: (docData.data || []).map((item: any) => ({
            name: String(item.name || ''),
            value: Number(item.value || 0)
          })),
          createdAt: Number(docData.createdAt || 0)
        } as ChartItem;
      });
      setCharts(data);
    }, (err) => console.error("Lỗi đồng bộ charts:", err));

    return () => {
      unsubLinks();
      unsubCharts();
    };
  }, [user]);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setAuthError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/unauthorized-domain') {
        setAuthError("Lỗi: Domain này chưa được ủy quyền trong Firebase Console.");
      } else {
        setAuthError("Đăng nhập thất bại: " + err.message);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setView('public');
    try { await signInAnonymously(auth); } catch (e) { console.error(e); }
  };

  const handleAddLink = async (e: FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !newLink.title || !newLink.url) return;
    try {
      const linksRef = collection(db, 'artifacts', APP_IDENTIFIER, 'public', 'data', 'links');
      const payload: any = { 
        title: String(newLink.title), 
        url: String(newLink.url), 
        createdAt: Number(Date.now()) 
      };
      await addDoc(linksRef, payload);
      setNewLink({ title: '', url: '' });
    } catch (err) { console.error(err); }
  };

  const handleDeleteLink = async (id: string) => {
    if (!isAdmin) return;
    try {
      await deleteDoc(doc(db, 'artifacts', APP_IDENTIFIER, 'public', 'data', 'links', id));
    } catch (err) { console.error(err); }
  };

  const handleAddChart = async (e: FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !newChart.title || !newChart.dataInput) return;
    try {
      const chartsRef = collection(db, 'artifacts', APP_IDENTIFIER, 'public', 'data', 'charts');
      const formattedData: ChartDataItem[] = newChart.dataInput.split(',').map(item => {
        const parts = item.split(':');
        return { 
          name: String(parts[0]?.trim() || '?'), 
          value: Number(parts[1]?.trim() || 0)
        };
      });
      const payload: any = { 
        title: String(newChart.title), 
        type: String(newChart.type), 
        data: formattedData, 
        createdAt: Number(Date.now()) 
      };
      await addDoc(chartsRef, payload);
      setNewChart({ title: '', type: 'bar', dataInput: 'Tháng 1: 100, Tháng 2: 200' });
    } catch (err) { console.error(err); }
  };

  const handleDeleteChart = async (id: string) => {
    if (!isAdmin) return;
    try {
      await deleteDoc(doc(db, 'artifacts', APP_IDENTIFIER, 'public', 'data', 'charts', id));
    } catch (err) { console.error(err); }
  };

  // Màn hình hướng dẫn khi thiếu cấu hình
  if (initError === 'firebase-config' && (!user || user.isAnonymous)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50 p-6 text-left">
        <div className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-md w-full text-center border border-purple-100 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Cần Bật Anonymous Auth</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Hệ thống cần quyền truy cập ẩn danh để hiển thị dữ liệu chung. Hãy vào <b>Firebase Console {'\u2192'} Authentication {'\u2192'} Sign-in method</b> và bật <b>Anonymous</b>.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => handleGoogleLogin()}
              disabled={isLoggingIn}
              className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <ShieldCheck size={18} /> {isLoggingIn ? 'Đang xác thực...' : 'Đăng nhập Admin (Gmail)'}
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-white text-purple-600 border border-purple-100 rounded-2xl font-bold hover:bg-purple-50 transition-all"
            >
              Tôi đã bật, tải lại trang
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfaff] gap-4">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        <p className="text-purple-600 font-bold animate-pulse">Đang kết nối Cloud...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaff] text-slate-900 selection:bg-purple-100 font-sans relative overflow-x-hidden text-left">
      
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-200/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-100/30 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(#7C3AED 0.8px, transparent 0.8px)`, backgroundSize: '32px 32px' }}></div>
      </div>

      <nav className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-purple-50 px-4 py-3 md:px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('public')}>
            <div className="w-8 h-8 bg-purple-950 rounded-xl flex items-center justify-center text-white shadow-lg"><LayoutDashboard size={16} /></div>
            <h1 className="text-lg font-black text-purple-950 tracking-tight">Marketing<span className="italic font-normal text-purple-500 opacity-60 ml-0.5">Hub</span></h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex bg-purple-100/50 p-1 rounded-xl">
              <button onClick={() => setView('public')} className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${view === 'public' ? 'bg-white shadow-sm text-purple-900' : 'text-purple-400 hover:text-purple-700'}`}><Eye size={12} /><span>Showcase</span></button>
              <button onClick={() => isAdmin ? setView('admin') : setShowAuthModal(true)} className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${view === 'admin' ? 'bg-white shadow-sm text-purple-900' : 'text-purple-400 hover:text-purple-700'}`}><Settings size={12} /><span>Studio</span></button>
            </div>
            {user && !user.isAnonymous && (
              <button onClick={handleLogout} className="text-purple-400 hover:text-red-500 transition-colors p-2 bg-white rounded-full border border-purple-50 shadow-sm"><LogOut size={14} /></button>
            )}
          </div>
        </div>
      </nav>

      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-md">
          <div className="bg-white/90 backdrop-blur-2xl w-full max-sm p-10 rounded-[2.5rem] relative shadow-2xl border border-white/50 text-center animate-in zoom-in fade-in duration-300">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-6 right-6 text-purple-300 hover:text-purple-950">✕</button>
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner"><ShieldCheck size={32} /></div>
              <h3 className="text-2xl font-black text-purple-950 tracking-tight">Xác minh Admin</h3>
              <p className="text-xs text-slate-500 mt-2 font-medium">Đăng nhập Gmail để quản trị Hub</p>
            </div>
            <button onClick={handleGoogleLogin} disabled={isLoggingIn} className="w-full flex items-center justify-center gap-3 py-4 bg-white border border-purple-100 rounded-2xl font-bold text-slate-700 hover:bg-purple-50 transition-all shadow-sm active:scale-95 disabled:opacity-50">
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="G" className="w-5 h-5" />
              {isLoggingIn ? 'Đang xử lý...' : 'Đăng nhập Google'}
            </button>
            {authError && <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-bold leading-relaxed">{authError}</div>}
            <p className="mt-8 text-[9px] text-purple-300 font-bold uppercase tracking-[0.2em] pt-6 border-t border-purple-50">Chỉ dành cho: {DEFAULT_ADMIN_EMAIL}</p>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto p-6 md:p-10 relative z-10 text-left">
        {view === 'admin' && isAdmin ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-purple-100 pb-8 text-left">
              <div className="max-w-2xl text-left">
                <div className="flex items-center space-x-2 text-purple-600 mb-2 font-bold bg-purple-100/50 px-3 py-1 w-fit rounded-full text-[10px] tracking-widest uppercase"><ShieldCheck size={14} /><span>Admin: {user?.email}</span></div>
                <h2 className="text-3xl font-black text-slate-900 mb-1 leading-tight tracking-tight text-left">Marketing Studio</h2>
                <p className="text-slate-400 font-medium text-sm leading-relaxed text-left">Quản lý kho tài nguyên và biểu đồ báo cáo cho toàn bộ team.</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <section className="space-y-6 text-left">
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-xl shadow-purple-950/5 text-left">
                  <h3 className="text-lg font-black mb-6 flex items-center gap-3 text-purple-950"><Plus className="text-white bg-purple-600 p-1.5 rounded-lg" size={24} /> Thêm Tài liệu</h3>
                  <form onSubmit={handleAddLink} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-purple-300 uppercase tracking-widest mb-1.5 ml-1">Tiêu đề tài liệu</label>
                      <input type="text" placeholder="VD: Chiến lược SEO 2024" className="w-full px-5 py-3.5 bg-white border border-purple-50 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-purple-100 transition-all" value={newLink.title} onChange={e => setNewLink({...newLink, title: e.target.value})} required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-purple-300 uppercase tracking-widest mb-1.5 ml-1">Đường dẫn URL</label>
                      <input type="url" placeholder="https://..." className="w-full px-5 py-3.5 bg-white border border-purple-50 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-purple-100 transition-all" value={newLink.url} onChange={e => setNewLink({...newLink, url: e.target.value})} required />
                    </div>
                    <button type="submit" className="w-full py-4 bg-purple-950 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.3em] mt-4 hover:bg-purple-900 transition-colors shadow-xl shadow-purple-950/20 active:scale-95">Đưa lên Hub</button>
                  </form>
                </div>
                <div className="grid gap-3">
                  {links.map(link => (
                    <div key={link.id} className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-purple-50 hover:border-purple-200 transition-all group text-left">
                      <span className="font-bold text-purple-900 text-sm truncate pl-2">{link.title}</span>
                      <button onClick={() => handleDeleteLink(link.id)} className="p-2 text-purple-200 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-6 text-left">
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-xl shadow-purple-950/5 text-left">
                  <h3 className="text-lg font-black mb-6 flex items-center gap-3 text-purple-950"><BarChart3 className="text-white bg-purple-600 p-1.5 rounded-lg" size={24} /> Thêm Báo cáo</h3>
                  <form onSubmit={handleAddChart} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-purple-300 uppercase tracking-widest mb-1.5 ml-1">Tiêu đề</label>
                        <input type="text" className="w-full px-5 py-3.5 bg-white border border-purple-50 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-purple-100 transition-all" value={newChart.title} onChange={e => setNewChart({...newChart, title: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-purple-300 uppercase tracking-widest mb-1.5 ml-1">Dạng</label>
                        <select className="w-full px-5 py-3.5 bg-white border border-purple-50 rounded-2xl text-sm font-bold text-purple-950 outline-none" value={newChart.type} onChange={e => setNewChart({...newChart, type: e.target.value})}>
                          <option value="bar">Cột</option>
                          <option value="line">Đường</option>
                          <option value="pie">Tròn</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-purple-300 uppercase tracking-widest mb-1.5 ml-1">Dữ liệu (Tên: Số, VD: Ads: 100, SEO: 120)</label>
                      <textarea rows={2} className="w-full px-5 py-3.5 bg-white border border-purple-50 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-purple-100 transition-all resize-none" value={newChart.dataInput} onChange={e => setNewChart({...newChart, dataInput: e.target.value})} required />
                    </div>
                    <button type="submit" className="w-full py-4 bg-purple-100 text-purple-950 rounded-2xl font-bold text-xs uppercase tracking-[0.3em] mt-4 border border-purple-200 hover:bg-white transition-colors">Lưu Báo cáo</button>
                  </form>
                </div>
                <div className="grid gap-3">
                   {charts.map(chart => (
                    <div key={chart.id} className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-purple-50 group text-left">
                      <span className="font-bold text-purple-950 text-xs italic pl-2">{chart.title}</span>
                      <button onClick={() => handleDeleteChart(chart.id)} className="p-2 text-purple-200 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 text-center">
            <header className="mb-24 pt-12">
              <h2 className="text-6xl md:text-7xl font-black text-purple-950 mb-4 tracking-tighter leading-tight font-serif italic">
                Cloud <span className="text-purple-500 opacity-40 not-italic">Marketing</span> Hub
              </h2>
              <div className="h-0.5 w-20 bg-purple-950 mx-auto mb-8"></div>
              <p className="text-purple-400 font-bold uppercase tracking-[0.4em] text-[10px] max-w-lg mx-auto tracking-widest">Trung tâm dữ liệu trực tuyến của Team Thắng Lợi</p>
            </header>
            
            <section className="mb-28 text-left">
              <div className="flex flex-col items-center mb-16 text-center">
                <h3 className="text-[10px] font-bold text-purple-950/30 uppercase tracking-[0.5em] mb-4">Resources</h3>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {links.length > 0 ? links.map(link => (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="group relative bg-white p-12 rounded-[3.5rem] text-center border border-purple-50 shadow-2xl shadow-purple-500/5 hover:-translate-y-3 transition-all duration-700 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-purple-950 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700"></div>
                    <div className="w-16 h-16 bg-purple-50 rounded-[2rem] flex items-center justify-center text-purple-950 mb-8 group-hover:bg-purple-950 group-hover:text-white transition-all duration-500 mx-auto shadow-inner"><Share2 size={24} strokeWidth={1.5} /></div>
                    <span className="font-serif font-bold text-xl text-purple-950 block mb-2">{link.title}</span>
                    <p className="text-[9px] text-purple-300 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 italic">Mở tài liệu</p>
                  </a>
                )) : <div className="col-span-full py-24 text-center bg-white/40 rounded-[4rem] border-dashed border-2 border-purple-100 opacity-60 font-serif italic text-xl">Đang chờ cập nhật tài nguyên mới...</div>}
              </div>
            </section>

            <section className="pb-32 text-left">
              <div className="flex flex-col items-center mb-20 text-center">
                <h3 className="text-[10px] font-bold text-purple-950/30 uppercase tracking-[0.5em] mb-4">Live Analytics</h3>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
              </div>
              <div className="grid lg:grid-cols-2 gap-16">
                {charts.length > 0 ? charts.map(chart => (
                  <div key={chart.id} className="bg-white/80 backdrop-blur-xl p-16 rounded-[4.5rem] border-none group transition-all duration-700 hover:shadow-purple-500/10 text-left">
                    <div className="flex items-end justify-between mb-12 text-left">
                      <div className="text-left">
                        <span className="text-[9px] font-bold text-purple-300 uppercase tracking-widest block mb-1.5">Visualization</span>
                        <h4 className="font-black text-3xl text-purple-950 tracking-tight italic font-serif leading-tight text-left">{chart.title}</h4>
                      </div>
                      <div className="text-[8px] font-black uppercase text-purple-400 bg-purple-100 px-4 py-1.5 rounded-full">{chart.type}</div>
                    </div>
                    <div className="h-[340px] w-full">
                      <RenderChart chart={chart} />
                    </div>
                  </div>
                )) : <div className="col-span-full py-40 text-center bg-white/40 rounded-[5rem] opacity-60 font-serif italic text-xl">Đang chờ cập nhật biểu đồ báo cáo...</div>}
              </div>
            </section>

            <div className="max-w-xl mx-auto p-12 border-t border-purple-100/50 mt-12 bg-white/20 rounded-[3rem] text-left">
               <div className="flex items-center justify-center gap-2 mb-6 text-purple-950 font-black tracking-[0.3em] text-[10px] uppercase text-center"><ChevronRight size={16} /> Hướng dẫn Vercel & Firebase</div>
               <div className="space-y-4 text-[11px] text-slate-500 italic leading-loose px-4 text-left">
                  <p className="flex items-start gap-3"><ChevronRight size={14} className="text-purple-400 shrink-0 mt-1" /> <span><b>Bật Anonymous Sign-in:</b> Truy cập Firebase Console {'\u2192'} Authentication {'\u2192'} Sign-in method {'\u2192'} Bật <b>Anonymous</b>.</span></p>
                  <p className="flex items-start gap-3"><ChevronRight size={14} className="text-purple-400 shrink-0 mt-1" /> <span><b>Cấu hình Authorized Domains:</b> Sau khi deploy lên Vercel, hãy thêm domain Vercel của bạn vào danh sách Authorized Domains trong cài đặt Authentication của Firebase để Gmail Login hoạt động chính xác.</span></p>
               </div>
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-6xl mx-auto p-20 border-t border-purple-50 text-center relative z-10 opacity-30 text-center">
        <h1 className="text-[10px] font-black text-purple-950 tracking-[0.6em] uppercase mb-4 text-center">Marketing Hub v2.5</h1>
        <p className="text-slate-400 text-[8px] font-bold tracking-[0.3em] uppercase italic italic text-center text-center text-center">Powered by Thắng Lợi Group Cloud Services</p>
      </footer>
    </div>
  );
}