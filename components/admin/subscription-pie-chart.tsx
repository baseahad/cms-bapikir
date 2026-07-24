"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type PlanDistribution = {
  plan: string;
  count: number;
};

const PLAN_COLORS: Record<string, string> = {
  FREE: "hsl(var(--muted-foreground))",
  BASIC: "hsl(210, 70%, 55%)",
  PRO: "hsl(260, 70%, 55%)",
  ULTIMATE: "hsl(150, 70%, 45%)",
};

export function SubscriptionPieChart({
  data,
}: {
  data: PlanDistribution[];
}) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Distribusi Paket</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="plan"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={65}
                strokeWidth={2}
                stroke="hsl(var(--background))"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.plan}
                    fill={PLAN_COLORS[entry.plan] ?? "hsl(var(--primary))"}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value} (${total > 0 ? Math.round((value / total) * 100) : 0}%)`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {data.map((item) => (
              <div key={item.plan} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{
                    backgroundColor:
                      PLAN_COLORS[item.plan] ?? "hsl(var(--primary))",
                  }}
                />
                <span className="text-sm">
                  {item.plan}{" "}
                  <span className="text-muted-foreground">({item.count})</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
