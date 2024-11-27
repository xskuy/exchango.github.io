"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AddCryptocurrency() {
  const [cryptos, setCryptos] = useState([
    { id: 1, symbol: "BTC", name: "Bitcoin", marketValue: 30000 },
    { id: 2, symbol: "ETH", name: "Ethereum", marketValue: 2000 },
  ]);

  const [newCrypto, setNewCrypto] = useState({ symbol: "", name: "", marketValue: "" });

  const handleAddCrypto = () => {
    setCryptos([...cryptos, { id: cryptos.length + 1, ...newCrypto, marketValue: parseFloat(newCrypto.marketValue) }]);
    setNewCrypto({ symbol: "", name: "", marketValue: "" });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Agregar Criptomonedas</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="symbol">Símbolos</Label>
          <Input
            id="symbol"
            value={newCrypto.symbol}
            onChange={(e) => setNewCrypto({ ...newCrypto, symbol: e.target.value })}
            placeholder="Ej: BTC"
          />
        </div>
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            value={newCrypto.name}
            onChange={(e) => setNewCrypto({ ...newCrypto, name: e.target.value })}
            placeholder="Ej: Bitcoin"
          />
        </div>
        <div>
          <Label htmlFor="marketValue">Valor de Mercado</Label>
          <Input
            id="marketValue"
            type="number"
            value={newCrypto.marketValue}
            onChange={(e) => setNewCrypto({ ...newCrypto, marketValue: e.target.value })}
            placeholder="Ej: 30000"
          />
        </div>
      </div>
      <Button onClick={handleAddCrypto}>Agregar Criptomoneda</Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Símbolo</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Valor de Mercado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cryptos.map((crypto) => (
            <TableRow key={crypto.id}>
              <TableCell>{crypto.symbol}</TableCell>
              <TableCell>{crypto.name}</TableCell>
              <TableCell>${crypto.marketValue.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
