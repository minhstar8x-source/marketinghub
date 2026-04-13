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
  updateDoc,
  query
} from 'firebase/firestore';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts';
import { 
  Plus, Trash2, LayoutDashboard, Settings, 
  BarChart3, Eye, Share2, LogOut, ShieldCheck, ChevronRight, ArrowUp, ArrowDown
} from 'lucide-react';

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU (TYPES) ---
interface LinkItem {
  id: string;
  title: string;
  url: string;
  createdAt: number;
  order?: number;
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
  order?: number;
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
        <p className="font-semibold text-purple-900 text-sm">{label}</p>
        <p className="text-purple-600 font-medium text-xs">
          {Number(payload[0].value).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const RenderChart: FC<{ chart: ChartItem }> = ({ chart }) => {
  const commonProps = { data: chart.data, margin: { top: 15, right: 15, left: -20, bottom: 0 } };
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
            <Bar dataKey="value" fill={`url(#grad-${chart.id})`} radius={[4, 4, 0, 0]} barSize={20} />
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
            <Line type="monotone" dataKey="value" stroke="#7C3AED" strokeWidth={2} dot={{ r: 3, fill: '#fff', strokeWidth: 2, stroke: '#7C3AED' }} />
          </LineChart>
        </ResponsiveContainer>
      );
    case 'pie':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chart.data} innerRadius={40} outerRadius={65} paddingAngle={6} dataKey="value">
              {chart.data.map((_entry: ChartDataItem, i: number) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" wrapperStyle={{paddingTop: '10px', fontSize: '10px'}} />
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
          createdAt: Number(docData.createdAt || 0),
          order: docData.order !== undefined ? Number(docData.order) : undefined
        } as LinkItem;
      }).sort((a, b) => {
        const orderA = a.order !== undefined ? a.order : a.createdAt;
        const orderB = b.order !== undefined ? b.order : b.createdAt;
        return orderA - orderB;
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
          createdAt: Number(docData.createdAt || 0),
          order: docData.order !== undefined ? Number(docData.order) : undefined
        } as ChartItem;
      }).sort((a, b) => {
        const orderA = a.order !== undefined ? a.order : a.createdAt;
        const orderB = b.order !== undefined ? b.order : b.createdAt;
        return orderA - orderB;
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

  const handleMoveLink = async (index: number, direction: -1 | 1) => {
    if (!isAdmin) return;
    const swapTarget = index + direction;
    if (swapTarget < 0 || swapTarget >= links.length) return;

    const newLinks = [...links];
    [newLinks[index], newLinks[swapTarget]] = [newLinks[swapTarget], newLinks[index]];

    try {
      // Cập nhật trường 'order' dựa trên index mới
      await Promise.all(newLinks.map((link, i) => 
        updateDoc(doc(db, 'artifacts', APP_IDENTIFIER, 'public', 'data', 'links', link.id), { order: i })
      ));
    } catch (error) {
      console.error("Lỗi khi sắp xếp:", error);
    }
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

  const handleMoveChart = async (index: number, direction: -1 | 1) => {
    if (!isAdmin) return;
    const swapTarget = index + direction;
    if (swapTarget < 0 || swapTarget >= charts.length) return;

    const newCharts = [...charts];
    [newCharts[index], newCharts[swapTarget]] = [newCharts[swapTarget], newCharts[index]];

    try {
      await Promise.all(newCharts.map((chart, i) => 
        updateDoc(doc(db, 'artifacts', APP_IDENTIFIER, 'public', 'data', 'charts', chart.id), { order: i })
      ));
    } catch (error) {
      console.error("Lỗi khi sắp xếp:", error);
    }
  };

  // Màn hình hướng dẫn khi thiếu cấu hình
  if (initError === 'firebase-config' && (!user || user.isAnonymous)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50 p-4 sm:p-6 text-left">
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-2xl max-w-md w-full text-center border border-purple-100 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Cần Bật Anonymous Auth</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Hệ thống cần quyền truy cập ẩn danh để hiển thị dữ liệu chung. Hãy vào <b>Firebase Console {'\u2192'} Authentication {'\u2192'} Sign-in method</b> và bật <b>Anonymous</b>.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => handleGoogleLogin()}
              disabled={isLoggingIn}
              className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 text-sm"
            >
              <ShieldCheck size={18} /> {isLoggingIn ? 'Đang xác thực...' : 'Đăng nhập Admin (Gmail)'}
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-white text-purple-600 border border-purple-100 rounded-xl font-semibold hover:bg-purple-50 transition-all text-sm"
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
        <p className="text-purple-600 font-semibold animate-pulse text-sm">Đang kết nối Cloud...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaff] text-slate-900 selection:bg-purple-100 font-sans relative overflow-x-hidden text-left">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-200/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-100/30 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(#7C3AED 1px, transparent 1px)`, backgroundSize: '32px 32px' }}></div>
      </div>

      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-purple-50 px-4 py-3 md:px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('public')}>
            <div className="w-8 h-8 bg-purple-950 rounded-lg flex items-center justify-center text-white shadow-md"><LayoutDashboard size={14} /></div>
            <h1 className="text-lg font-bold text-purple-950 tracking-tight">Marketing<span className="font-normal text-purple-500 ml-0.5 opacity-80">Hub</span></h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex bg-purple-100/50 p-1 rounded-xl">
              <button onClick={() => setView('public')} className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold tracking-wide transition-all ${view === 'public' ? 'bg-white shadow-sm text-purple-900' : 'text-purple-500 hover:text-purple-700'}`}><Eye size={14} /><span className="hidden sm:inline">Showcase</span></button>
              <button onClick={() => isAdmin ? setView('admin') : setShowAuthModal(true)} className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold tracking-wide transition-all ${view === 'admin' ? 'bg-white shadow-sm text-purple-900' : 'text-purple-500 hover:text-purple-700'}`}><Settings size={14} /><span className="hidden sm:inline">Studio</span></button>
            </div>
            {user && !user.isAnonymous && (
              <button onClick={handleLogout} className="text-purple-400 hover:text-red-500 transition-colors p-2 bg-white rounded-full border border-purple-50 shadow-sm"><LogOut size={14} /></button>
            )}
          </div>
        </div>
      </nav>

      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-xl w-full max-w-sm p-8 rounded-[2rem] relative shadow-2xl border border-white/50 text-center animate-in zoom-in fade-in duration-200">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-5 right-5 text-purple-300 hover:text-purple-900 transition-colors">✕</button>
            <div className="mb-6 text-center">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4"><ShieldCheck size={24} /></div>
              <h3 className="text-xl font-bold text-purple-950 tracking-tight">Xác minh Admin</h3>
              <p className="text-xs text-slate-500 mt-1.5">Đăng nhập Gmail để quản trị Hub</p>
            </div>
            <button onClick={handleGoogleLogin} disabled={isLoggingIn} className="w-full flex items-center justify-center gap-2.5 py-3 bg-white border border-purple-100 rounded-xl font-semibold text-sm text-slate-700 hover:bg-purple-50 transition-all shadow-sm active:scale-95 disabled:opacity-50">
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="G" className="w-4 h-4" />
              {isLoggingIn ? 'Đang xử lý...' : 'Đăng nhập Google'}
            </button>
            {authError && <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[11px] font-medium leading-relaxed">{authError}</div>}
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8 relative z-10 text-left">
        {view === 'admin' && isAdmin ? (
          <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-100 pb-5 text-left">
              <div className="max-w-2xl text-left">
                <div className="flex items-center space-x-2 text-purple-600 mb-2 font-medium bg-purple-50 px-2.5 py-1 w-fit rounded-full text-[9px] tracking-wide uppercase"><ShieldCheck size={12} /><span>Admin: {user?.email}</span></div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight text-left">Marketing Studio</h2>
                <p className="text-slate-500 text-xs md:text-sm text-left">Quản lý kho tài nguyên và sắp xếp báo cáo.</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 md:gap-8 text-left">
              {/* QUẢN LÝ TÀI LIỆU */}
              <section className="space-y-4 text-left">
                <div className="bg-white/80 backdrop-blur-md p-5 md:p-6 rounded-2xl border border-purple-50 shadow-md shadow-purple-900/5 text-left">
                  <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-purple-950"><Plus className="text-white bg-purple-600 p-1 rounded" size={18} /> Thêm Tài liệu</h3>
                  <form onSubmit={handleAddLink} className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-semibold text-purple-400 uppercase tracking-wide mb-1 ml-0.5">Tiêu đề tài liệu</label>
                      <input type="text" placeholder="VD: Chiến lược SEO 2024" className="w-full px-3.5 py-2.5 bg-white border border-purple-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all" value={newLink.title} onChange={e => setNewLink({...newLink, title: e.target.value})} required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-purple-400 uppercase tracking-wide mb-1 ml-0.5">Đường dẫn URL</label>
                      <input type="url" placeholder="https://..." className="w-full px-3.5 py-2.5 bg-white border border-purple-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all" value={newLink.url} onChange={e => setNewLink({...newLink, url: e.target.value})} required />
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-purple-900 text-white rounded-lg font-semibold text-xs hover:bg-purple-800 transition-colors shadow active:scale-95 mt-1">Lưu Tài liệu</button>
                  </form>
                </div>
                
                {/* DANH SÁCH TÀI LIỆU & SẮP XẾP */}
                <div className="grid gap-2">
                  {links.map((link, index) => (
                    <div key={link.id} className="flex items-center justify-between p-3 bg-white/80 rounded-lg border border-purple-100 hover:border-purple-300 transition-all group text-left shadow-sm">
                      <span className="font-medium text-purple-950 text-sm truncate pr-2 max-w-[60%]">{link.title}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleMoveLink(index, -1)} disabled={index === 0} className="p-1.5 text-purple-300 hover:text-purple-600 disabled:opacity-30 transition-colors bg-purple-50 rounded"><ArrowUp size={14} /></button>
                        <button onClick={() => handleMoveLink(index, 1)} disabled={index === links.length - 1} className="p-1.5 text-purple-300 hover:text-purple-600 disabled:opacity-30 transition-colors bg-purple-50 rounded"><ArrowDown size={14} /></button>
                        <button onClick={() => handleDeleteLink(link.id)} className="p-1.5 text-purple-300 hover:text-red-500 transition-colors rounded hover:bg-red-50 ml-1"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* QUẢN LÝ BÁO CÁO */}
              <section className="space-y-4 text-left">
                <div className="bg-white/80 backdrop-blur-md p-5 md:p-6 rounded-2xl border border-purple-50 shadow-md shadow-purple-900/5 text-left">
                  <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-purple-950"><BarChart3 className="text-white bg-purple-600 p-1 rounded" size={18} /> Thêm Báo cáo</h3>
                  <form onSubmit={handleAddChart} className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-purple-400 uppercase tracking-wide mb-1 ml-0.5">Tiêu đề</label>
                        <input type="text" className="w-full px-3.5 py-2.5 bg-white border border-purple-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all" value={newChart.title} onChange={e => setNewChart({...newChart, title: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-purple-400 uppercase tracking-wide mb-1 ml-0.5">Dạng</label>
                        <select className="w-full px-3.5 py-2.5 bg-white border border-purple-100 rounded-lg text-sm font-medium text-purple-950 outline-none focus:ring-2 focus:ring-purple-200" value={newChart.type} onChange={e => setNewChart({...newChart, type: e.target.value})}>
                          <option value="bar">Cột</option>
                          <option value="line">Đường</option>
                          <option value="pie">Tròn</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-purple-400 uppercase tracking-wide mb-1 ml-0.5">Dữ liệu (Tên: Số)</label>
                      <textarea rows={2} placeholder="VD: Ads: 100, SEO: 120" className="w-full px-3.5 py-2.5 bg-white border border-purple-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all resize-none" value={newChart.dataInput} onChange={e => setNewChart({...newChart, dataInput: e.target.value})} required />
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-purple-100 text-purple-900 rounded-lg font-semibold text-xs hover:bg-purple-200 transition-colors mt-1">Tạo Biểu đồ</button>
                  </form>
                </div>

                {/* DANH SÁCH BÁO CÁO & SẮP XẾP */}
                <div className="grid gap-2">
                   {charts.map((chart, index) => (
                    <div key={chart.id} className="flex items-center justify-between p-3 bg-white/80 rounded-lg border border-purple-100 group text-left shadow-sm">
                      <div className="flex items-center truncate pr-2 max-w-[60%]">
                        <span className="font-medium text-purple-950 text-sm truncate">{chart.title}</span>
                        <span className="text-[9px] ml-2 text-purple-500 font-normal uppercase bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100 hidden sm:inline-block">{chart.type}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => handleMoveChart(index, -1)} disabled={index === 0} className="p-1.5 text-purple-300 hover:text-purple-600 disabled:opacity-30 transition-colors bg-purple-50 rounded"><ArrowUp size={14} /></button>
                        <button onClick={() => handleMoveChart(index, 1)} disabled={index === charts.length - 1} className="p-1.5 text-purple-300 hover:text-purple-600 disabled:opacity-30 transition-colors bg-purple-50 rounded"><ArrowDown size={14} /></button>
                        <button onClick={() => handleDeleteChart(chart.id)} className="p-1.5 text-purple-300 hover:text-red-500 transition-colors rounded hover:bg-red-50 ml-1"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 text-center">
            {/* Header Chính (Giữ nguyên phong cách typography to bản) */}
            <header className="mb-12 md:mb-20 pt-6 md:pt-10">
              <h2 className="text-4xl md:text-6xl font-black text-purple-950 mb-3 tracking-tighter leading-tight font-serif italic">
                Cloud <span className="text-purple-500 opacity-40 not-italic">Marketing</span> Hub
              </h2>
              <div className="h-0.5 w-12 md:w-16 bg-purple-950 mx-auto mb-5 md:mb-6"></div>
              <p className="text-purple-400 font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-[10px] max-w-lg mx-auto">Trung tâm dữ liệu trực tuyến của Team Thắng Lợi</p>
            </header>
            
            {/* Phân vùng: Resources (Thu gọn lại) */}
            <section className="mb-16 md:mb-24 text-left">
              <div className="flex flex-col items-center mb-8 md:mb-10 text-center">
                <h3 className="text-[10px] font-bold text-purple-900/40 uppercase tracking-[0.2em] mb-2.5">Tài nguyên</h3>
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                {links.length > 0 ? links.map(link => (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="group relative bg-white p-4 sm:p-5 rounded-2xl text-center border border-purple-50 shadow-sm hover:shadow-md shadow-purple-900/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col items-center justify-center min-h-[110px]">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300"><Share2 size={18} strokeWidth={2} /></div>
                    <span className="font-bold text-sm text-purple-950 block mb-1 leading-tight line-clamp-2">{link.title}</span>
                    <p className="text-[9px] text-purple-400 font-medium group-hover:text-purple-600 transition-colors duration-300 opacity-0 group-hover:opacity-100">Nhấp để mở &rarr;</p>
                  </a>
                )) : <div className="col-span-full py-12 text-center bg-white/40 rounded-2xl border-dashed border-2 border-purple-100 text-purple-400 text-xs">Đang chờ cập nhật tài nguyên mới...</div>}
              </div>
            </section>

            {/* Phân vùng: Analytics (Gọn gàng) */}
            <section className="pb-16 md:pb-20 text-left">
              <div className="flex flex-col items-center mb-8 md:mb-10 text-center">
                <h3 className="text-[10px] font-bold text-purple-900/40 uppercase tracking-[0.2em] mb-2.5">Báo cáo trực tiếp</h3>
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
              </div>
              <div className="grid lg:grid-cols-2 gap-5 md:gap-6">
                {charts.length > 0 ? charts.map(chart => (
                  <div key={chart.id} className="bg-white/80 backdrop-blur-md p-5 md:p-6 rounded-2xl border border-purple-50 shadow-sm shadow-purple-900/5 text-left transition-all duration-300 hover:shadow-purple-500/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-5 gap-2 text-left">
                      <div>
                        <h4 className="font-bold text-base md:text-lg text-purple-950 tracking-tight leading-snug text-left">{chart.title}</h4>
                      </div>
                      <div className="text-[9px] font-bold uppercase text-purple-600 bg-purple-100 px-2 py-0.5 rounded w-fit">{chart.type}</div>
                    </div>
                    <div className="h-[200px] md:h-[240px] w-full">
                      <RenderChart chart={chart} />
                    </div>
                  </div>
                )) : <div className="col-span-full py-16 text-center bg-white/40 rounded-2xl border-dashed border-2 border-purple-100 text-purple-400 text-xs">Đang chờ cập nhật biểu đồ...</div>}
              </div>
            </section>

            {/* Hộp hướng dẫn */}
            <div className="max-w-xl mx-auto p-5 md:p-6 border border-purple-100/60 mt-4 bg-white/50 rounded-2xl text-left shadow-sm">
               <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-3 text-purple-900 font-bold text-[10px] uppercase tracking-wide"><ShieldCheck size={14} className="text-purple-500" /> Hướng dẫn triển khai</div>
               <div className="space-y-2 text-[11px] text-slate-600 leading-relaxed">
                  <p className="flex items-start gap-2"><ChevronRight size={12} className="text-purple-400 shrink-0 mt-0.5" /> <span><b>Cấp quyền truy cập chung:</b> Vào Firebase Console {'\u2192'} Authentication {'\u2192'} Sign-in method {'\u2192'} Bật <b>Anonymous</b>.</span></p>
                  <p className="flex items-start gap-2"><ChevronRight size={12} className="text-purple-400 shrink-0 mt-0.5" /> <span><b>Cho phép đăng nhập Admin:</b> Thêm domain Vercel của bạn vào danh sách <b>Authorized Domains</b> trong Firebase Authentication.</span></p>
               </div>
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-6xl mx-auto p-8 md:p-12 text-center relative z-10 text-center border-t border-purple-50 mt-8">
        <h1 className="text-[10px] font-bold text-purple-900 tracking-widest uppercase mb-1.5">Marketing Hub</h1>
        <p className="text-slate-400 text-[9px] font-medium tracking-wide">Powered by Thắng Lợi Group Cloud</p>
      </footer>
    </div>
  );
}