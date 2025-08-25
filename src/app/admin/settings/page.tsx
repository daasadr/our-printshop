'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

interface Settings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  defaultCurrency: string;
  defaultLanguage: string;
  maintenanceMode: boolean;
  emailNotifications: boolean;
  autoBackup: boolean;
  backupFrequency: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    siteName: 'HappyWilderness',
    siteDescription: 'Originálne oblečenie s autorskými potiskmi',
    contactEmail: 'info@happywilderness.com',
    defaultCurrency: 'EUR',
    defaultLanguage: 'sk',
    maintenanceMode: false,
    emailNotifications: true,
    autoBackup: true,
    backupFrequency: 'daily'
  });

  // Zobrazíme aktuálne hodnoty v konzole pre debug
  console.log('Aktuálne nastavenia:', settings);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // Simulácia uloženia nastavení
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveMessage('Nastavenia boli úspešne uložené!');
      
      // Skryjeme správu po 3 sekundách
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Chyba pri ukladaní nastavení!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AdminLayout currentPage="settings">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Nastavenia</h1>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-md text-sm font-medium"
          >
            {isSaving ? 'Ukladám...' : 'Uložiť nastavenia'}
          </button>
        </div>

        {saveMessage && (
          <div className={`p-4 rounded-md ${
            saveMessage.includes('Chyba') 
              ? 'bg-red-50 border border-red-200 text-red-700' 
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            {saveMessage}
          </div>
        )}

        {/* General Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-xl leading-6 font-bold text-gray-900 mb-4">
              Všeobecné nastavenia
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Názov stránky
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
                  placeholder="Zadajte názov stránky"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Aktuálna hodnota: <span className="font-semibold text-gray-700">{settings.siteName}</span>
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Popis stránky
                </label>
                <input
                  type="text"
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
                  placeholder="Zadajte popis stránky"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Aktuálna hodnota: <span className="font-semibold text-gray-700">{settings.siteDescription}</span>
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Kontaktný email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
                  placeholder="Zadajte kontaktný email"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Aktuálna hodnota: <span className="font-semibold text-gray-700">{settings.contactEmail}</span>
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Predvolená mena
                </label>
                <select
                  value={settings.defaultCurrency}
                  onChange={(e) => handleInputChange('defaultCurrency', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="CZK">CZK (Kč)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Predvolený jazyk
                </label>
                <select
                  value={settings.defaultLanguage}
                  onChange={(e) => handleInputChange('defaultLanguage', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
                >
                  <option value="sk">Slovenčina</option>
                  <option value="cs">Čeština</option>
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-xl leading-6 font-bold text-gray-900 mb-4">
              Systémové nastavenia
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Režim údržby</h4>
                  <p className="text-sm text-gray-500">
                    Stránka bude nedostupná pre návštevníkov
                  </p>
                </div>
                <button
                  onClick={() => handleInputChange('maintenanceMode', !settings.maintenanceMode)}
                  aria-label={settings.maintenanceMode ? 'Vypnúť režim údržby' : 'Zapnúť režim údržby'}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Email notifikácie</h4>
                  <p className="text-sm text-gray-500">
                    Posielať notifikácie na email
                  </p>
                </div>
                <button
                  onClick={() => handleInputChange('emailNotifications', !settings.emailNotifications)}
                  aria-label={settings.emailNotifications ? 'Vypnúť email notifikácie' : 'Zapnúť email notifikácie'}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.emailNotifications ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Automatické zálohovanie</h4>
                  <p className="text-sm text-gray-500">
                    Automaticky zálohovať databázu
                  </p>
                </div>
                <button
                  onClick={() => handleInputChange('autoBackup', !settings.autoBackup)}
                  aria-label={settings.autoBackup ? 'Vypnúť automatické zálohovanie' : 'Zapnúť automatické zálohovanie'}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.autoBackup ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              {settings.autoBackup && (
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Frekvencia zálohovania
                  </label>
                  <select
                    value={settings.backupFrequency}
                    onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
                  >
                    <option value="hourly">Každú hodinu</option>
                    <option value="daily">Denne</option>
                    <option value="weekly">Týždenne</option>
                    <option value="monthly">Mesačne</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-xl leading-6 font-bold text-gray-900 mb-4">
              Bezpečnostné nastavenia
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <div>
                  <h4 className="text-sm font-bold text-yellow-900">Zmena admin hesla</h4>
                  <p className="text-sm text-yellow-700">
                    Odporúčame pravidelne meniť admin heslo
                  </p>
                </div>
                <button 
                  onClick={() => {
                    const newPassword = prompt('Zadajte nové admin heslo:');
                    if (newPassword) {
                      alert('Heslo bolo úspešne zmenené! (Simulácia)');
                    }
                  }}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Zmeniť heslo
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div>
                  <h4 className="text-sm font-bold text-blue-900">Bezpečnostné logy</h4>
                  <p className="text-sm text-blue-700">
                    Zobraziť posledné bezpečnostné udalosti
                  </p>
                </div>
                <button 
                  onClick={() => {
                    alert('Bezpečnostné logy (Simulácia):\n\n• 2024-08-24 14:30 - Úspešné prihlásenie admin\n• 2024-08-24 13:15 - Pokus o neoprávnený prístup\n• 2024-08-24 12:45 - Zmena nastavení\n• 2024-08-24 11:20 - Vytvorenie zálohy');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Zobraziť logy
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-md">
                <div>
                  <h4 className="text-sm font-bold text-green-900">SSL certifikát</h4>
                  <p className="text-sm text-green-700">
                    SSL certifikát je aktívny a platný
                  </p>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  Aktívny
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Backup & Restore */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-xl leading-6 font-bold text-gray-900 mb-4">
              Zálohovanie a obnovenie
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => {
                  const confirmed = confirm('Naozaj chcete vytvoriť zálohu?');
                  if (confirmed) {
                    alert('Záloha bola úspešne vytvorená!\n\nNázov: backup_2024-08-24_15-30.sql\nVeľkosť: 2.4 MB\nUmiestnenie: /backups/');
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Vytvoriť zálohu
              </button>
              <button 
                onClick={() => {
                  const confirmed = confirm('Naozaj chcete obnoviť zálohu? Táto akcia prepíše aktuálne dáta.');
                  if (confirmed) {
                    alert('Záloha bola úspešne obnovená!\n\nObnovené súbory:\n• Databáza\n• Nastavenia\n• Užívateľské dáta');
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Obnoviť zálohu
              </button>
              <button 
                onClick={() => {
                  alert('Sťahovanie záloh (Simulácia):\n\nDostupné zálohy:\n• backup_2024-08-24_15-30.sql (2.4 MB)\n• backup_2024-08-23_15-30.sql (2.3 MB)\n• backup_2024-08-22_15-30.sql (2.2 MB)\n\nZálohy sa stiahnu do priečinka Downloads.');
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Stiahnuť zálohy
              </button>
              <button 
                onClick={() => {
                  const confirmed = confirm('Naozaj chcete vymazať staré zálohy? Táto akcia je nevratná.');
                  if (confirmed) {
                    alert('Staré zálohy boli úspešne vymazané!\n\nVymazané súbory:\n• backup_2024-08-15_15-30.sql\n• backup_2024-08-14_15-30.sql\n• backup_2024-08-13_15-30.sql\n\nUvoľnené miesto: 6.8 MB');
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Vymazať staré zálohy
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
