import { inject, Injectable, signal } from '@angular/core';

import { PrimeNG } from 'primeng/config';
import { Noir } from '../../mypreset';
import { definePreset } from '@primeng/themes';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  constructor(private primeng: PrimeNG) {}

  private colors = signal<string[]>(['yellow', 'red', 'blue', 'green', 'purple', 'orange', 'pink', 'brown', 'gray', 'black']);

  private colorValues: Record<string, Record<string, string>> = {
    yellow: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
      800: '#854d0e',
      900: '#713f12',
      950: '#422006'
    },
    red: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a'
    },
    blue: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554'
    },
    green: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16'
    },
    purple: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
      950: '#3b0764'
    },
    orange: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
      950: '#431407'
    },
    pink: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
      950: '#500724'
    },
    brown: {
      50: '#fdf8f6',
      100: '#f2e8e5',
      200: '#eaddd7',
      300: '#e0cec7',
      400: '#d2bab0',
      500: '#bfa094',
      600: '#a18072',
      700: '#977669',
      800: '#846358',
      900: '#43302b',
      950: '#2c1810'
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712'
    },
    black: {
      50: '#f6f6f6',
      100: '#e7e7e7',
      200: '#d1d1d1',
      300: '#b0b0b0',
      400: '#888888',
      500: '#6d6d6d',
      600: '#5d5d5d',
      700: '#4f4f4f',
      800: '#454545',
      900: '#3d3d3d',
      950: '#262626'
    }
  };

  private color = this.colorValues['green'];

  getColorsOptions(){
    return this.colors().map(color => ({
      name: color,
      hex: this.colorValues[color][400] || '#000000'
    }));
  }

  setColor(color: string) {
    if (this.colors().includes(color)) {
      this.color = this.colorValues[color];
    }

    const theme = definePreset(Noir, {
      semantic: {
        accent: this.color
      }
    })

    this.primeng.setThemeConfig({
      theme: {
        preset: theme,
        options: {
          darkModeSelector: '.my-app-dark'
        }
      }
    })


  }

}
