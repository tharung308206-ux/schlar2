import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  SCHLAR_PALETTES,
  DEFAULT_PALETTE_ID,
  DEFAULT_THEME_COLORS,
  isValidHexColor,
  validateThemeColors,
  exportThemeJSON,
  importThemeJSON,
  getContrastTextColor,
  applyThemeVariables
} from '../../data/themes';
import { PaletteId, ThemeColors, CustomThemeRecord } from '../../types';
import {
  Palette,
  X,
  Check,
  RotateCcw,
  Save,
  Download,
  Upload,
  Trash2,
  Edit2,
  Sparkles,
  Sliders,
  Eye,
  Info,
  CheckCircle2,
  AlertCircle,
  Copy
} from 'lucide-react';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({ isOpen, onClose }) => {
  const {
    activePaletteId,
    themeColors,
    setThemePalette,
    applyCustomThemeColors,
    customThemes,
    saveCustomTheme,
    deleteCustomTheme,
    renameCustomTheme,
    resetThemeToDefault
  } = useApp();

  const [activeTab, setActiveTab] = useState<'presets' | 'editor' | 'saved' | 'import_export'>('presets');
  
  // Working draft colors for the editor (allows preview before applying!)
  const [draftColors, setDraftColors] = useState<ThemeColors>(themeColors);
  const [selectedPresetId, setSelectedPresetId] = useState<PaletteId>(activePaletteId);
  const [customThemeName, setCustomThemeName] = useState<string>('');
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  // Import / Export states
  const [importText, setImportText] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Sync draft colors when modal opens or active theme changes
  useEffect(() => {
    if (isOpen) {
      setDraftColors(themeColors);
      setSelectedPresetId(activePaletteId);
      setFeedback(null);
    }
  }, [isOpen, themeColors, activePaletteId]);

  if (!isOpen) return null;

  const handleSelectPreset = (paletteId: PaletteId) => {
    setSelectedPresetId(paletteId);
    const pal = SCHLAR_PALETTES.find((p) => p.id === paletteId);
    if (pal) {
      setDraftColors({ ...pal.colors });
      setFeedback({
        type: 'success',
        message: `Loaded "${pal.name}". Click "Apply Theme" to activate across the app.`
      });
    }
  };

  const handleApplyDraft = () => {
    const val = validateThemeColors(draftColors);
    if (!val.valid || !val.colors) {
      setFeedback({ type: 'error', message: val.error || 'Invalid colors' });
      return;
    }
    applyCustomThemeColors(draftColors, selectedPresetId);
    setFeedback({ type: 'success', message: 'Theme applied successfully to entire application!' });
  };

  const handleResetToPreset = () => {
    const pal = SCHLAR_PALETTES.find((p) => p.id === selectedPresetId);
    if (pal) {
      setDraftColors({ ...pal.colors });
      setFeedback({ type: 'success', message: `Reset draft to preset "${pal.name}".` });
    }
  };

  const handleResetToDefault = () => {
    resetThemeToDefault();
    setSelectedPresetId(DEFAULT_PALETTE_ID);
    setDraftColors(DEFAULT_THEME_COLORS);
    setFeedback({ type: 'success', message: 'Reset to default SCHLAR Petrol & Copper theme.' });
  };

  const handleSaveCustomTheme = () => {
    if (!customThemeName.trim()) {
      setFeedback({ type: 'error', message: 'Please provide a name for your custom theme.' });
      return;
    }
    saveCustomTheme(customThemeName.trim(), draftColors);
    setCustomThemeName('');
    setFeedback({ type: 'success', message: `Saved custom theme "${customThemeName.trim()}".` });
    setActiveTab('saved');
  };

  const handleLoadSavedTheme = (theme: CustomThemeRecord) => {
    setDraftColors({ ...theme.colors });
    setSelectedPresetId('custom');
    setFeedback({ type: 'success', message: `Loaded "${theme.name}". Click "Apply Theme" to activate.` });
    setActiveTab('editor');
  };

  const handleExportJSON = () => {
    const currentName = SCHLAR_PALETTES.find((p) => p.id === selectedPresetId)?.name || 'Custom Theme';
    const jsonStr = exportThemeJSON(currentName, draftColors);
    navigator.clipboard.writeText(jsonStr);
    setFeedback({ type: 'success', message: 'Theme JSON configuration copied to clipboard!' });
  };

  const handleDownloadJSON = () => {
    const currentName = SCHLAR_PALETTES.find((p) => p.id === selectedPresetId)?.name || 'Custom Theme';
    const jsonStr = exportThemeJSON(currentName, draftColors);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schlar-theme-${currentName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setFeedback({ type: 'success', message: 'Theme JSON file downloaded.' });
  };

  const handleImportJSON = () => {
    if (!importText.trim()) {
      setFeedback({ type: 'error', message: 'Please paste a valid JSON theme configuration.' });
      return;
    }
    const result = importThemeJSON(importText);
    if (!result.success || !result.data) {
      setFeedback({ type: 'error', message: result.error || 'Import failed.' });
      return;
    }
    setDraftColors(result.data.colors);
    setSelectedPresetId('custom');
    saveCustomTheme(result.data.name, result.data.colors);
    setImportText('');
    setFeedback({
      type: 'success',
      message: `Successfully imported and saved "${result.data.name}". You can now apply it.`
    });
    setActiveTab('editor');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-theme-primary text-white flex items-center justify-center shadow-xs">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">SCHLAR Theme System</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  12 Palettes & Custom Editor
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Tailor brand tokens, audit color contrast, and preview live interfaces.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-3 sm:px-6 bg-white gap-2 shrink-0 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('presets')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'presets'
                ? 'border-theme-primary text-theme-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            12 Presets
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'editor'
                ? 'border-theme-primary text-theme-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Color Customizer
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'saved'
                ? 'border-theme-primary text-theme-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Save className="w-4 h-4" />
            Saved Themes ({customThemes.length})
          </button>
          <button
            onClick={() => setActiveTab('import_export')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'import_export'
                ? 'border-theme-primary text-theme-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            Import / Export JSON
          </button>
        </div>

        {/* Alert / Feedback message */}
        {feedback && (
          <div
            className={`mx-3 sm:mx-6 mt-3 px-4 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold ml-2"
            >
              ×
            </button>
          </div>
        )}

        {/* Tab Content & Live Preview Split */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: 12 PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Choose from 12 Standard Palettes</h3>
                  <p className="text-xs text-slate-500">
                    Each palette defines the 5 core tokens: Primary, Secondary, Accent, Background, and Surface.
                  </p>
                </div>
                <button
                  onClick={handleResetToDefault}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset to Petrol & Copper (Default)
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {SCHLAR_PALETTES.map((pal) => {
                  const isSelected = selectedPresetId === pal.id;
                  const isDefault = pal.id === DEFAULT_PALETTE_ID;
                  return (
                    <div
                      key={pal.id}
                      onClick={() => handleSelectPreset(pal.id)}
                      className={`cursor-pointer rounded-xl p-3.5 border transition-all relative ${
                        isSelected
                          ? 'border-theme-primary bg-slate-50/80 shadow-md ring-2 ring-theme'
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-xs bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center border border-slate-200">
                            {pal.number}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{pal.name}</span>
                        </div>
                        {isDefault && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                            DEFAULT
                          </span>
                        )}
                        {isSelected && !isDefault && (
                          <span className="w-4 h-4 rounded-full bg-theme-primary text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      {/* Swatches */}
                      <div className="grid grid-cols-5 gap-1.5 mb-2.5">
                        <div
                          className="h-8 rounded-md flex items-center justify-center text-[9px] font-mono shadow-2xs border border-black/10"
                          style={{
                            backgroundColor: pal.colors.primary,
                            color: getContrastTextColor(pal.colors.primary)
                          }}
                          title={`Primary: ${pal.colors.primary}`}
                        >
                          P
                        </div>
                        <div
                          className="h-8 rounded-md flex items-center justify-center text-[9px] font-mono shadow-2xs border border-black/10"
                          style={{
                            backgroundColor: pal.colors.secondary,
                            color: getContrastTextColor(pal.colors.secondary)
                          }}
                          title={`Secondary: ${pal.colors.secondary}`}
                        >
                          S
                        </div>
                        <div
                          className="h-8 rounded-md flex items-center justify-center text-[9px] font-mono shadow-2xs border border-black/10"
                          style={{
                            backgroundColor: pal.colors.accent,
                            color: getContrastTextColor(pal.colors.accent)
                          }}
                          title={`Accent: ${pal.colors.accent}`}
                        >
                          A
                        </div>
                        <div
                          className="h-8 rounded-md flex items-center justify-center text-[9px] font-mono shadow-2xs border border-slate-300"
                          style={{
                            backgroundColor: pal.colors.background,
                            color: getContrastTextColor(pal.colors.background)
                          }}
                          title={`Background: ${pal.colors.background}`}
                        >
                          BG
                        </div>
                        <div
                          className="h-8 rounded-md flex items-center justify-center text-[9px] font-mono shadow-2xs border border-slate-300"
                          style={{
                            backgroundColor: pal.colors.surface,
                            color: getContrastTextColor(pal.colors.surface)
                          }}
                          title={`Surface: ${pal.colors.surface}`}
                        >
                          SF
                        </div>
                      </div>

                      {/* Hex Details */}
                      <div className="grid grid-cols-5 text-[9px] font-mono text-slate-500 text-center truncate">
                        <span className="truncate">{pal.colors.primary}</span>
                        <span className="truncate">{pal.colors.secondary}</span>
                        <span className="truncate">{pal.colors.accent}</span>
                        <span className="truncate">{pal.colors.background}</span>
                        <span className="truncate">{pal.colors.surface}</span>
                      </div>

                      <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {pal.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: COLOR CUSTOMIZER */}
          {activeTab === 'editor' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Interactive Token Editor</h3>
                <p className="text-xs text-slate-500">
                  Edit individual hexadecimal color values. Test changes in the live preview card below before applying.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Primary */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Primary</label>
                    <span className="text-[10px] text-slate-400">Headers, buttons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={draftColors.primary}
                      onChange={(e) => setDraftColors({ ...draftColors, primary: e.target.value })}
                      className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={draftColors.primary}
                      onChange={(e) => setDraftColors({ ...draftColors, primary: e.target.value })}
                      className="flex-1 px-2.5 py-1.5 text-xs font-mono font-semibold rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                {/* Secondary */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Secondary</label>
                    <span className="text-[10px] text-slate-400">Sub-navigation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={draftColors.secondary}
                      onChange={(e) => setDraftColors({ ...draftColors, secondary: e.target.value })}
                      className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={draftColors.secondary}
                      onChange={(e) => setDraftColors({ ...draftColors, secondary: e.target.value })}
                      className="flex-1 px-2.5 py-1.5 text-xs font-mono font-semibold rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                {/* Accent */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Accent</label>
                    <span className="text-[10px] text-slate-400">Highlights, tags</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={draftColors.accent}
                      onChange={(e) => setDraftColors({ ...draftColors, accent: e.target.value })}
                      className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={draftColors.accent}
                      onChange={(e) => setDraftColors({ ...draftColors, accent: e.target.value })}
                      className="flex-1 px-2.5 py-1.5 text-xs font-mono font-semibold rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                {/* Background */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Background</label>
                    <span className="text-[10px] text-slate-400">App canvas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={draftColors.background}
                      onChange={(e) => setDraftColors({ ...draftColors, background: e.target.value })}
                      className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={draftColors.background}
                      onChange={(e) => setDraftColors({ ...draftColors, background: e.target.value })}
                      className="flex-1 px-2.5 py-1.5 text-xs font-mono font-semibold rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                {/* Surface */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Surface</label>
                    <span className="text-[10px] text-slate-400">Card backgrounds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={draftColors.surface}
                      onChange={(e) => setDraftColors({ ...draftColors, surface: e.target.value })}
                      className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={draftColors.surface}
                      onChange={(e) => setDraftColors({ ...draftColors, surface: e.target.value })}
                      className="flex-1 px-2.5 py-1.5 text-xs font-mono font-semibold rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Save as Custom Theme option */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="Custom theme name (e.g. Greenfield Autumn, STEM Night)..."
                  value={customThemeName}
                  onChange={(e) => setCustomThemeName(e.target.value)}
                  className="flex-1 w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
                <button
                  onClick={handleSaveCustomTheme}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save as Custom Theme
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SAVED THEMES */}
          {activeTab === 'saved' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Your Saved Custom Themes</h3>
                  <p className="text-xs text-slate-500">
                    Locally saved configurations stored safely in your browser.
                  </p>
                </div>
              </div>

              {customThemes.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <Palette className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">No custom themes saved yet</p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                    Adjust colors in the Color Customizer and save them here for quick access across sessions.
                  </p>
                  <button
                    onClick={() => setActiveTab('editor')}
                    className="mt-3 px-3.5 py-1.5 text-xs font-bold text-white bg-theme-primary rounded-lg shadow-xs"
                  >
                    Open Customizer
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {customThemes.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-2xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        {editingThemeId === t.id ? (
                          <div className="flex items-center gap-2 flex-1 mr-2">
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="px-2 py-1 text-xs border border-slate-300 rounded-md flex-1 font-bold"
                            />
                            <button
                              onClick={() => {
                                renameCustomTheme(t.id, editingName);
                                setEditingThemeId(null);
                              }}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800">{t.name}</span>
                            <button
                              onClick={() => {
                                setEditingThemeId(t.id);
                                setEditingName(t.name);
                              }}
                              className="text-slate-400 hover:text-slate-600"
                              title="Rename"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <span className="text-[10px] text-slate-400">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Swatches */}
                      <div className="grid grid-cols-5 gap-1.5">
                        <div
                          className="h-6 rounded text-[8px] font-mono flex items-center justify-center border border-black/10"
                          style={{ backgroundColor: t.colors.primary, color: getContrastTextColor(t.colors.primary) }}
                        >
                          P
                        </div>
                        <div
                          className="h-6 rounded text-[8px] font-mono flex items-center justify-center border border-black/10"
                          style={{ backgroundColor: t.colors.secondary, color: getContrastTextColor(t.colors.secondary) }}
                        >
                          S
                        </div>
                        <div
                          className="h-6 rounded text-[8px] font-mono flex items-center justify-center border border-black/10"
                          style={{ backgroundColor: t.colors.accent, color: getContrastTextColor(t.colors.accent) }}
                        >
                          A
                        </div>
                        <div
                          className="h-6 rounded text-[8px] font-mono flex items-center justify-center border border-slate-300"
                          style={{ backgroundColor: t.colors.background, color: getContrastTextColor(t.colors.background) }}
                        >
                          BG
                        </div>
                        <div
                          className="h-6 rounded text-[8px] font-mono flex items-center justify-center border border-slate-300"
                          style={{ backgroundColor: t.colors.surface, color: getContrastTextColor(t.colors.surface) }}
                        >
                          SF
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => deleteCustomTheme(t.id)}
                          className="px-2 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                        <button
                          onClick={() => handleLoadSavedTheme(t)}
                          className="px-3 py-1 text-[11px] font-bold text-theme-primary bg-theme-light hover:opacity-90 rounded-lg transition-colors"
                        >
                          Load into Editor
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: IMPORT / EXPORT JSON */}
          {activeTab === 'import_export' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Export Panel */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Export Current Palette</h4>
                  <p className="text-[11px] text-slate-500">
                    Download or copy the active palette configuration in standard SCHLAR JSON format.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs font-mono text-slate-700 overflow-x-auto max-h-44">
                  <pre className="text-[10px] leading-tight">
                    {exportThemeJSON(
                      SCHLAR_PALETTES.find((p) => p.id === selectedPresetId)?.name || 'Active Theme',
                      draftColors
                    )}
                  </pre>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportJSON}
                    className="flex-1 py-2 px-3 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={handleDownloadJSON}
                    className="flex-1 py-2 px-3 text-xs font-bold text-white bg-theme-primary hover:opacity-90 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download .JSON
                  </button>
                </div>
              </div>

              {/* Import Panel */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Import Theme JSON</h4>
                  <p className="text-[11px] text-slate-500">
                    Paste a JSON configuration. The validator ensures strict hex codes without script execution.
                  </p>
                </div>

                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder={`{\n  "name": "My Custom Theme",\n  "colors": {\n    "primary": "#164E55",\n    "secondary": "#287B7A",\n    "accent": "#C47D54",\n    "background": "#F5F0E7",\n    "surface": "#FFFFFF"\n  }\n}`}
                  rows={6}
                  className="w-full p-2.5 text-[11px] font-mono rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                />

                <button
                  onClick={handleImportJSON}
                  className="w-full py-2 px-3 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Validate & Import Theme
                </button>
              </div>
            </div>
          )}

          {/* REAL-TIME PREVIEW PANEL (ALWAYS VISIBLE) */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-slate-600" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Live Interface Preview (Draft: {draftColors.primary})
                </h4>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                P: {draftColors.primary} | S: {draftColors.secondary} | A: {draftColors.accent}
              </span>
            </div>

            {/* Simulated UI Card rendered using draftColors */}
            <div
              className="p-4 rounded-xl border transition-all"
              style={{
                backgroundColor: draftColors.background,
                borderColor: draftColors.secondary + '40'
              }}
            >
              {/* Header preview */}
              <div
                className="px-4 py-2.5 rounded-lg flex items-center justify-between text-white shadow-xs mb-3"
                style={{ backgroundColor: draftColors.primary }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center text-xs font-black">
                    SC
                  </div>
                  <span className="text-xs font-bold tracking-tight">SCHLAR</span>
                  <span className="text-[10px] opacity-80">· Greenfield International School</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: draftColors.accent,
                      color: getContrastTextColor(draftColors.accent)
                    }}
                  >
                    Active Term
                  </span>
                </div>
              </div>

              {/* Surface Card preview */}
              <div
                className="p-3.5 rounded-lg border shadow-xs space-y-3"
                style={{
                  backgroundColor: draftColors.surface,
                  borderColor: draftColors.secondary + '30'
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Grade 10-A Mathematics Examination
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: draftColors.primary + '18',
                      color: draftColors.primary
                    }}
                  >
                    Scheduled
                  </span>
                </div>

                <p className="text-[11px] text-slate-500">
                  Assessment scheduled for Term 2. Maximum Marks: 100, Passing Marks: 35. Room: Hall A.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-2xs transition-opacity hover:opacity-90"
                    style={{ backgroundColor: draftColors.primary }}
                  >
                    Primary Button
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-2xs transition-opacity hover:opacity-90"
                    style={{ backgroundColor: draftColors.secondary }}
                  >
                    Secondary Action
                  </button>
                  <button
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors"
                    style={{
                      borderColor: draftColors.primary + '40',
                      color: draftColors.primary
                    }}
                  >
                    Outline Control
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToPreset}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors shadow-2xs"
            >
              Reset to Selected Preset
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleApplyDraft}
              className="px-5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Apply Theme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
