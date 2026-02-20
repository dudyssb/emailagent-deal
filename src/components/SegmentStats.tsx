import { Segment, ALL_SEGMENTS } from '@/types/email';
import { SegmentBadge } from './SegmentBadge';
import { Users, TrendingUp } from 'lucide-react';

interface SegmentStatsProps {
  segmentCounts: Record<Segment, number>;
  onSegmentSelect?: (segment: Segment) => void;
  selectedSegment?: Segment | null;
}

export function SegmentStats({ segmentCounts, onSegmentSelect, selectedSegment }: SegmentStatsProps) {
  const total = Object.values(segmentCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Distribuição por Segmento
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          {total} contatos
        </div>
      </div>

      <div className="grid gap-3">
        {ALL_SEGMENTS.map((segment) => {
          const count = segmentCounts[segment] || 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;
          const isSelected = selectedSegment === segment;

          return (
            <button
              key={segment}
              onClick={() => onSegmentSelect?.(segment)}
              disabled={count === 0}
              className={`
                w-full p-4 rounded-xl border transition-all duration-200
                ${count === 0 
                  ? 'opacity-50 cursor-not-allowed bg-muted/50' 
                  : 'hover:shadow-md cursor-pointer bg-card hover:border-primary/30'
                }
                ${isSelected ? 'ring-2 ring-primary border-primary' : 'border-border'}
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <SegmentBadge segment={segment} size="sm" />
                <span className="text-lg font-bold text-foreground">{count}</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-right">
                {percentage.toFixed(1)}% do total
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
