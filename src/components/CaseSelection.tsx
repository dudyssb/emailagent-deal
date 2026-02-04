import { Segment } from '@/types/email';
import { CaseResultType, RESULT_TYPE_LABELS } from '@/data/successCases';
import { RichMaterial } from '@/data/richMaterials';
import { 
  getCaseResultTypesForSegment, 
  getPreviewCase,
  getPreviewMaterial 
} from '@/utils/emailGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, Zap, Gauge, Rocket, Scale, Lightbulb, FileText } from 'lucide-react';

interface CaseSelectionProps {
  segment: Segment;
  selectedResultType: CaseResultType | undefined;
  onSelectResultType: (type: CaseResultType | undefined) => void;
}

const RESULT_TYPE_ICONS: Record<CaseResultType, React.ReactNode> = {
  custo: <TrendingDown className="w-4 h-4" />,
  eficiencia: <Zap className="w-4 h-4" />,
  performance: <Gauge className="w-4 h-4" />,
  time_to_market: <Rocket className="w-4 h-4" />,
  escala: <Scale className="w-4 h-4" />,
  inovacao: <Lightbulb className="w-4 h-4" />,
};

export function CaseSelection({ 
  segment, 
  selectedResultType, 
  onSelectResultType 
}: CaseSelectionProps) {
  const availableTypes = getCaseResultTypesForSegment(segment);
  const previewCase = getPreviewCase(segment, selectedResultType);
  const previewMaterial = getPreviewMaterial(segment);

  if (availableTypes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Qual tipo de resultado você quer destacar?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Escolha o tipo de resultado que será usado no case de sucesso do Email 2:
          </p>
          
          <RadioGroup
            value={selectedResultType || ''}
            onValueChange={(value) => onSelectResultType(value as CaseResultType || undefined)}
            className="grid gap-3"
          >
            {availableTypes.map(({ type, label, casesCount }) => (
              <div key={type} className="flex items-center space-x-3">
                <RadioGroupItem value={type} id={`case-${type}`} />
                <Label 
                  htmlFor={`case-${type}`} 
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <span className="text-primary">{RESULT_TYPE_ICONS[type]}</span>
                  <span>{label}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {casesCount} {casesCount === 1 ? 'case' : 'cases'}
                  </Badge>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Preview do case selecionado */}
      {previewCase && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Case que será usado no Email 2:
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-semibold text-foreground">{previewCase.empresa}</p>
              <p className="text-sm text-muted-foreground">{previewCase.destaque}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {previewCase.tipoResultado.map(t => (
                  <Badge key={t} variant="outline" className="text-xs">
                    {RESULT_TYPE_LABELS[t]}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview do material (seleção automática) */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Material selecionado automaticamente para Email 3:
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="font-semibold text-foreground">{previewMaterial.titulo}</p>
            <p className="text-sm text-muted-foreground">{previewMaterial.descricao}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {previewMaterial.temas.slice(0, 4).map(t => (
                <Badge key={t} variant="outline" className="text-xs">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
