"use client";

import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Host Agent ROI Calculator – drop-in React component
// Using shadcn/ui components with Tailwind CSS
// Assumptions are editable via the UI. All numbers are monthly unless noted.

export default function HostAgentRoiCalculator() {
  // --- Inputs ---
  const [currency, setCurrency] = useState<"GBP" | "USD" | "EUR">("USD");
  const [properties, setProperties] = useState(3); // units
  const [avgMonthlyRevenue, setAvgMonthlyRevenue] = useState(2000); // per property
  const [managerFeePercent, setManagerFeePercent] = useState(20); // % of revenue
  const [aiPricePerProperty, setAiPricePerProperty] = useState(99); // SaaS price per unit
  const [ownerHourlyValue, setOwnerHourlyValue] = useState(30); // $/hour value of owner time
  const [hoursSavedPerWeek, setHoursSavedPerWeek] = useState(10); // per property
  const [conversionUpliftPercent, setConversionUpliftPercent] = useState(5); // % revenue lift via faster response

  // --- Helpers ---
  const symbol = useMemo(
    () => ({ GBP: "£", USD: "$", EUR: "€" }[currency]),
    [currency]
  );
  const fmt = (n: number) =>
    `${symbol}${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  const fmt2 = (n: number) =>
    `${symbol}${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  // --- Calculations ---
  // Human manager (short‑term rental) typical fee: 15–25% of gross
  const humanCost = properties * avgMonthlyRevenue * (managerFeePercent / 100);

  // SaaS cost
  const aiCost = properties * aiPricePerProperty;

  // Time value reclaimed if owner previously self‑managed
  const weeksPerMonth = 4.33;
  const ownerTimeSavedValue =
    properties * hoursSavedPerWeek * weeksPerMonth * ownerHourlyValue;

  // Extra revenue from faster lead response & consistent follow‑up
  const addedRevenue =
    properties * avgMonthlyRevenue * (conversionUpliftPercent / 100);

  // Net monthly impact vs scenarios
  const netVsHuman = humanCost - aiCost + addedRevenue; // replacing a human manager
  const netVsSelf = ownerTimeSavedValue - aiCost + addedRevenue; // owner self‑managed previously

  const roiVsHuman = aiCost > 0 ? (netVsHuman / aiCost) * 100 : 0;
  const roiVsSelf = aiCost > 0 ? (netVsSelf / aiCost) * 100 : 0;

  const perProperty = (n: number) => (properties > 0 ? n / properties : 0);

  // --- Quick presets ---
  function applyPreset(kind: "solo" | "small" | "pro") {
    if (kind === "solo") {
      setProperties(1);
      setAvgMonthlyRevenue(1800);
      setManagerFeePercent(20);
      setAiPricePerProperty(79);
      setOwnerHourlyValue(35);
      setHoursSavedPerWeek(8);
      setConversionUpliftPercent(5);
    } else if (kind === "small") {
      setProperties(5);
      setAvgMonthlyRevenue(2200);
      setManagerFeePercent(20);
      setAiPricePerProperty(89);
      setOwnerHourlyValue(40);
      setHoursSavedPerWeek(10);
      setConversionUpliftPercent(6);
    } else {
      setProperties(20);
      setAvgMonthlyRevenue(2500);
      setManagerFeePercent(18);
      setAiPricePerProperty(79);
      setOwnerHourlyValue(45);
      setHoursSavedPerWeek(12);
      setConversionUpliftPercent(5);
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6" id="calculator">
      <header className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">ROI Calculator</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Estimate monthly savings and ROI by replacing a human short‑term
          rental property manager or reclaiming your own time with our AI
          booking & guest‑messaging agent.
        </p>
      </header>

      {/* Controls */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Property Details</CardTitle>
            <CardDescription>
              Adjust the sliders to match your current situation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <Label className="font-medium">Currency</Label>
              <div className="flex gap-2">
                {(["USD", "GBP", "EUR"] as const).map((c) => (
                  <Button
                    key={c}
                    onClick={() => setCurrency(c)}
                    variant={currency === c ? "default" : "outline"}
                    size="sm"
                  >
                    {c}
                  </Button>
                ))}
              </div>
            </div>

            <Slider
              label={`Properties: ${properties}`}
              min={1}
              max={200}
              step={1}
              value={properties}
              onChange={setProperties}
            />

            <Slider
              label={`Avg monthly revenue per property: ${fmt(
                avgMonthlyRevenue
              )}`}
              min={300}
              max={10000}
              step={50}
              value={avgMonthlyRevenue}
              onChange={setAvgMonthlyRevenue}
            />

            <Slider
              label={`Human manager fee: ${managerFeePercent}%`}
              min={10}
              max={30}
              step={1}
              value={managerFeePercent}
              onChange={setManagerFeePercent}
            />

            <Slider
              label={`AI price per property: ${fmt(aiPricePerProperty)}`}
              min={10}
              max={500}
              step={1}
              value={aiPricePerProperty}
              onChange={setAiPricePerProperty}
            />

            <Slider
              label={`Owner hourly value: ${fmt(ownerHourlyValue)}/hr`}
              min={10}
              max={200}
              step={1}
              value={ownerHourlyValue}
              onChange={setOwnerHourlyValue}
            />

            <Slider
              label={`Hours saved per property each week: ${hoursSavedPerWeek} h`}
              min={1}
              max={30}
              step={1}
              value={hoursSavedPerWeek}
              onChange={setHoursSavedPerWeek}
            />

            <Slider
              label={`Conversion uplift from faster follow‑up: ${conversionUpliftPercent}%`}
              min={0}
              max={20}
              step={1}
              value={conversionUpliftPercent}
              onChange={setConversionUpliftPercent}
            />

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyPreset("solo")}
              >
                Solo host
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyPreset("small")}
              >
                Small portfolio
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyPreset("pro")}
              >
                Professional
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Savings</CardTitle>
            <CardDescription>
              See how much you could save each month
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <KpiRow label="Human manager cost" value={fmt(humanCost)} />
            <KpiRow label="AI subscription cost" value={fmt(aiCost)} />
            <KpiRow
              label="Owner time value reclaimed (if self‑managed)"
              value={fmt(ownerTimeSavedValue)}
            />
            <KpiRow
              label="Extra revenue from faster response"
              value={fmt(addedRevenue)}
            />

            <hr className="my-4" />

            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg space-y-3">
              <KpiRow
                label="Net vs hiring a human manager"
                value={`${fmt(netVsHuman)} (${roiVsHuman.toFixed(0)}% ROI)`}
                highlight
              />
              <KpiRow
                label="Per‑property net vs human"
                value={fmt(perProperty(netVsHuman))}
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-3">
              <KpiRow
                label="Net vs self‑managing"
                value={`${fmt(netVsSelf)} (${roiVsSelf.toFixed(0)}% ROI)`}
                highlight
              />
              <KpiRow
                label="Per‑property net vs self"
                value={fmt(perProperty(netVsSelf))}
              />
            </div>

            <p className="text-xs text-muted-foreground pt-2">
              Notes: manager fee typical range 15–25% of gross for short‑term
              rentals; time saved baseline 8–12 h/week/property; conversion
              uplift 3–8% from sub‑5‑minute responses.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Explainer */}
      <Card>
        <CardHeader>
          <CardTitle>How we estimate ROI</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid md:grid-cols-2 gap-2 text-sm space-y-1 text-muted-foreground">
            <li>
              <strong>Human manager cost</strong> = properties × avg revenue ×
              manager fee %
            </li>
            <li>
              <strong>AI cost</strong> = properties × AI price per property
            </li>
            <li>
              <strong>Owner time value</strong> = properties × hours saved/week
              × 4.33 × owner hourly value
            </li>
            <li>
              <strong>Added revenue</strong> from faster follow‑up = properties
              × avg revenue × uplift %
            </li>
            <li>
              <strong>Net vs human</strong> = human cost − AI cost + added
              revenue
            </li>
            <li>
              <strong>Net vs self</strong> = owner time value − AI cost + added
              revenue
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function KpiRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-1 ${
        highlight ? "font-semibold" : ""
      }`}
    >
      <span className="text-muted-foreground">{label}</span>
      <span className={`tabular-nums ${highlight ? "text-foreground" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm text-muted-foreground">{label}</Label>
        <Input
          type="number"
          className="w-28 h-8"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
    </div>
  );
}
