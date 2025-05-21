
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRole, Patient, Psychologist } from "@/types";
import { Calendar, Clock, MessageSquare, User, Users, Star, Bell, ChartPie } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { authApi } from "@/api";
import { RecommendedPsychologist } from "@/types/RecommendedPsychologist";
import { AppointmentRequest } from "@/types/AppointmentRequest";
import { 
  getWeekdayNameTitle, 
  formatTime,
} from '@/helpers/DateHelper';
import { PsychologistsRecommended } from "@/components/ui/psychologists-recommended";
import { AppointmentsList } from "@/components/ui/appointments-list";
import { getUserData } from "@/storage";

const MOCK_UPCOMING_SESSIONS = [
  {
    id: "1",
    patientName: "João Silva", 
    psychologistName: "Dra. Emma Wilson",
    date: new Date(Date.now() + 86400000),
    duration: 50,
    isPsychologist: false,
    topic: "Ansiedade no trabalho",
    notes: "Continuação do trabalho sobre técnicas de respiração"
  },
  {
    id: "2",
    patientName: "Maria Oliveira",
    psychologistName: "Dra. Emma Wilson",
    date: new Date(Date.now() + 172800000),
    duration: 50,
    isPsychologist: false,
    topic: "Problemas de relacionamento",
    notes: "Primeira sessão - avaliação inicial"
  }
];

const MOCK_ACTIVE_CHATS = [
  {
    id: "1",
    patientName: "João",
    psychologistName: "Dra.",
    lastMessage: "..........",
    lastMessageTime: new Date(Date.now() - 3600000),
    unreadCount: 0,
    status: "online"
  },
  {
    id: "2",
    patientName: "João",
    psychologistName: "Dra.",
    lastMessage: ".....",
    lastMessageTime: new Date(Date.now() - 86400000),
    unreadCount: 2,
    status: "offline"
  }
];

const MOCK_PATIENT_PROGRESS = {
  sessionsCompleted: 5,
  nextMilestone: 10,
  progress: 50, // percentage
  lastSessionDate: new Date(Date.now() - 604800000), // 1 week ago
  improvements: ["Redução de ansiedade", "Melhora no sono", "Técnicas de mindfulness aprendidas"],
  goals: ["Desenvolver estratégias para lidar com estresse", "Melhorar comunicação interpessoal"]
};

const Dashboard = () => {
  const { user } = useAuth();
  const [recommendedPsychologists, setRecommendedPsychologists] = useState<RecommendedPsychologist[]>([]);
  
  const [appointments, setAppointments] = useState<AppointmentRequest[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  
  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        const response = await authApi.get('/psychologists/recommended');
        setRecommendedPsychologists(response.data);
      } catch (error) {
        console.error("Erro ao buscar psicólogos recomendados: ", error);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await authApi.get('/schedule');
        setAppointments(response.data);
      } catch (err) {
        console.error("Erro ao buscar consultas:", err);
      } finally {
        setLoadingAppointments(false);
      }
    };
    
    if (user?.role === UserRole.PATIENT) {
      fetchPsychologists();
    }

    fetchAppointments();
  }, [user]);
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  const isPatient = user.role === UserRole.PATIENT;

  if (isPatient) {
    const patientUser = user as Patient;
    
    if (!patientUser.anamnesisCompleted) {
      return <Navigate to="/anamnese" />;
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 py-8">
          {/* Header com informações do usuário */}
          <div className="mb-8 bg-vivaleve-50/50 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Olá, {user.name}</h1>
                <p className="text-muted-foreground">Bem-vindo ao seu painel de controle. Aqui você encontra seus psicólogos recomendados, conversas e sessões.</p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <User className="w-5 h-5 text-vivaleve-600 mr-2" />
                    <span className="font-medium">Seu progresso</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div className="bg-vivaleve-600 h-2.5 rounded-full" style={{ width: `${MOCK_PATIENT_PROGRESS.progress}%` }}></div>
                    </div>
                    <span className="text-sm">{MOCK_PATIENT_PROGRESS.progress}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {MOCK_PATIENT_PROGRESS.sessionsCompleted} sessões concluídas
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Resumo rápido em cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Card className="bg-white/70">
              <CardContent className="p-4 flex items-center">
                <div className="bg-vivaleve-100 p-3 rounded-full mr-4">
                  <Calendar className="w-5 h-5 text-vivaleve-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Próxima Sessão</p>
                  <p className="text-lg font-bold">{
                    MOCK_UPCOMING_SESSIONS.length > 0 
                      ? getWeekdayNameTitle(MOCK_UPCOMING_SESSIONS[0].date) 
                      : "Nenhuma"
                  }</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/70">
              <CardContent className="p-4 flex items-center">
                <div className="bg-vivaleve-100 p-3 rounded-full mr-4">
                  <MessageSquare className="w-5 h-5 text-vivaleve-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Mensagens não lidas</p>
                  <p className="text-lg font-bold">{
                    MOCK_ACTIVE_CHATS.reduce((sum, chat) => sum + chat.unreadCount, 0)
                  }</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Objetivos e melhorias */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <ChartPie className="w-6 h-6 mr-2 text-vivaleve-600" />
              Seu Progresso
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <CardHeader className="bg-vivaleve-50 pb-3">
                  <CardTitle className="text-xl">Melhorias Observadas</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {MOCK_PATIENT_PROGRESS.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-center">
                        <div className="bg-vivaleve-100 p-1 rounded-full mr-2">

                        </div>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardHeader className="bg-vivaleve-50 pb-3">
                  <CardTitle className="text-xl">Objetivos</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {MOCK_PATIENT_PROGRESS.goals.map((goal, index) => (
                      <li key={index} className="flex items-center">
                        <div className="bg-gray-100 p-1 rounded-full mr-2">

                        </div>
                        {goal}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Psychologists Recommended */}
          <PsychologistsRecommended psychologists={recommendedPsychologists} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming Sessions */}
           <AppointmentsList role={UserRole.PATIENT} appointments={appointments} />
              
            {/* Active Chats */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <MessageSquare className="w-6 h-6 mr-2 text-vivaleve-600" />
                Conversas Ativas
              </h2>
              {MOCK_ACTIVE_CHATS.length > 0 ? (
                <Card>
                  <CardContent className="p-0">
                    <ul className="divide-y">
                      {MOCK_ACTIVE_CHATS.map((chat) => (
                        <li key={chat.id} className="p-4 hover:bg-muted/10 transition-colors">
                          <Link to={`/chat/${chat.id}`} className="block">
                            <div className="flex justify-between items-center mb-1">
                              <div className="flex items-center">
                                <div className="relative mr-3">
                                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg font-semibold text-muted-foreground">
                                    {chat.psychologistName.charAt(0)}
                                  </div>
                                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${chat.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                </div>
                                <div>
                                  <h3 className="font-medium">{chat.psychologistName}</h3>
                                  <p className="text-xs text-muted-foreground">
                                    {chat.status === 'online' ? 'Online agora' : 'Offline'}
                                  </p>
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {getWeekdayNameTitle(chat.lastMessageTime)}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground flex justify-between pl-12">
                              <span className="truncate flex-1 mr-2">
                                {chat.lastMessage}
                              </span>
                              {chat.unreadCount > 0 && (
                                <span className="bg-vivaleve-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                  {chat.unreadCount}
                                </span>
                              )}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="mb-4 text-muted-foreground">Você não tem conversas ativas no momento.</p>
                    <Button variant="outline">
                      Iniciar Conversa
                    </Button>
                  </CardContent>
                </Card>
              )}
            </section>
          </div>
        </div>
      </div>
    );
  }
  
  // Check if user is a Psychologist and render psychologist dashboard
  const isPsychologist = user.role === UserRole.PSYCHOLOGIST;
  if (isPsychologist) {
    const psychologistUser = user as Psychologist;
    
    // If profile is not approved yet, show pending approval screen
    if (!psychologistUser.isApproved) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Perfil Em Análise</CardTitle>
              <CardDescription>
                Seu perfil está atualmente sob revisão por nossa equipe.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Agradecemos por se juntar à VivaLeve! Estamos revisando suas credenciais e informações para garantir a qualidade de nossa plataforma. 
                Este processo geralmente leva 2-3 dias úteis.
              </p>
              <p>
                Você receberá uma notificação por e-mail assim que seu perfil for aprovado.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 py-8">
          {/* Header com informações do usuário */}
          <div className="mb-8 bg-vivaleve-50/50 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Olá, {user.name}</h1>
                <p className="text-muted-foreground">Bem-vindo ao seu painel profissional. Gerencie seus pacientes, solicitações e sessões agendadas aqui.</p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-medium text-lg">Avaliação média</p>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400 mr-1">
                      {Array(5).fill(0).map((_, i) => (
                        <svg key={i} viewBox="0 0 24 24" className={`w-4 h-4 ${i < 5 ? "fill-current" : "stroke-current fill-none"}`}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ))}
                    </div>
                    <span className="font-bold">5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Resumo rápido em cards */}
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-3 mb-8">
            <Card className="bg-white/70">
              <CardContent className="p-4 flex items-center">
                <div className="bg-vivaleve-100 p-3 rounded-full mr-4">
                  <Users className="w-5 h-5 text-vivaleve-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Pacientes</p>
                  <p className="text-lg font-bold">0</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/70">
              <CardContent className="p-4 flex items-center">
                <div className="bg-vivaleve-100 p-3 rounded-full mr-4">
                  <Calendar className="w-5 h-5 text-vivaleve-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Sessões este mês</p>
                  <p className="text-lg font-bold">0</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/70">
              <CardContent className="p-4 flex items-center">
                <div className="bg-vivaleve-100 p-3 rounded-full mr-4">
                  <Bell className="w-5 h-5 text-vivaleve-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Solicitações</p>
                  <p className="text-lg font-bold">0</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Patient Requests */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Bell className="w-6 h-6 mr-2 text-vivaleve-600" />
                Solicitações de Pacientes
              </h2>
              {appointments.length > 0 ? (
                <Card>
                  <CardContent className="p-0">
                    <ul className="divide-y">
                      {appointments.map((appointment) => (
                        <li key={appointment.id} className="p-4 hover:bg-muted/10 transition-colors">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <div className="bg-vivaleve-100 p-2 rounded-full mr-3">
                                <Clock className="w-4 h-4 text-vivaleve-600" />
                              </div>
                              <h3 className="font-medium">
                                {appointment.requester.name}
                              </h3>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              appointment.status === 'accepted' 
                                ? 'bg-green-100 text-green-800' 
                                : appointment.status === 'declined' 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {appointment.status === 'accepted' ? 'Confirmado' : 
                              appointment.status === 'declined' ? 'Recusado' : 'Pendente'}
                            </span>
                          </div>
                          <div className="pl-11">
                            <div className="text-sm text-muted-foreground flex justify-between items-center">
                              <span>
                                {getWeekdayNameTitle(new Date(appointment.schedule.date))} · 
                                {formatTime(appointment.schedule.startTime)} - {formatTime(appointment.schedule.endTime)}
                              </span>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  className="bg-vivaleve-600 hover:bg-vivaleve-700"
                                  asChild
                                >
                                  <Link to={`/appointments/${appointment.id}`}>
                                    Detalhes
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="mb-4 text-muted-foreground">Você não tem solicitações de sessões no momento.</p>
                  </CardContent>
                </Card>
              )}
            </section>
            
            {/* Upcoming Sessions */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-vivaleve-600" />
                Sessões Agendadas
              </h2>
              {appointments.length > 0 ? (
                <Card>
                  <CardContent className="p-0">
                    <ul className="divide-y">
                      {MOCK_UPCOMING_SESSIONS.map((session) => (
                        <li key={session.id} className="p-4 hover:bg-muted/10 transition-colors">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <div className="bg-vivaleve-100 p-2 rounded-full mr-3">
                                <Clock className="w-4 h-4 text-vivaleve-600" />
                              </div>
                              <h3 className="font-medium">{session.patientName}</h3>
                            </div>
                            <span className="bg-vivaleve-100 text-vivaleve-800 text-xs px-2 py-1 rounded-full">
                              {getWeekdayNameTitle(session.date)}
                            </span>
                          </div>
                          <div className="pl-11">
                            <p className="text-sm font-medium mb-1">{session.topic}</p>
                            <p className="text-xs text-muted-foreground mb-3">{session.notes}</p>
                            <div className="text-sm text-muted-foreground flex justify-between items-center">
                              <span>
                                {getWeekdayNameTitle(session.date)}
                              </span>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  Reagendar
                                </Button>
                                <Button size="sm" className="bg-vivaleve-600 hover:bg-vivaleve-700">
                                  Detalhes
                                </Button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">Você não tem sessões agendadas no momento.</p>
                  </CardContent>
                </Card>
              )}
            </section>
          </div>
          
          {/* Active Chats */}
          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <MessageSquare className="w-6 h-6 mr-2 text-vivaleve-600" />
              Conversas Ativas
            </h2>
            {MOCK_ACTIVE_CHATS.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <ul className="divide-y">
                    {MOCK_ACTIVE_CHATS.map((chat) => (
                      <li key={chat.id} className="p-4 hover:bg-muted/50 transition-colors">
                        <Link to={`/chat/${chat.id}`} className="block">
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                              <div className="relative mr-3">
                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg font-semibold text-muted-foreground">
                                  {chat.patientName.charAt(0)}
                                </div>
                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${chat.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                              </div>
                              <div>
                                <h3 className="font-medium">{chat.patientName}</h3>
                                <p className="text-xs text-muted-foreground">
                                  {chat.status === 'online' ? 'Online agora' : 'Offline'}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {getWeekdayNameTitle(chat.lastMessageTime)}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground flex justify-between pl-12">
                            <span className="truncate flex-1 mr-2">
                              {chat.lastMessage}
                            </span>
                            {chat.unreadCount > 0 && (
                              <span className="bg-vivaleve-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                {chat.unreadCount}
                              </span>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Você não tem conversas ativas no momento.</p>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </div>
    );
  }
  
  // If user is neither patient nor psychologist
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Tipo de usuário não suportado</h1>
        <p className="mb-6">Seu tipo de conta não tem acesso ao painel de controle.</p>
        <Button asChild>
          <Link to="/">Voltar para a Página Inicial</Link>
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
