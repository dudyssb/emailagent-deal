import { Segment } from '@/types/email';
import { CaseResultType, RESULT_TYPE_LABELS, SuccessCase } from '@/data/successCases';
import { RichMaterial } from '@/data/richMaterials';
import { 
  getCaseResultTypesForSegment, 
  getPreviewMaterial,
  getCasesForSegmentAndType,
} from '@/utils/emailGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrendingDown, Zap, Gauge, Rocket, Scale, Lightbulb, FileText, Building2 } from 'lucide-react';

interface CaseSelectionProps {
  segment: Segment;
  selectedResultType: CaseResultType | undefined;
  onSelectResultType: (type: CaseResultType | undefined) => void;
  selectedCaseId: string | undefined;
  onSelectCaseId: (id: string | undefined) => void;
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
  onSelectResultType,
  selectedCaseId,
  onSelectCaseId,
}: CaseSelectionProps) {
  const availableTypes = getCaseResultTypesForSegment(segment);
  const previewMaterial = getPreviewMaterial(segment);

  // Get cases for chosen result type
  const casesForType = selectedResultType 
    ? getCasesForSegmentAndType(segment, selectedResultType)
    : [];

  // Find the selected case object
  const selectedCase = casesForType.find(c => c.id === selectedCaseId);

  if (availableTypes.length === 0) {
    return null;
  }

  const handleResultTypeChange = (value: string) => {
    const newType = value as CaseResultType || undefined;
    onSelectResultType(newType);
    onSelectCaseId(undefined); // Reset case when type changes
  };

  return (
    <div className="space-y-4">
      {/* Step 1: Choose result type */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            1. Qual resultado quer destacar?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedResultType || ''}
            onValueChange={handleResultTypeChange}
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

      {/* Step 2: Choose specific case */}
      {selectedResultType && casesForType.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              2. Escolha o case de sucesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedCaseId || ''}
              onValueChange={(value) => onSelectCaseId(value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um case..." />
              </SelectTrigger>
              <SelectContent>
                {casesForType.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.empresa} – {c.destaque}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Preview of selected case */}
      {selectedCase && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Case para Email 2:
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-semibold text-foreground">{selectedCase.empresa}</p>
              <p className="text-sm text-muted-foreground">{selectedCase.descricao}</p>
              <p className="text-sm text-foreground"><strong>Destaque:</strong> {selectedCase.destaque}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedCase.tipoResultado.map(t => (
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
