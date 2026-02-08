import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Zap, 
  Star,
  Smartphone,
  Layout,
  Heart,
  Package,
  Sparkles
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 overflow-x-hidden">
      {/* Navigation - Simple translucent for landing */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center bg-white/10 dark:bg-dark-950/10 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-slate-900 dark:text-white">ShopEase</span>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="text-sm font-bold text-slate-700 dark:text-dark-200 hover:text-primary-500 transition-colors"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-500 dark:text-primary-400 text-sm font-bold mb-8 animate-fade-in">
            <Zap className="w-4 h-4" />
            <span>Next-Gen E-Commerce Experience</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-display font-black text-slate-900 dark:text-white mb-6 leading-tight animate-slide-up">
            Elegance in Every <span className="gradient-text">Purchase.</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-slate-500 dark:text-dark-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
            Discover a curated collection of premium gadgets, high-performance electronics, and lifestyle essentials. Built with speed, security, and a stunning interface for the modern shopper.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <button 
              onClick={() => navigate('/shop')}
              className="btn-primary px-8 py-4 rounded-2xl flex items-center gap-2 text-lg shadow-glow w-full sm:w-auto justify-center"
            >
              Start Shopping
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="btn-secondary px-8 py-4 rounded-2xl w-full sm:w-auto"
            >
              Join Our Community
            </button>
          </div>

          {/* Product Teaser Preview */}
          <div className="mt-20 relative max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="aspect-[16/9] rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-dark-700 shadow-2xl relative">
               {/* Mock UI Frame */}
               <div className="absolute inset-0 bg-slate-50 dark:bg-dark-900/50 p-4 sm:p-8">
                  <div className="w-full h-full bg-white dark:bg-dark-800 rounded-2xl shadow-inner border border-slate-200 dark:border-dark-700 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                       <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-400" />
                          <div className="w-3 h-3 rounded-full bg-amber-400" />
                          <div className="w-3 h-3 rounded-full bg-emerald-400" />
                       </div>
                       <div className="h-4 w-48 bg-slate-100 dark:bg-dark-700 rounded-full" />
                       <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-dark-700" />
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-dark-700" />
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1 overflow-hidden">
                      {/* Premium Ecosystem Preview */}
                      {[
                        { name: 'Quantum Pro Laptop', cat: 'Electronics', icon: <Zap className="w-8 h-8 text-primary-500" /> },
                        { name: 'Acoustic Elite', cat: 'Audio', icon: <Sparkles className="w-8 h-8 text-accent-500" /> },
                        { name: 'Smart Vision Watch', cat: 'Wearables', icon: <Smartphone className="w-8 h-8 text-emerald-500" /> }
                      ].map((p, i) => (
                        <div key={i} className="rounded-2xl bg-white dark:bg-dark-900 p-5 border border-slate-200 dark:border-dark-700 shadow-lg flex flex-col items-center justify-center text-center gap-4 group hover:scale-105 transition-transform duration-500">
                          <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-dark-800 flex items-center justify-center group-hover:bg-primary-500/10 transition-colors">
                             {p.icon}
                          </div>
                          <div className="space-y-1">
                             <div className="h-4 w-16 bg-primary-500/10 rounded-full mx-auto" />
                             <h5 className="font-bold text-slate-800 dark:text-white text-sm">{p.name}</h5>
                             <div className="h-3 w-12 bg-slate-100 dark:bg-dark-700 rounded-full mx-auto" />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Centered Floating Platform Info */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 max-w-sm w-full bg-white/95 dark:bg-dark-800/95 backdrop-blur-xl rounded-[2rem] border border-primary-500/20 shadow-2xl flex flex-col items-center gap-6 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                           <Layout className="w-8 h-8 text-white" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-xl font-black dark:text-white uppercase tracking-tighter">Premium Marketplace</h4>
                          <p className="text-sm text-slate-500 dark:text-dark-400">Experience high-speed shopping with our sleek, localized interface.</p>
                        </div>
                        <div className="flex gap-2 w-full pt-2">
                           <div className="flex-1 h-10 rounded-xl bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-dark-700" />
                           <div className="flex-1 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">Fast Checkout</div>
                        </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Multi-Grid */}
      <section className="py-24 bg-slate-50 dark:bg-dark-900/40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
             <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">Why Choose <span className="gradient-text">ShopEase?</span></h2>
             <p className="text-slate-500 dark:text-dark-400">Everything you need for a seamless shopping experience.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6 text-emerald-500" />}
              title="Secure Checkout"
              description="Enterprise-grade encryption for all your transactions and personal data."
            />
            <FeatureCard 
              icon={<Truck className="w-6 h-6 text-primary-500" />}
              title="Flash delivery"
              description="Get your favorite gadgets delivered to your doorstep within 24-48 hours."
            />
             <FeatureCard 
              icon={<Heart className="w-6 h-6 text-red-500" />}
              title="Smart Wishlist"
              description="One-tap favorites with cloud syncing across all your devices."
            />
             <FeatureCard 
              icon={<Smartphone className="w-6 h-6 text-amber-500" />}
              title="Mobile First"
              description="A responsive interface optimized for the best experience on any device."
            />
          </div>
        </div>
      </section>

      {/* Trust Quote / Stats */}
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-6 h-6 text-amber-500 fill-current" />)}
          </div>
          <h3 className="text-2xl lg:text-3xl font-display font-bold text-slate-800 dark:text-white mb-6 italic">
            "ShopEase has completely redefined how I shop online. The interface is intuitive, the performance is blazing fast, and the curated selection is always top-notch."
          </h3>
          <div className="flex items-center justify-center gap-4">
             <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">V</div>
             <div className="text-left">
                <p className="font-bold dark:text-white">Venkat</p>
                <p className="text-sm text-slate-500">Premium Member & Tech Enthusiast</p>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-br from-primary-600 to-accent-600 p-12 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-6xl font-display font-black mb-6">Ready to elevate your <br/> shopping experience?</h2>
            <p className="text-xl text-white/80 mb-10 max-w-xl mx-auto font-medium">
              Join thousands of happy customers and start exploring our premium catalog today.
            </p>
            <button 
              onClick={() => navigate('/shop')}
              className="bg-white text-primary-600 px-10 py-4 rounded-2xl text-xl font-bold hover:scale-105 transition-transform shadow-xl"
            >
              Get Started Now
            </button>
          </div>
          {/* Decorative shapes for CTA */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-dark-800 text-center">
          <p className="text-slate-500 dark:text-dark-500 text-sm">
            ABCDE: Accelerating Business with Cutting-edge Digital Excellence
          </p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-dark-800 p-8 rounded-3xl border border-slate-200 dark:border-dark-700/50 hover:shadow-xl hover:border-primary-500/20 transition-all group">
    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-dark-900/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h4 className="text-xl font-bold text-slate-800 dark:text-dark-100 mb-3">{title}</h4>
    <p className="text-slate-500 dark:text-dark-400 text-sm leading-relaxed">{description}</p>
  </div>
);

export default HomePage;
