import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Wallet, Users, BarChart3, Shield, ArrowRight } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-xl text-foreground">TripTrack</span>
          </div>
          <Link to="/auth">
            <Button className="btn-hero">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="container mx-auto px-4 py-16 md:py-24 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground max-w-3xl mx-auto leading-tight">
            Track expenses together,
            <span className="text-primary"> travel worry-free</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            The simplest way for your trip group to track who spent what. 
            No more spreadsheets or awkward calculations.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="btn-hero text-lg px-8">
                Start Tracking
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="stat-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Personal Tracking
              </h3>
              <p className="text-muted-foreground">
                Add your expenses with descriptions and categories. See your total spending at a glance.
              </p>
            </div>

            <div className="stat-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Team Overview
              </h3>
              <p className="text-muted-foreground">
                See who spent how much. Track the total team expenses and individual contributions.
              </p>
            </div>

            <div className="stat-card animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Secure & Private
              </h3>
              <p className="text-muted-foreground">
                Only you can edit or delete your expenses. No one can modify your records.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-16">
          <div className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center border border-primary/10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready for your next trip?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create an account and invite your travel buddies. Start tracking in seconds.
            </p>
            <Link to="/auth">
              <Button size="lg" className="btn-hero">
                Create Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border">
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <Wallet className="w-4 h-4 mr-2 text-primary" />
          TripTrack — Made for travelers
        </div>
      </footer>
    </div>
  );
};

export default Index;
