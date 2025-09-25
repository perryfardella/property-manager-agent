"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Simple ROI Calculator - Time = Money
// Focus on time savings that translate to monetary value

export default function HostAgentRoiCalculator() {
  // --- Simple Inputs ---
  const [properties, setProperties] = useState(3);
  const [hoursPerWeek, setHoursPerWeek] = useState(8); // hours spent managing per property per week
  const [hourlyRate, setHourlyRate] = useState(35); // $/hour (either what you pay a manager or your own time value)

  // --- Helpers ---
  const fmt = (n: number) =>
    `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  // --- Calculations ---
  // AI handles 80% of queries (from PRD: "automate 80%+ of routine guest queries")
  const timeSavedPerProperty = hoursPerWeek * 0.8; // 80% automation
  const totalTimeSaved = timeSavedPerProperty * properties;

  // Monthly calculations (4.33 weeks per month)
  const weeksPerMonth = 4.33;
  const monthlyTimeSaved = totalTimeSaved * weeksPerMonth;
  const monthlyValueSaved = monthlyTimeSaved * hourlyRate;

  // Per property breakdown
  const monthlyTimePerProperty = timeSavedPerProperty * weeksPerMonth;
  const monthlyValuePerProperty = monthlyTimePerProperty * hourlyRate;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8" id="calculator">
      <header className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">
          How Much Time & Money Will You Save?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Our AI handles 80% of guest messages automatically. See how much time
          and money you&apos;ll save each month.
        </p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Simple Inputs */}
        <Card>
          <CardHeader>
            <CardTitle>Your Current Situation</CardTitle>
            <CardDescription>
              Just 3 quick questions to calculate your savings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Slider
              label={`Properties: ${properties}`}
              min={1}
              max={50}
              step={1}
              value={properties}
              onChange={setProperties}
            />

            <Slider
              label={`Hours per property per week: ${hoursPerWeek}`}
              min={1}
              max={40}
              step={1}
              value={hoursPerWeek}
              onChange={setHoursPerWeek}
            />

            <Slider
              label={`Hourly rate: $${hourlyRate}/hr`}
              min={10}
              max={200}
              step={5}
              value={hourlyRate}
              onChange={setHourlyRate}
            />
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Your Monthly Savings</CardTitle>
            <CardDescription>
              Time and money you&apos;ll get back with AI automation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Results */}
            <div className="bg-green-50 dark:bg-green-950 p-6 rounded-lg space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {Math.round(monthlyTimeSaved)} hours
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  saved per month
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-green-700 dark:text-green-300">
                  {fmt(monthlyValueSaved)}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  value saved per month
                </div>
              </div>
            </div>

            {/* Per Property Breakdown */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">
                Per Property:
              </h4>
              <div className="flex justify-between items-center">
                <span className="text-sm">Time saved per month</span>
                <span className="font-medium">
                  {Math.round(monthlyTimePerProperty)} hours
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Value saved per month</span>
                <span className="font-medium">
                  {fmt(monthlyValuePerProperty)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simple Explainer */}
      <Card>
        <CardHeader>
          <CardTitle>How This Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  1
                </span>
              </div>
              <div className="font-medium">AI handles 80% of messages</div>
              <div className="text-muted-foreground">
                Automated responses to common guest questions
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  2
                </span>
              </div>
              <div className="font-medium">You save time</div>
              <div className="text-muted-foreground">
                Focus on important tasks instead of repetitive messages
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  3
                </span>
              </div>
              <div className="font-medium">Time = Money</div>
              <div className="text-muted-foreground">
                Every hour saved has real monetary value
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
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
          className="w-20 h-8 text-sm"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
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
