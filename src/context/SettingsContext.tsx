'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface StoreSettings {
  brandName: string;
  brandLocation: string;
  announcementText: string;
  announcementEnabled: boolean;
  currencySymbol: string;
  freeShippingThreshold: number;
  contactEmail: string;
  contactPhone: string;
  socialInstagram: string;
  socialFacebook: string;
}

const defaultSettings: StoreSettings = {
  brandName: 'ELYON LECLAIR',
  brandLocation: 'MAISON DE HAUTE COUTURE',
  announcementText: 'COMPLIMENTARY WHITE-GLOVE DELIVERY ON ORDERS ABOVE ₹4,999',
  announcementEnabled: true,
  currencySymbol: '₹',
  freeShippingThreshold: 4999,
  contactEmail: 'concierge@elyonleclair.com',
  contactPhone: '+91 98201 12345',
  socialInstagram: 'https://instagram.com/elyonleclair',
  socialFacebook: 'https://facebook.com/elyonleclair',
};

interface SettingsContextType {
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('example_store_settings');
      if (saved) {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      }
    } catch (e) {
      console.error('Failed to load store settings', e);
    }
  }, []);

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('example_store_settings', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save settings', e);
      }
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('example_store_settings');
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
