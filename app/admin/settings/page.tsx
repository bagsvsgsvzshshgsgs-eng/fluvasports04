"use client";

import { useStore } from "@/components/StoreContext";
import { useState, useEffect } from "react";
import {
  Save, Globe, Palette, Shield, Share2, Search,
  Database, Download, Upload, ToggleLeft, ToggleRight,
  AlertTriangle, CheckCircle, Phone, Mail, MapPin, Link2,
  Eye, EyeOff, Lock, KeyRound
} from "lucide-react";

// Keep cookie in sync with settings for middleware
function setMaintenanceCookie(value: boolean) {
  if (value) {
    document.cookie = `fluva_maintenance=true; path=/; max-age=86400`;
  } else {
    document.cookie = `fluva_maintenance=; path=/; max-age=0`;
  }
}


type Tab = 'general' | 'seo' | 'social' | 'theme' | 'security' | 'maintenance' | 'data';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'general',     label: 'General',     icon: <Globe size={15} /> },
  { id: 'seo',         label: 'SEO',         icon: <Search size={15} /> },
  { id: 'social',      label: 'Social',      icon: <Share2 size={15} /> },
  { id: 'theme',       label: 'Theme',       icon: <Palette size={15} /> },
  { id: 'security',    label: 'Security',    icon: <Lock size={15} /> },
  { id: 'maintenance', label: 'Maintenance', icon: <Shield size={15} /> },
  { id: 'data',        label: 'Data & Backup', icon: <Database size={15} /> },
];

const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter (Modern Sans)' },
  { value: 'Playfair Display', label: 'Playfair Display (Serif)' },
  { value: 'Poppins', label: 'Poppins (Geometric)' },
  { value: 'DM Sans', label: 'DM Sans (Clean)' },
  { value: 'Montserrat', label: 'Montserrat (Bold)' },
];

function getStrength(pwd: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pwd.length >= 8)  score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { score, label: 'Weak',   color: 'bg-red-500' };
  if (score <= 3) return { score, label: 'Fair',   color: 'bg-yellow-500' };
  if (score === 4) return { score, label: 'Good',  color: 'bg-blue-500' };
  return { score, label: 'Strong', color: 'bg-green-500' };
}

export default function SettingsAdmin() {
  const { settings, updateSettings, products, orders } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [saved, setSaved] = useState(false);

  // Security / change-password state
  const [pwdForm, setPwdForm] = useState({ current: '', newPwd: '', confirm: '' });
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const strength = getStrength(pwdForm.newPwd);

  const handleChangePassword = () => {
    setPwdError('');
    const currentValid = settings.adminPassword || 'wateryclone123';
    if (pwdForm.current !== currentValid) {
      setPwdError('Current password is incorrect.');
      return;
    }
    if (pwdForm.newPwd.length < 8) {
      setPwdError('New password must be at least 8 characters.');
      return;
    }
    if (pwdForm.newPwd !== pwdForm.confirm) {
      setPwdError('New passwords do not match.');
      return;
    }
    updateSettings({ adminPassword: pwdForm.newPwd });
    setPwdForm({ current: '', newPwd: '', confirm: '' });
    setPwdSuccess(true);
    setTimeout(() => setPwdSuccess(false), 3000);
  };

  const [form, setForm] = useState({
    // General
    siteName:         settings.siteName || 'Fluva Sport',
    siteTagline:      settings.siteTagline || 'Mediterranean Luxury Swimwear',
    contactEmail:     settings.contactEmail || '',
    contactPhone:     settings.contactPhone || '',
    storeAddress:     settings.storeAddress || '',
    logoUrl:          settings.logoUrl || '',
    // Legacy
    announcementText: settings.announcementText || '',
    heroTitle:        settings.heroTitle || '',
    heroSubtitle:     settings.heroSubtitle || '',
    promoBannerText:  settings.promoBannerText || '',
    heroImage:        settings.heroImage || '',
    adminEmail:       settings.adminEmail || '',
    adminPassword:    settings.adminPassword || '',
    // SEO
    seoMetaTitle:       settings.seoMetaTitle || '',
    seoMetaDescription: settings.seoMetaDescription || '',
    seoOgImage:         settings.seoOgImage || '',
    // Social
    instagram: settings.socialLinks?.instagram || '',
    facebook:  settings.socialLinks?.facebook || '',
    tiktok:    settings.socialLinks?.tiktok || '',
    whatsapp:  settings.socialLinks?.whatsapp || '',
    // Theme
    primaryColor: settings.primaryColor || '#f97316',
    fontFamily:   settings.fontFamily || 'Inter',
  });

  const handleSave = () => {
    updateSettings({
      siteName: form.siteName,
      siteTagline: form.siteTagline,
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone,
      storeAddress: form.storeAddress,
      logoUrl: form.logoUrl,
      announcementText: form.announcementText,
      heroTitle: form.heroTitle,
      heroSubtitle: form.heroSubtitle,
      promoBannerText: form.promoBannerText,
      heroImage: form.heroImage,
      adminEmail: form.adminEmail,
      adminPassword: form.adminPassword,
      seoMetaTitle: form.seoMetaTitle,
      seoMetaDescription: form.seoMetaDescription,
      seoOgImage: form.seoOgImage,
      socialLinks: { instagram: form.instagram, facebook: form.facebook, tiktok: form.tiktok, whatsapp: form.whatsapp },
      primaryColor: form.primaryColor,
      fontFamily: form.fontFamily,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  // Data Export helpers
  const exportJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = (rows: Record<string, any>[], filename: string) => {
    if (rows.length === 0) return alert('No data to export.');
    const headers = Object.keys(rows[0]).join(',');
    const body = rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([headers + '\n' + body], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (confirm(`Import settings from "${file.name}"? This will overwrite current settings.`)) {
          updateSettings(data);
          alert('Settings imported successfully!');
        }
      } catch { alert('Invalid JSON file.'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const inputCls = "w-full bg-gray-900/50 border border-gray-800 rounded-md px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-600";
  const labelCls = "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2";

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-1">Store Settings</h1>
          <p className="text-gray-400 text-sm">Global configuration — changes apply site-wide instantly.</p>
        </div>
        {activeTab !== 'data' && activeTab !== 'maintenance' && (
          <button onClick={handleSave} className={`flex items-center gap-2 px-6 py-2.5 rounded-md font-medium transition-all shadow-sm ${saved ? 'bg-green-500 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}>
            {saved ? <><CheckCircle size={18} /> Saved!</> : <><Save size={18} /> Save Settings</>}
          </button>
        )}
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-900 flex gap-1 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── GENERAL TAB ─────────────────────────────────────────── */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Site Identity */}
          <div className="bg-black border border-gray-900 rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-900">
              <Globe className="text-orange-500" size={20} />
              <h2 className="text-lg font-serif text-white">Site Identity</h2>
            </div>
            <div><label className={labelCls}>Site Name</label><input className={inputCls} value={form.siteName} onChange={e => set('siteName', e.target.value)} /></div>
            <div><label className={labelCls}>Tagline</label><input className={inputCls} value={form.siteTagline} onChange={e => set('siteTagline', e.target.value)} /></div>
            <div><label className={labelCls}>Logo URL</label><input className={inputCls} placeholder="/images/logo.png" value={form.logoUrl} onChange={e => set('logoUrl', e.target.value)} /></div>
          </div>

          {/* Contact Info */}
          <div className="bg-black border border-gray-900 rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-900">
              <Mail className="text-orange-500" size={20} />
              <h2 className="text-lg font-serif text-white">Contact Information</h2>
            </div>
            <div>
              <label className={labelCls}><Mail size={11} className="inline mr-1" />Contact Email</label>
              <input className={inputCls} type="email" value={form.contactEmail} onChange={e => set('contactEmail', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}><Phone size={11} className="inline mr-1" />Phone Number</label>
              <input className={inputCls} value={form.contactPhone} onChange={e => set('contactPhone', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}><MapPin size={11} className="inline mr-1" />Store Address</label>
              <input className={inputCls} value={form.storeAddress} onChange={e => set('storeAddress', e.target.value)} />
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-black border border-gray-900 rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-900">
              <Globe className="text-orange-500" size={20} />
              <h2 className="text-lg font-serif text-white">Announcements</h2>
            </div>
            <div><label className={labelCls}>Top Bar Announcement</label><input className={inputCls} value={form.announcementText} onChange={e => set('announcementText', e.target.value)} /></div>
            <div><label className={labelCls}>Promotional Banner Text</label><input className={inputCls} value={form.promoBannerText} onChange={e => set('promoBannerText', e.target.value)} /></div>
            <div><label className={labelCls}>Hero Title</label><input className={inputCls} value={form.heroTitle} onChange={e => set('heroTitle', e.target.value)} /></div>
            <div><label className={labelCls}>Hero Subtitle</label><textarea className={inputCls + ' h-20 resize-none'} value={form.heroSubtitle} onChange={e => set('heroSubtitle', e.target.value)} /></div>
          </div>

          {/* Admin Email only — password is managed in Security tab */}
          <div className="bg-black border border-gray-900 rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-900">
              <Shield className="text-orange-500" size={20} />
              <h2 className="text-lg font-serif text-white">Admin Login Email</h2>
            </div>
            <div><label className={labelCls}>Admin Email</label><input className={inputCls} type="email" value={form.adminEmail} onChange={e => set('adminEmail', e.target.value)} /></div>
            <p className="text-xs text-gray-600">To change the password, go to the <button onClick={() => setActiveTab('security')} className="text-orange-500 hover:underline">Security tab</button>.</p>
          </div>
        </div>
      )}

      {/* ── SEO TAB ─────────────────────────────────────────────── */}
      {activeTab === 'seo' && (
        <div className="max-w-3xl space-y-6">
          {/* Live Preview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-sans">Search Engine Preview</p>
            <h3 className="text-blue-600 text-xl font-medium mb-1 hover:underline cursor-pointer">{form.seoMetaTitle || 'Fluva Sport — Mediterranean Luxury Swimwear'}</h3>
            <p className="text-green-700 text-sm mb-2">https://fluvasport.com/</p>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{form.seoMetaDescription || 'Discover premium sustainable swimwear at Fluva Sport.'}</p>
          </div>

          <div className="bg-black border border-gray-900 rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-900">
              <Search className="text-orange-500" size={20} />
              <h2 className="text-lg font-serif text-white">Global Meta Tags</h2>
            </div>
            <div>
              <label className={labelCls}>Meta Title <span className="text-gray-600 normal-case tracking-normal font-normal">({form.seoMetaTitle.length}/60 chars)</span></label>
              <input className={inputCls} maxLength={60} value={form.seoMetaTitle} onChange={e => set('seoMetaTitle', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Meta Description <span className="text-gray-600 normal-case tracking-normal font-normal">({form.seoMetaDescription.length}/160 chars)</span></label>
              <textarea className={inputCls + ' h-24 resize-none'} maxLength={160} value={form.seoMetaDescription} onChange={e => set('seoMetaDescription', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>OG Image (Social Share Image)</label>
              <input className={inputCls} placeholder="/images/og-image.jpg" value={form.seoOgImage} onChange={e => set('seoOgImage', e.target.value)} />
              {form.seoOgImage && <img src={form.seoOgImage} alt="OG Preview" className="mt-3 w-full max-w-xs aspect-video object-cover rounded-lg border border-gray-800" />}
            </div>
          </div>
        </div>
      )}

      {/* ── SOCIAL TAB ──────────────────────────────────────────── */}
      {activeTab === 'social' && (
        <div className="max-w-2xl">
          <div className="bg-black border border-gray-900 rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-900">
              <Share2 className="text-orange-500" size={20} />
              <h2 className="text-lg font-serif text-white">Social Media Links</h2>
            </div>
            <p className="text-gray-500 text-sm">These links are displayed in the website footer and shared across the site.</p>
            {[
              { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/fluvasport', icon: <Link2 size={16} /> },
              { key: 'facebook',  label: 'Facebook',  placeholder: 'https://facebook.com/fluvasport',  icon: <Link2 size={16} /> },
              { key: 'tiktok',    label: 'TikTok',    placeholder: 'https://tiktok.com/@fluvasport',   icon: <Link2 size={16} /> },
              { key: 'whatsapp',  label: 'WhatsApp',  placeholder: 'https://wa.me/201000000000',       icon: <Phone size={16} /> },
            ].map(({ key, label, placeholder, icon }) => (
              <div key={key}>
                <label className={labelCls}><span className="inline-flex items-center gap-1">{icon} {label}</span></label>
                <input className={inputCls} placeholder={placeholder} value={(form as any)[key]} onChange={e => set(key, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── THEME TAB ───────────────────────────────────────────── */}
      {activeTab === 'theme' && (
        <div className="max-w-2xl">
          <div className="bg-black border border-gray-900 rounded-xl p-6 space-y-8">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-900">
              <Palette className="text-orange-500" size={20} />
              <h2 className="text-lg font-serif text-white">Theme Customization</h2>
            </div>

            <div className="space-y-3">
              <label className={labelCls}>Primary Brand Color</label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input type="color" value={form.primaryColor} onChange={e => set('primaryColor', e.target.value)} className="w-14 h-14 rounded-xl border-2 border-gray-700 cursor-pointer bg-transparent p-1" />
                </div>
                <div>
                  <p className="text-white font-mono text-lg">{form.primaryColor}</p>
                  <p className="text-gray-500 text-xs">Used for buttons, accents, and highlights</p>
                </div>
              </div>
              {/* Color presets */}
              <div className="flex gap-2 flex-wrap pt-2">
                {['#f97316','#3b82f6','#8b5cf6','#10b981','#ef4444','#f59e0b','#ec4899','#14b8a6'].map(c => (
                  <button key={c} onClick={() => set('primaryColor', c)} title={c}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${form.primaryColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className={labelCls}>Body Font Family</label>
              <select className={inputCls} value={form.fontFamily} onChange={e => set('fontFamily', e.target.value)}>
                {FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
              <p className="text-xs text-gray-500">Font changes apply to the storefront on next page load.</p>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
              <p className="text-orange-400 text-xs font-medium mb-1">⚡ Live Preview</p>
              <p className="text-gray-400 text-sm">The primary color is reflected in buttons, badges, and accents throughout the store. Save to apply globally.</p>
            </div>

            <button onClick={handleSave} className={`flex items-center gap-2 px-6 py-2.5 rounded-md font-medium transition-all shadow-sm ${saved ? 'bg-green-500 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}>
              {saved ? <><CheckCircle size={18} /> Saved!</> : <><Save size={18} /> Apply Theme</>}
            </button>
          </div>
        </div>
      )}

      {/* ── SECURITY TAB ─────────────────────────────────────── */}
      {activeTab === 'security' && (
        <div className="max-w-xl space-y-6">
          <div className="bg-black border border-gray-900 rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-900">
              <KeyRound className="text-orange-500" size={20} />
              <h2 className="text-lg font-serif text-white">Change Password</h2>
            </div>

            {/* Info box */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 flex items-start gap-3">
              <Lock size={16} className="text-gray-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-gray-300 font-medium">Admin account: <span className="text-orange-400 font-mono">{settings.adminEmail || 'goldenswimmingacademy@gmail.com'}</span></p>
                <p className="text-xs text-gray-500 mt-1">You must enter your current password to set a new one.</p>
              </div>
            </div>

            {/* Error / Success banners */}
            {pwdError && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
                <AlertTriangle size={16} className="shrink-0" /> {pwdError}
              </div>
            )}
            {pwdSuccess && (
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-3 rounded-lg">
                <CheckCircle size={16} className="shrink-0" /> Password changed successfully!
              </div>
            )}

            {/* Current password */}
            <div className="space-y-2">
              <label className={labelCls}>Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  placeholder="Enter your current password"
                  value={pwdForm.current}
                  onChange={e => setPwdForm(f => ({ ...f, current: e.target.value }))}
                  className={inputCls + ' pr-10'}
                />
                <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New password */}
            <div className="space-y-2">
              <label className={labelCls}>New Password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  value={pwdForm.newPwd}
                  onChange={e => setPwdForm(f => ({ ...f, newPwd: e.target.value }))}
                  className={inputCls + ' pr-10'}
                />
                <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Strength meter */}
              {pwdForm.newPwd && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength.score ? strength.color : 'bg-gray-800'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">Strength: <span className={`font-medium ${strength.score >= 4 ? 'text-green-400' : strength.score >= 3 ? 'text-blue-400' : strength.score >= 2 ? 'text-yellow-400' : 'text-red-400'}`}>{strength.label}</span></p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-2">
              <label className={labelCls}>Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat your new password"
                  value={pwdForm.confirm}
                  onChange={e => setPwdForm(f => ({ ...f, confirm: e.target.value }))}
                  className={inputCls + ' pr-10' + (pwdForm.confirm && pwdForm.confirm !== pwdForm.newPwd ? ' border-red-500' : pwdForm.confirm && pwdForm.confirm === pwdForm.newPwd ? ' border-green-500' : '')}
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {pwdForm.confirm && pwdForm.confirm !== pwdForm.newPwd && (
                <p className="text-xs text-red-400">Passwords don't match</p>
              )}
              {pwdForm.confirm && pwdForm.confirm === pwdForm.newPwd && (
                <p className="text-xs text-green-400 flex items-center gap-1"><CheckCircle size={12} /> Passwords match</p>
              )}
            </div>

            <button
              onClick={handleChangePassword}
              disabled={!pwdForm.current || !pwdForm.newPwd || !pwdForm.confirm}
              className="w-full bg-orange-500 text-white py-3 rounded-md font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <KeyRound size={16} /> Update Password
            </button>
          </div>
        </div>
      )}

      {/* ── MAINTENANCE TAB ─────────────────────────────────────── */}
      {activeTab === 'maintenance' && (
        <div className="max-w-2xl space-y-6">
          <div className="bg-black border border-gray-900 rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-900">
              <Shield className="text-orange-500" size={20} />
              <h2 className="text-lg font-serif text-white">Maintenance Mode</h2>
            </div>

            <div className={`p-5 rounded-xl border ${settings.maintenanceMode ? 'bg-red-500/10 border-red-500/30' : 'bg-gray-900/30 border-gray-800'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium mb-1 ${settings.maintenanceMode ? 'text-red-400' : 'text-white'}`}>
                    {settings.maintenanceMode ? '🔴 Site is in Maintenance Mode' : '🟢 Site is Live'}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {settings.maintenanceMode
                      ? 'Visitors will see the maintenance page. You can still access the admin.'
                      : 'Your store is visible to everyone. Toggle to take it offline for updates.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm(settings.maintenanceMode
                      ? 'Bring the site back online?'
                      : 'Put the site in maintenance mode? Visitors will be blocked.')) {
                      const newVal = !settings.maintenanceMode;
                      updateSettings({ maintenanceMode: newVal });
                      setMaintenanceCookie(newVal);
                    }
                  }}
                  className="ml-4 flex-shrink-0"
                >
                  {settings.maintenanceMode
                    ? <ToggleRight size={48} className="text-red-500" />
                    : <ToggleLeft size={48} className="text-gray-600 hover:text-orange-500 transition-colors" />
                  }
                </button>
              </div>
            </div>

            {settings.maintenanceMode && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex gap-3">
                <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-amber-400 font-medium text-sm">Maintenance Mode is Active</p>
                  <p className="text-gray-400 text-xs mt-1">All non-admin visitors are currently seeing the maintenance page. Admin routes (/admin/*) remain accessible to you.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── DATA TAB ────────────────────────────────────────────── */}
      {activeTab === 'data' && (
        <div className="space-y-6 max-w-3xl">
          {/* Export */}
          <div className="bg-black border border-gray-900 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-900">
              <Download className="text-orange-500" size={20} />
              <h2 className="text-lg font-serif text-white">Export Data</h2>
            </div>
            <p className="text-gray-500 text-sm">Download your store data as JSON or CSV files for backup or migration.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Products (JSON)', action: () => exportJSON(products, 'fluva-products.json') },
                { label: 'Products (CSV)',  action: () => exportCSV(products.map(p => ({ id: p.id, name: p.name, price: p.price, category: p.category, description: p.description })), 'fluva-products.csv') },
                { label: 'Orders (JSON)',   action: () => exportJSON(orders, 'fluva-orders.json') },
                { label: 'Orders (CSV)',    action: () => exportCSV(orders.map(o => ({ id: o.id, customer: o.customerName, email: o.email, total: o.total, status: o.status, date: o.date })), 'fluva-orders.csv') },
                { label: 'All Settings (JSON)', action: () => exportJSON(settings, 'fluva-settings.json') },
                { label: 'Categories (JSON)',   action: () => exportJSON(settings.categories, 'fluva-categories.json') },
              ].map(({ label, action }) => (
                <button key={label} onClick={action}
                  className="flex items-center gap-3 p-4 bg-gray-900/50 hover:bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors text-sm text-gray-300 hover:text-white">
                  <Download size={16} className="text-orange-500 shrink-0" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Import */}
          <div className="bg-black border border-gray-900 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-900">
              <Upload className="text-orange-500" size={20} />
              <h2 className="text-lg font-serif text-white">Import Settings</h2>
            </div>
            <p className="text-gray-500 text-sm">Restore previously exported settings. This will overwrite current configuration.</p>
            <div className="border-2 border-dashed border-gray-800 rounded-xl p-8 text-center hover:border-orange-500/50 transition-colors">
              <Upload size={32} className="mx-auto text-gray-600 mb-3" />
              <p className="text-gray-400 text-sm mb-3">Drop a JSON file or click to browse</p>
              <label className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors inline-block">
                Choose File
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex gap-3">
              <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
              <p className="text-amber-400 text-xs">Importing will immediately replace your current settings. Export a backup first.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
