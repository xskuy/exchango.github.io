"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { ArrowUp, ArrowDown } from "lucide-react";

interface PopularCurrenciesProps {
  currencies: Array<{
    code: string;
    name: string;
    rate: number;
    change: number;
    change7d: number;
    up: boolean;
    volume: string;
    icon: React.ReactNode;
    sparklineData: number[];
  }>;
  onViewMore: () => void;
  onFavorite: (code: string) => void;
}

export default function PopularCurrencies({ currencies, onViewMore, onFavorite }: PopularCurrenciesProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Monedas Populares</CardTitle>
        <Button variant="ghost" onClick={onViewMore}>
          Ver más
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currencies.map((currency) => (
            <div
              key={currency.code}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-2">
                {currency.icon}
                <div>
                  <div className="font-medium">{currency.code}</div>
                  <div className="text-sm text-muted-foreground">
                    1 USD = {currency.rate} {currency.code}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-24 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={currency.sparklineData.map((value, index) => ({ value, index }))}>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={currency.up ? "#10b981" : "#ef4444"}
                        fill={currency.up ? "#10b98120" : "#ef444420"}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-right">
                  <div className={`flex items-center ${currency.up ? "text-green-500" : "text-red-500"}`}>
                    {currency.up ? <ArrowUp className="mr-1 h-4 w-4" /> : <ArrowDown className="mr-1 h-4 w-4" />}
                    {currency.change}%
                  </div>
                  <div className="text-sm text-muted-foreground">7d: {currency.change7d}%</div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onFavorite?.(currency.code)}>
                  <Star className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
