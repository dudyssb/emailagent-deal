import { Upload, Users, Mail, BarChart3, FileDown, LogOut, History } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TabType = 'import' | 'contacts' | 'emails' | 'metrics' | 'export' | 'history';
interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onLogout: () => void;
  hasData: boolean;
}

const TABS = [
  { id: 'import' as TabType, label: 'Importar CSV', icon: Upload },
  { id: 'contacts' as TabType, label: 'Contatos', icon: Users, requiresData: true },
  { id: 'emails' as TabType, label: 'E-mails', icon: Mail },
  { id: 'metrics' as TabType, label: 'Métricas', icon: BarChart3 },
  { id: 'export' as TabType, label: 'Exportar', icon: FileDown, requiresData: true },
  { id: 'history' as TabType, label: 'Histórico', icon: History },
];

export function Sidebar({ activeTab, onTabChange, hasData, onLogout }: SidebarProps) {

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold gradient-text">Email Agent</h1>
        <p className="text-xs text-muted-foreground mt-1">Análise e Nutrição</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isDisabled = tab.requiresData && !hasData;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => !isDisabled && onTabChange(tab.id)}
              disabled={isDisabled}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                isDisabled && 'opacity-50 cursor-not-allowed hover:bg-transparent'
              )}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="pt-4 border-t border-border">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </aside>
  );
}
