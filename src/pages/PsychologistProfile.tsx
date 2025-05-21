import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/api";
import { PsychologistInformations } from "@/types/PsychologistInformations";
import { GroupedAvailability } from "@/types/GroupedAvailability";
import { AvailabilitySlot } from "@/types/AvailabilitySlot";
import { ToastHelper } from "@/helpers/ToastHelper";

const PsychologistProfile = () => {
  const { id: psychologistId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [psychologist, setPsychologist] = useState<PsychologistInformations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availability, setAvailability] = useState<GroupedAvailability[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(true);

  const getWeekdayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { weekday: 'long' });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const psychResponse = await authApi.get(`/psychologists/${psychologistId}`);

        setPsychologist(psychResponse.data);

        const availabilityResponse = await authApi.get(`/schedule/available/${psychologistId}`);
        
        const grouped: Record<string, GroupedAvailability> = {};
        
        availabilityResponse.data.forEach((slot: AvailabilitySlot) => {
          const dayName = getWeekdayName(slot.date);
          const timeSlot = `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`;
          
          if (!grouped[slot.date]) {
            grouped[slot.date] = {
              day: dayName,
              date: slot.date,
              slots: []
            };
          }
          
          grouped[slot.date].slots.push({
            id: slot.id,
            time: timeSlot
          });
        });

        const availabilityArray = Object.values(grouped).map(item => ({
          ...item,
          day: item.day.charAt(0).toUpperCase() + item.day.slice(1)
        }));
        
        setAvailability(availabilityArray);
      } catch (err) {
        setError("Erro ao carregar dados");
        console.error("Erro:", err);
      } finally {
        setLoading(false);
        setLoadingAvailability(false);
      }
    };

    if (psychologistId) {
      fetchData();
    }
  }, [psychologistId]);

  const handleSendRequest = async () => {
    if (!message.trim()) {
      toast({
        title: "Mensagem Obrigatória",
        description: "Por favor, inclua uma mensagem com sua solicitação.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedSlotId) {
      toast({
        title: "Horário Obrigatório",
        description: "Por favor, selecione um horário disponível.",
        variant: "destructive",
      });
      return;
    }
    
    setIsRequestPending(true);
    
    try {
      await authApi.post('/schedule/request', {
        scheduleId: selectedSlotId,
        message
      });
      
      toast({
        title: "Solicitação Enviada",
        description: `Sua consulta com ${psychologist?.name} foi agendada.`,
      });
      
      setMessage("");
      setSelectedSlotId(null);
    } catch (error) {
      ToastHelper.error("Falha ao agendar consulta. Tente novamente.", error);
    } finally {
      setIsRequestPending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !psychologist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Psicólogo Não Encontrado</h1>
          <Button asChild>
            <Link to="/dashboard">Voltar ao Painel</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-vivaleve-600 hover:text-vivaleve-700 flex items-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Voltar
            </Link>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="rounded-lg overflow-hidden bg-muted mb-4">
                      <div className="w-full h-48 bg-vivaleve-100 flex items-center justify-center text-4xl font-bold text-vivaleve-600">
                        {psychologist.name.charAt(0)}
                      </div>
                    </div>
                    <div className="flex items-center justify-center mb-4">
                      <div className="flex text-yellow-400 mr-2">
                        {Array(5).fill(0).map((_, i) => (
                          <svg key={i} viewBox="0 0 24 24" className={`w-4 h-4 ${i < Math.floor(Number(psychologist.rating)) ? "fill-current" : "stroke-current fill-none"}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        ))}
                      </div>
                      <span className="font-medium">{psychologist.rating}</span>
                      <span className="text-muted-foreground ml-1">({psychologist.reviewCount})</span>
                    </div>
                    <Badge className="bg-vivaleve-100 hover:bg-vivaleve-200 text-vivaleve-800 w-full justify-center">
                      Tag 1
                    </Badge>
                  </div>
                  <div className="md:w-2/3">
                    <h1 className="text-2xl font-bold mb-2">{psychologist.name}</h1>
                    
                    <h2 className="text-lg font-semibold mt-6 mb-2">Sobre</h2>
                    <p className="mb-4">
                      Sobre o psicologo....
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Avaliações</h3>
                        <p>{psychologist.reviewCount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Agendar Consulta</CardTitle>
                <CardDescription>Selecione um horário disponível</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Horários</h3>
                  
                  {loadingAvailability ? (
                    <p>Carregando...</p>
                  ) : availability.length === 0 ? (
                    <p>Sem horários disponíveis</p>
                  ) : (
                    <div className="space-y-4">
                      {availability.map((day) => (
                        <div key={day.date} className="space-y-2">
                          <h4 className="text-sm font-medium">
                            {day.day}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {day.slots.map((slot) => (
                              <Button
                                key={slot.id}
                                variant="outline"
                                size="sm"
                                className={`text-xs ${selectedSlotId === slot.id ? 'border-vivaleve-600 bg-vivaleve-50 text-vivaleve-700' : ''}`}
                                onClick={() => setSelectedSlotId(slot.id)}
                              >
                                {slot.time}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Mensagem
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Descreva o motivo da consulta..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-vivaleve-600 hover:bg-vivaleve-700" 
                  onClick={handleSendRequest}
                  disabled={isRequestPending || !user}
                >
                  {isRequestPending ? "Agendando..." : "Confirmar Agendamento"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PsychologistProfile;