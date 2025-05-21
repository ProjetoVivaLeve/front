
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { UserRole, Patient } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { authApi } from '@/api';
import { setUserData } from '@/storage'

const ANAMNESIS_QUESTIONS = [
  {
    id: 1,
    question: "Como você descreveria seu relacionamento com seus pais durante a infância?",
    type: "single",
    options: [
      { value: "conflictivo", label: "Conflituoso/abusivo" },
      { value: "distante", label: "Distante/emocionalmente ausente" },
      { value: "instavel", label: "Instável (altos e baixos)" },
      { value: "amoroso", label: "Amoroso/saudável" },
      { value: "superprotetor", label: "Superprotetor/controlador" },
    ],
  },
  {
    id: 2,
    question: "Quais dessas experiências você vivenciou na infância/adolescência?",
    type: "multiselect",
    options: [
      { value: "divorcio", label: "Divórcio dos pais" },
      { value: "bullying", label: "Bullying ou rejeição social" },
      { value: "luto", label: "Perda de ente querido" },
      { value: "doenca", label: "Doença grave na família" },
      { value: "mudancas", label: "Muitas mudanças de casa/escola" },
      { value: "nenhuma", label: "Nenhuma das acima" },
    ],
  },
  {
    id: 3,
    question: "Como você se sente em relação à forma como foi criado(a)?",
    type: "single",
    options: [
      { value: "ressentimento", label: "Ressentimento/mágoa" },
      { value: "confusao", label: "Confusão/incompreensão" },
      { value: "neutro", label: "Neutro - nem bom nem ruim" },
      { value: "gratidao", label: "Gratidão/aceitação" },
      { value: "misto", label: "Sentimentos mistos" },
    ],
  },
  {
    id: 4,
    question: "Como você avalia seus relacionamentos atuais (amigos, família, parceiro)?",
    type: "rating",
    options: [
      { value: "1", label: "Muito insatisfatório" },
      { value: "2", label: "Insatisfatório" },
      { value: "3", label: "Neutro" },
      { value: "4", label: "Satisfatório" },
      { value: "5", label: "Muito satisfatório" },
    ],
  },
  {
    id: 5,
    question: "Você tem dificuldade em: (Selecione todos que se aplicam)",
    type: "multiselect",
    options: [
      { value: "confianca", label: "Confiar nos outros" },
      { value: "intimidade", label: "Estabelecer intimidade" },
      { value: "limites", label: "Definir limites saudáveis" },
      { value: "conflitos", label: "Lidar com conflitos" },
      { value: "nenhuma", label: "Nenhuma das acima" },
    ],
  },
  {
    id: 6,
    question: "Como você descreveria sua autoestima atualmente?",
    type: "rating",
    options: [
      { value: "1", label: "Muito baixa" },
      { value: "2", label: "Baixa" },
      { value: "3", label: "Neutra" },
      { value: "4", label: "Boa" },
      { value: "5", label: "Muito boa" },
    ],
  },
  {
    id: 7,
    question: "Quais desses sentimentos você experimenta com frequência?",
    type: "multiselect",
    options: [
      { value: "ansiedade", label: "Ansiedade" },
      { value: "tristeza", label: "Tristeza profunda" },
      { value: "culpa", label: "Culpa excessiva" },
      { value: "raiva", label: "Raiva/irritabilidade" },
      { value: "solidao", label: "Solidão" },
      { value: "vazio", label: "Vazio existencial" },
    ],
  },
  {
    id: 8,
    question: "Você já passou por situações traumáticas que ainda te afetam hoje?",
    type: "single",
    options: [
      { value: "sim", label: "Sim, significativamente" },
      { value: "pouco", label: "Sim, mas pouco" },
      { value: "nao", label: "Não" },
      { value: "nao_sei", label: "Não tenho certeza" },
    ],
  },
  {
    id: 9,
    question: "Quais são seus principais objetivos com a terapia?",
    type: "multiselect",
    options: [
      { value: "autoestima", label: "Melhorar autoestima" },
      { value: "relacionamentos", label: "Melhorar relacionamentos" },
      { value: "trauma", label: "Superar traumas" },
      { value: "ansiedade", label: "Lidar com ansiedade" },
      { value: "depressao", label: "Lidar com depressão" },
      { value: "autoconhecimento", label: "Autoconhecimento" },
    ],
  },
  {
    id: 10,
    question: "Alguma outra informação que gostaria de compartilhar sobre sua história ou necessidades?",
    type: "text",
  },
];

const Anamnesis = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  const isPatient = user.role === UserRole.PATIENT;
  if (!isPatient) {
    return <Navigate to="/login" />;
  }
  
  const patientUser = user as Patient;
  
  if (patientUser.anamnesisCompleted) {
    return <Navigate to="/dashboard" />;
  }

  const handleNextStep = () => {
    const currentQuestion = ANAMNESIS_QUESTIONS[currentStep];
    const currentAnswer = answers[currentQuestion.id];
    
    if (!currentAnswer && currentQuestion.type !== "text") {
      toast({
        title: "Obrigatório",
        description: "Por favor, responda à pergunta antes de continuar.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep < ANAMNESIS_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSingleSelect = (value: string) => {
    setAnswers({
      ...answers,
      [ANAMNESIS_QUESTIONS[currentStep].id]: value,
    });
  };

  const handleMultiSelect = (value: string) => {
    const currentQuestionId = ANAMNESIS_QUESTIONS[currentStep].id;
    const currentValues = answers[currentQuestionId] || [];
    
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    
    setAnswers({
      ...answers,
      [currentQuestionId]: updatedValues,
    });
  };

  const handleTextChange = (value: string) => {
    setAnswers({
      ...answers,
      [ANAMNESIS_QUESTIONS[currentStep].id]: value,
    });
  };

  const mapAnswersWithQuestionsAndLabels = () => {
    const mappedAnswers: Record<string, string> = {};

    for (const [idStr, answer] of Object.entries(answers)) {
      const id = Number(idStr);
      const question = ANAMNESIS_QUESTIONS.find((q) => q.id === id);
      if (!question) continue;

      if (question.type === "single" || question.type === "rating") {
        const option = question.options.find((opt) => opt.value === answer);
        mappedAnswers[question.question] = option ? option.label : (answer as string);
      } else if (question.type === "multiselect") {
        if (Array.isArray(answer)) {
          const labels = answer
            .map((val) => {
              const opt = question.options.find((o) => o.value === val);
              return opt ? opt.label : val;
            })
            .filter(Boolean);
          mappedAnswers[question.question] = labels.join(", ");
        } else {
          mappedAnswers[question.question] = "";
        }
      } else if (question.type === "text") {
        mappedAnswers[question.question] = answer as string;
      }
    }

    return mappedAnswers;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const mappedAnswers = mapAnswersWithQuestionsAndLabels();
      
      const response = await authApi.post('/anamnese', { answers: mappedAnswers });
      
      patientUser.anamnesisCompleted = true;
      
      setUserData(JSON.stringify(patientUser));
      
      toast({
        title: "Sucesso",
        description: "Seu questionário de anamnese foi enviado com sucesso!",
      });
      
      navigate('/dashboard');
      
    } catch (error) {
      console.error("Erro ao enviar anamnese:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar suas respostas. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = () => {
    const question = ANAMNESIS_QUESTIONS[currentStep];
    
    switch (question.type) {
      case "rating":
      case "single":
        return (
          <RadioGroup 
            value={answers[question.id] || ""} 
            onValueChange={handleSingleSelect}
            className="space-y-3"
          >
            {question.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case "multiselect":
        return (
          <div className="space-y-3">
            {question.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={option.value} 
                  checked={(answers[question.id] || []).includes(option.value)}
                  onCheckedChange={() => handleMultiSelect(option.value)}
                />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </div>
        );
      
      case "text":
        return (
          <Textarea
            placeholder="Digite sua resposta aqui..."
            value={answers[question.id] || ""}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={5}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold title-gradient mb-2">Anamnese Psicológica</h1>
          <p className="text-muted-foreground">
            Esta avaliação nos ajudará a conectá-lo com o psicólogo certo para suas necessidades.
            Suas respostas são confidenciais e protegidas por nossa política de privacidade.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-2 text-sm">
            <span>Pergunta {currentStep + 1} de {ANAMNESIS_QUESTIONS.length}</span>
            <span>{Math.round(((currentStep + 1) / ANAMNESIS_QUESTIONS.length) * 100)}%</span>
          </div>
          <Progress value={((currentStep + 1) / ANAMNESIS_QUESTIONS.length) * 100} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{ANAMNESIS_QUESTIONS[currentStep].question}</CardTitle>
            <CardDescription>
              {ANAMNESIS_QUESTIONS[currentStep].type === "multiselect" 
                ? "Selecione todas as opções aplicáveis" 
                : "Selecione uma opção"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderQuestion()}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevStep} 
              disabled={currentStep === 0 || isSubmitting}
            >
              Anterior
            </Button>
            <Button 
              onClick={handleNextStep} 
              disabled={isSubmitting}
              className="bg-vivaleve-600 hover:bg-vivaleve-700"
            >
              {currentStep === ANAMNESIS_QUESTIONS.length - 1 
                ? (isSubmitting ? "Enviando..." : "Enviar") 
                : "Próximo"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Anamnesis;
