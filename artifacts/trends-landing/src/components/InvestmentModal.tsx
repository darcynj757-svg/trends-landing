import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Loader2, Wallet } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export const PACKAGES = [
  { id: "founder1", name: "Основателей 1", price: 100, monthly: 0, shares: 0, exit: "–" },
  { id: "founder2", name: "Основателей 2", price: 250, monthly: 5, shares: 0.26, exit: "2,000–5,000" },
  { id: "founder3", name: "Основателей 3", price: 1000, monthly: 20, shares: 1.3, exit: "10,000–25,000", recommended: true },
  { id: "founder4", name: "Основателей 4", price: 5000, monthly: 100, shares: 10.04, exit: "75,000–180,000" },
  { id: "founder5", name: "Основателей 5", price: 25000, monthly: 500, shares: 65, exit: "500,000–1,200,000" },
  { id: "founder6", name: "Основателей 6", price: 100000, monthly: 2000, shares: 250, exit: "2,000,000–4,500,000" },
];

export function InvestmentModal({ isOpen, onClose, defaultPackage = "founder3" }: { isOpen: boolean; onClose: () => void; defaultPackage?: string }) {
  const [step, setStep] = useState(1);
  const [selectedPkg, setSelectedPkg] = useState(defaultPackage);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setWalletConnected(false);
      setIsConnecting(false);
      setIsConfirming(false);
      setSelectedPkg(defaultPackage);
      setName("");
      setContact("");
    }
  }, [isOpen, defaultPackage]);

  const handleConnectWallet = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setWalletConnected(true);
      setTimeout(() => setStep(4), 1000);
    }, 2000);
  };

  const handleConfirm = async () => {
    setIsConfirming(true);

    const pkg = PACKAGES.find(p => p.id === selectedPkg);

    try {
      const res = await fetch("/api/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          package: pkg?.name ?? selectedPkg,
          amount: pkg?.price ?? 0,
        }),
      });
      if (!res.ok) {
        console.error("Investment notification failed:", res.status, await res.text());
      }
    } catch (err) {
      console.error("Investment notification error:", err);
    }

    const history = JSON.parse(localStorage.getItem("trends_history") || "[]");
    history.push({
      date: new Date().toISOString().split('T')[0],
      source: `Покупка пакета ${pkg?.name}`,
      amount: pkg?.price,
      status: "Успешно"
    });
    localStorage.setItem("trends_history", JSON.stringify(history));

    let balance = parseFloat(localStorage.getItem("trends_balance") || "0");
    balance += pkg?.price || 0;
    localStorage.setItem("trends_balance", balance.toString());

    setIsConfirming(false);
    setStep(5);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-card-border text-card-foreground">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Выберите пакет</h2>
            <div className="grid gap-4">
              {PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPkg(pkg.id)}
                  className={`p-4 rounded-xl cursor-pointer border transition-all ${selectedPkg === pkg.id ? 'border-primary bg-primary/10 neon-glow' : 'border-card-border hover:border-primary/50'}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">{pkg.name} {pkg.recommended && <span className="text-xs text-primary ml-2">РЕКОМЕНДУЕМ</span>}</h3>
                      <p className="text-sm text-muted-foreground">Exit: ${pkg.exit}</p>
                    </div>
                    <div className="text-xl font-black">${pkg.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setStep(2)}>Продолжить</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Ваши данные</h2>
            <p className="text-sm text-muted-foreground text-center">Чтобы мы могли с вами связаться</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Имя</label>
                <Input
                  placeholder="Иван"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="bg-background border-card-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Telegram или телефон</label>
                <Input
                  placeholder="@username или +7..."
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  className="bg-background border-card-border"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 border-card-border" onClick={() => setStep(1)}>Назад</Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={!name.trim() || !contact.trim()}
                onClick={() => setStep(3)}
              >
                Продолжить
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 text-center py-8">
            <h2 className="text-2xl font-bold">Подключите кошелек</h2>
            {!walletConnected ? (
              <div className="grid gap-4 max-w-xs mx-auto">
                <Button variant="outline" className="h-14 border-card-border hover:border-primary/50" onClick={handleConnectWallet} disabled={isConnecting}>
                  {isConnecting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Wallet className="w-5 h-5 mr-2" />}
                  TON Wallet
                </Button>
                <Button variant="outline" className="h-14 border-card-border hover:border-primary/50" onClick={handleConnectWallet} disabled={isConnecting}>
                  {isConnecting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Wallet className="w-5 h-5 mr-2" />}
                  MetaMask
                </Button>
              </div>
            ) : (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                <p className="text-lg font-medium">Кошелёк подключён</p>
              </motion.div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 py-4">
            <h2 className="text-2xl font-bold text-center">Подтверждение</h2>
            <div className="bg-background p-6 rounded-xl space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Имя:</span>
                <span className="font-bold">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Контакт:</span>
                <span className="font-bold">{contact}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Пакет:</span>
                <span className="font-bold">{PACKAGES.find(p => p.id === selectedPkg)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Сумма:</span>
                <span className="font-bold">${PACKAGES.find(p => p.id === selectedPkg)?.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Кошелек:</span>
                <span className="font-mono text-sm">0x12...89ab</span>
              </div>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-bold" onClick={handleConfirm} disabled={isConfirming}>
              {isConfirming ? <Loader2 className="w-6 h-6 animate-spin" /> : "Подтвердить транзакцию"}
            </Button>
          </div>
        )}

        {step === 5 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-center py-8">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 neon-glow">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-black text-gradient">Успешно!</h2>
            <p className="text-muted-foreground text-lg">Инвестиция успешно совершена! Добро пожаловать в Trends Investor Club.</p>
            <Button className="w-full mt-6" variant="outline" onClick={() => {
              onClose();
              setLocation("/cabinet");
            }}>Перейти в кабинет</Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
