import { Segment } from '@/types/email';
import { cn } from '@/lib/utils';
import { Building2, Leaf, ShoppingBag, Cpu, HelpCircle, Warehouse, GraduationCap } from 'lucide-react';

interface SegmentBadgeProps {
  segment: Segment;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const SEGMENT_CONFIG: Record<Segment, { icon: typeof Building2; className: string }> = {
  'Mercado Financeiro': {
    icon: Building2,
    className: 'segment-badge-financeiro',
  },
  'Agro/relacionados': {
    icon: Leaf,
    className: 'segment-badge-agro',
  },
  'Varejo': {
    icon: ShoppingBag,
    className: 'segment-badge-varejo',
  },
  'Atacado': {
    icon: Warehouse,
    className: 'segment-badge-atacado',
  },
  'Tech/Indústria/Inovação': {
    icon: Cpu,
    className: 'segment-badge-tech',
  },
  'Educação': {
    icon: GraduationCap,
    className: 'segment-badge-educacao',
  },
  'Outros': {
    icon: HelpCircle,
    className: 'segment-badge-outros',
  },
};

const SIZE_CLASSES = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-3 py-1 gap-1.5',
  lg: 'text-base px-4 py-1.5 gap-2',
};

const ICON_SIZES = {
  sm: 12,
  md: 14,
  lg: 16,
};

export function SegmentBadge({ segment, size = 'md', showIcon = true }: SegmentBadgeProps) {
  const config = SEGMENT_CONFIG[segment];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        SIZE_CLASSES[size],
        config.className
      )}
    >
      {showIcon && <Icon size={ICON_SIZES[size]} />}
      {segment}
    </span>
  );
}
