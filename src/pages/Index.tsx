import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Navegação */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-vivaleve-600" fill="currentColor">
              <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm0 3a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
            </svg>
            <span className="text-xl font-bold">VivaLeve</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#como-funciona" className="text-foreground hover:text-vivaleve-600 transition-colors">
              Como Funciona
            </a>
            <a href="#beneficios" className="text-foreground hover:text-vivaleve-600 transition-colors">
              Benefícios
            </a>
            <a href="#depoimentos" className="text-foreground hover:text-vivaleve-600 transition-colors">
              Depoimentos
            </a>
          </div>
          <div className="flex space-x-4">
            {user ? (
              <Button asChild className="bg-vivaleve-600 hover:bg-vivaleve-700">
                <Link to="/dashboard">Ir para Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" className="hidden sm:inline-flex border-vivaleve-600 text-vivaleve-600 hover:bg-vivaleve-50">
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button asChild className="bg-vivaleve-600 hover:bg-vivaleve-700">
                  <Link to="/cadastro">Começar</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Seção Hero */}
      <section className="container mx-auto px-4 py-20 md:py-32 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 max-w-4xl title-gradient">
          Encontre o psicólogo ideal para suas necessidades
        </h1>
        <p className="text-xl text-center text-muted-foreground mb-10 max-w-2xl">
          Nosso sistema avançado de correspondência conecta você com o psicólogo perfeito baseado em uma anamnese psicológica completa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="bg-vivaleve-600 hover:bg-vivaleve-700">
            <Link to="/cadastro">Comece Sua Jornada</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-vivaleve-600 text-vivaleve-600 hover:bg-vivaleve-50">
            <Link to="#como-funciona">Saiba Mais</Link>
          </Button>
        </div>
      </section>

      {/* Seção Como Funciona */}
      <section id="como-funciona" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Como o VivaLeve Funciona</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-vivaleve-100 flex items-center justify-center mb-6">
              <span className="text-2xl font-bold text-vivaleve-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Complete a Anamnese</h3>
            <p className="text-muted-foreground">
              Faça nossa avaliação psicológica completa para nos ajudar a entender suas necessidades.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-vivaleve-100 flex items-center justify-center mb-6">
              <span className="text-2xl font-bold text-vivaleve-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Seja Correspondido</h3>
            <p className="text-muted-foreground">
              Nosso algoritmo conecta você com psicólogos especializados em suas necessidades específicas.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-vivaleve-100 flex items-center justify-center mb-6">
              <span className="text-2xl font-bold text-vivaleve-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Conecte-se e Comece a Terapia</h3>
            <p className="text-muted-foreground">
              Agende sessões com o psicólogo escolhido e comece seu caminho para o bem-estar.
            </p>
          </div>
        </div>
      </section>

      {/* Seção Benefícios */}
      <section id="beneficios" className="py-20 bg-gradient-to-b from-vivaleve-50 to-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Por Que Escolher o VivaLeve</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-8 rounded-lg shadow-md border border-vivaleve-100">
              <div className="w-12 h-12 rounded-full bg-vivaleve-100 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-vivaleve-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Correspondência Precisaa</h3>
              <p className="text-muted-foreground">
                Nosso sofisticado algoritmo garante que você seja conectado com psicólogos especializados em suas necessidades específicas, resultando em terapia mais eficaz.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md border border-vivaleve-100">
              <div className="w-12 h-12 rounded-full bg-vivaleve-100 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-vivaleve-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Agendamento Conveniente</h3>
              <p className="text-muted-foreground">
                Agende e gerencie facilmente suas sessões através de nossa plataforma, com integração de calendário e lembretes.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md border border-vivaleve-100">
              <div className="w-12 h-12 rounded-full bg-vivaleve-100 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-vivaleve-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Comunicação Segura</h3>
              <p className="text-muted-foreground">
                Nossa plataforma possui mensagens criptografadas de ponta a ponta, garantindo que suas conversas permaneçam privadas e confidenciais.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md border border-vivaleve-100">
              <div className="w-12 h-12 rounded-full bg-vivaleve-100 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-vivaleve-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Profissionais Verificados</h3>
              <p className="text-muted-foreground">
                Todos os psicólogos em nossa plataforma são licenciados, rigorosamente avaliados e têm suas credenciais verificadas por nossa equipe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Depoimentos */}
      <section id="depoimentos" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">O Que Nossos Usuários Dizem</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-vivaleve-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-vivaleve-200 flex items-center justify-center mr-4">
                <span className="text-xl font-bold text-vivaleve-600">M</span>
              </div>
              <div>
                <h4 className="font-semibold">Maria S.</h4>
                <p className="text-sm text-muted-foreground">Paciente</p>
              </div>
            </div>
            <p className="text-muted-foreground italic">
              "O processo de correspondência foi tão preciso. Tenho trabalhado com meu psicólogo há 3 meses, e tem sido transformador."
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-vivaleve-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-vivaleve-200 flex items-center justify-center mr-4">
                <span className="text-xl font-bold text-vivaleve-600">R</span>
              </div>
              <div>
                <h4 className="font-semibold">Dr. Roberto K.</h4>
                <p className="text-sm text-muted-foreground">Psicólogo</p>
              </div>
            </div>
            <p className="text-muted-foreground italic">
              "Como psicólogo, aprecio como o VivaLeve me conecta com pacientes que posso realmente ajudar. A plataforma é intuitiva e segura."
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-vivaleve-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-vivaleve-200 flex items-center justify-center mr-4">
                <span className="text-xl font-bold text-vivaleve-600">T</span>
              </div>
              <div>
                <h4 className="font-semibold">Thomás L.</h4>
                <p className="text-sm text-muted-foreground">Paciente</p>
              </div>
            </div>
            <p className="text-muted-foreground italic">
              "Eu estava hesitante no início, mas o processo de anamnese realmente me ajudou a encontrar um psicólogo que entende meus desafios específicos."
            </p>
          </div>
        </div>
      </section>

      {/* Chamada para Ação */}
      <section className="py-20 bg-gradient-to-r from-vivaleve-400 to-vivaleve-300 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para Começar Sua Jornada?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Junte-se a milhares que encontraram a correspondência certa para suas necessidades de apoio psicológico.
          </p>
          <Button asChild size="lg" className="bg-white text-vivaleve-700 hover:bg-gray-100">
            <Link to="/cadastro">Crie Sua Conta</Link>
          </Button>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-vivaleve-600" fill="currentColor">
                  <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm0 3a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
                </svg>
                <span className="text-lg font-bold">VivaLeve</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Conectando pacientes com o apoio psicológico certo através de correspondência avançada.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Plataforma</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-vivaleve-600">Como Funciona</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-vivaleve-600">Para Pacientes</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-vivaleve-600">Para Psicólogos</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-vivaleve-600">Preços</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-vivaleve-600">Sobre Nós</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-vivaleve-600">Carreiras</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-vivaleve-600">Blog</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-vivaleve-600">Imprensa</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-vivaleve-600">Política de Privacidade</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-vivaleve-600">Termos de Serviço</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-vivaleve-600">Política de Cookies</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-vivaleve-600">Conformidade LGPD</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} VivaLeve. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;