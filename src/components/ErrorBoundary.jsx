import React from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uygulama Hatası (ErrorBoundary):', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetCache = () => {
    try {
      localStorage.removeItem('beton_santiyeler');
      localStorage.removeItem('beton_baglantilar');
      localStorage.removeItem('beton_saha_dokumleri');
      localStorage.removeItem('beton_irsaliyeler');
      localStorage.removeItem('beton_faturalar');
      localStorage.removeItem('beton_siniflari');
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
          <div className="bg-slate-800 border-2 border-rose-500/50 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-9 h-9 animate-pulse" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Sayfa Yüklenirken Bir Sorun Oluştu
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 font-medium">
                Sistem güvenliği için sayfa koruma moduna alındı. Aşağıdaki butonlarla sayfayı yenileyebilir veya önbelleği tazeleyebilirsiniz.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="bg-slate-950/70 border border-slate-700 rounded-xl p-3 text-left font-mono text-[11px] text-rose-300 overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition cursor-pointer shadow-lg active:scale-95 text-xs sm:text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Sayfayı Yenile
              </button>
              <button
                type="button"
                onClick={this.handleResetCache}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 px-4 rounded-xl transition cursor-pointer active:scale-95 text-xs sm:text-sm"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                Önbelleği Sıfırla & Aç
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
