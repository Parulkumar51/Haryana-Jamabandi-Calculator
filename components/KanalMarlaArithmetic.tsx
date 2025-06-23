
import React, { useState, useCallback } from 'react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

const PlusCircleIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const KanalMarlaArithmetic: React.FC = () => {
  const [kanal1, setKanal1] = useState<string>('');
  const [marla1, setMarla1] = useState<string>('');
  const [kanal2, setKanal2] = useState<string>('');
  const [marla2, setMarla2] = useState<string>('');

  const [resultKanal, setResultKanal] = useState<number | null>(null);
  const [resultMarla, setResultMarla] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateSum = useCallback(() => {
    setError(null);
    setResultKanal(null);
    setResultMarla(null);

    const k1 = parseInt(kanal1) || 0;
    const m1 = parseInt(marla1) || 0;
    const k2 = parseInt(kanal2) || 0;
    const m2 = parseInt(marla2) || 0;

    if (k1 < 0 || m1 < 0 || k2 < 0 || m2 < 0) {
      setError("Kanal and Marla values must be non-negative.");
      return;
    }
    if (m1 >= 20 || m2 >= 20) {
        setError("Marla value cannot be 20 or more. It should be converted to Kanal.");
        return;
    }

    let totalMarla = m1 + m2;
    let extraKanalFromMarla = Math.floor(totalMarla / 20);
    let remainingMarla = totalMarla % 20;
    let totalKanal = k1 + k2 + extraKanalFromMarla;

    setResultKanal(totalKanal);
    setResultMarla(remainingMarla);
  }, [kanal1, marla1, kanal2, marla2]);

  return (
    <Card title="Kanal/Marla Addition" icon={<PlusCircleIcon />}>
      {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md text-sm mb-4">{error}</p>}
      
      <div className="space-y-4">
        <p className="text-slate-300 text-sm">Enter two Kanal/Marla amounts to add them (1 Kanal = 20 Marla).</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-700/30 rounded-lg">
          <div>
            <h4 className="text-lg font-medium text-slate-200 mb-2">First Amount</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Kanal 1" type="number" value={kanal1} onChange={e => setKanal1(e.target.value)} placeholder="Kanal" />
              <Input label="Marla 1" type="number" value={marla1} onChange={e => setMarla1(e.target.value)} placeholder="Marla" />
            </div>
          </div>
          <div>
            <h4 className="text-lg font-medium text-slate-200 mb-2">Second Amount</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Kanal 2" type="number" value={kanal2} onChange={e => setKanal2(e.target.value)} placeholder="Kanal" />
              <Input label="Marla 2" type="number" value={marla2} onChange={e => setMarla2(e.target.value)} placeholder="Marla" />
            </div>
          </div>
        </div>
      </div>

      <Button onClick={calculateSum} className="w-full md:w-auto mt-6">Calculate Sum</Button>

      {(resultKanal !== null && resultMarla !== null) && (
        <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
          <p className="text-xl font-semibold">Result: 
            <span className="text-sky-400 ml-2">{resultKanal} Kanal, {resultMarla} Marla</span>
          </p>
        </div>
      )}
    </Card>
  );
};
    