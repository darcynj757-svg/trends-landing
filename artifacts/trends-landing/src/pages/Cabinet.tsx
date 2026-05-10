import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Copy, Wallet, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { InvestmentModal } from "@/components/InvestmentModal";

export default function Cabinet() {
  const { toast } = useToast();
  const [isInvestOpen, setIsInvestOpen] = useState(false);
  const [balance, setBalance] = useState(10000);
  const [history, setHistory] = useState([
    { date: "2026-04-12", source: "RevShare выплата (Реклама)", amount: 145.50, status: "Успешно" },
    { date: "2026-04-10", source: "MLM бонус (Уровень 1)", amount: 300.00, status: "Успешно" },
    { date: "2026-04-05", source: "Покупка пакета Growth", amount: 10000.00, status: "Успешно" }
  ]);

  useEffect(() => {
    const savedBalance = localStorage.getItem("trends_balance");
    if (savedBalance) setBalance(parseFloat(savedBalance));
    else localStorage.setItem("trends_balance", "10000");

    const savedHistory = localStorage.getItem("trends_history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    else localStorage.setItem("trends_history", JSON.stringify(history));
  }, []);

  const copyRef = () => {
    navigator.clipboard.writeText("https://trends.app/ref/trnd_8x9a2");
    toast({ title: "Ссылка скопирована!" });
  };

  const handleWithdraw = () => {
    toast({ title: "Минимальная сумма вывода $100", description: "Доступно $1,200", variant: "default" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <nav className="fixed top-0 w-full z-50 glass-card border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              <span className="font-bold text-xl text-gradient">Trends</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-muted px-4 py-1.5 rounded-full border border-border">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium">Alexey_Crypto</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-28 space-y-8">
        <div>
          <h1 className="text-3xl font-black mb-2">Добро пожаловать, Alexey!</h1>
          <p className="text-muted-foreground">Панель управления инвестора</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border-border">
            <h3 className="text-muted-foreground font-medium mb-2">Общий баланс инвестиций</h3>
            <div className="text-4xl font-black">${balance.toLocaleString()}</div>
            <p className="text-sm text-primary mt-2">Доля в Investor Pool: 2.3% (Growth)</p>
          </div>
          <div className="glass-card p-6 rounded-2xl border-border">
            <h3 className="text-muted-foreground font-medium mb-2">Начислено USDT</h3>
            <div className="text-4xl font-black text-green-400">$2,847.50</div>
            <p className="text-sm text-muted-foreground mt-2">+12% за последний месяц</p>
          </div>
          <div className="glass-card p-6 rounded-2xl border-border flex flex-col justify-between">
            <div>
              <h3 className="text-muted-foreground font-medium mb-2">Доступно к выводу</h3>
              <div className="text-4xl font-black">$1,200.00</div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleWithdraw} className="flex-1 bg-primary/20 text-primary hover:bg-primary/30">Вывести</Button>
              <Button onClick={() => setIsInvestOpen(true)} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 neon-glow">Пополнить</Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card rounded-2xl p-6 border-border">
              <h2 className="text-xl font-bold mb-6">История начислений</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="pb-3 font-medium">Дата</th>
                      <th className="pb-3 font-medium">Источник</th>
                      <th className="pb-3 font-medium text-right">Сумма</th>
                      <th className="pb-3 font-medium text-right">Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item, i) => (
                      <tr key={i} className="border-b border-border/50 last:border-0">
                        <td className="py-4 text-sm">{item.date}</td>
                        <td className="py-4 font-medium">{item.source}</td>
                        <td className="py-4 text-right font-bold text-green-400">+${item.amount.toFixed(2)}</td>
                        <td className="py-4 text-right">
                          <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-medium">{item.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass-card rounded-2xl p-6 border-border">
              <h2 className="text-xl font-bold mb-4">Партнерская программа</h2>
              <div className="space-y-4">
                <div className="bg-background p-3 rounded-lg border border-border flex items-center justify-between">
                  <span className="text-sm font-mono truncate mr-4 text-muted-foreground">trends.app/ref/trnd_8x9a2</span>
                  <Button variant="ghost" size="icon" onClick={copyRef}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2 mt-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Уровень 1 (10%)</span>
                    <span className="font-bold">12 чел. <span className="text-green-400 ml-1">$3,600</span></span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Уровень 2 (5%)</span>
                    <span className="font-bold">34 чел. <span className="text-green-400 ml-1">$5,100</span></span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Уровень 3 (3%)</span>
                    <span className="font-bold">89 чел. <span className="text-green-400 ml-1">$8,010</span></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border-border text-center">
              <Wallet className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-bold mb-2">Привязка кошелька</h3>
              <p className="text-sm text-muted-foreground mb-4">Подключите TON или MetaMask для автоматических выплат RevShare.</p>
              <Button variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary/10">
                Подключить кошелек
              </Button>
            </div>
          </div>
        </div>
      </main>

      <InvestmentModal isOpen={isInvestOpen} onClose={() => setIsInvestOpen(false)} />
    </div>
  );
}
