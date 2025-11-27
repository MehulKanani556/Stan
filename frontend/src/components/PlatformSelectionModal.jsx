import React from 'react';

export const PLATFORM_OPTIONS = [
  { label: 'Vision Pro', value: 'visionPro' },
  { label: 'PC', value: 'windows' },
  { label: 'PS 5', value: 'ps5' },
  { label: 'X Box', value: 'xbox' },
  { label: 'Quest', value: 'quest' },
  { label: 'Nintendo Switch 1', value: 'switch1' },
  { label: 'Nintendo Switch 2', value: 'switch2' }
];

const PlatformSelectionModal = ({
  open,
  gameTitle,
  onClose,
  selectedPlatforms = [],
  onPlatformToggle,
  onConfirm,
  addedPlatforms = [],
  isSubmitting,
  confirmLabel = 'Add Selected'
}) => {
  if (!open) return null;

  const allPlatformsAdded = PLATFORM_OPTIONS.every(option =>
    addedPlatforms.includes(option.value)
  );

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900/95 border border-slate-700 shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors text-2xl leading-none"
          aria-label="Close platform selection"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          Choose Platform(s)
        </h2>
        <p className="text-slate-300 text-center mb-6">
          {gameTitle ? `Select the platforms for ${gameTitle}` : 'Select your preferred platforms'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {PLATFORM_OPTIONS.map((option) => {
            const isSelected = selectedPlatforms.includes(option.value);
            const alreadyAdded = addedPlatforms.includes(option.value);

            return (
              <button
                key={option.value}
                type="button"
                disabled={alreadyAdded}
                onClick={() => onPlatformToggle(option.value)}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-200 ${alreadyAdded
                  ? 'border-slate-700 bg-slate-800/60 text-slate-500 cursor-not-allowed'
                  : isSelected
                    ? 'border-purple-400 bg-purple-500/20 text-white shadow-lg shadow-purple-500/20'
                    : 'border-slate-700 bg-slate-800/80 text-slate-200 hover:border-purple-400 hover:text-white'
                  }`}
              >
                <span className="font-semibold">{option.label}</span>
                {alreadyAdded ? (
                  <span className="text-xs uppercase tracking-wide text-emerald-400">Added</span>
                ) : (
                  <span className={`w-5 h-5 rounded-full border ${isSelected ? 'bg-purple-500 border-purple-300' : 'border-slate-600'}`} />
                )}
              </button>
            );
          })}
        </div>

        {allPlatformsAdded && (
          <p className="text-center text-slate-400 text-sm mb-4">
            All available platforms for this game are already in your cart.
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="w-full rounded-xl border border-slate-600 bg-transparent text-white py-3 font-semibold hover:border-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={selectedPlatforms.length === 0 || isSubmitting}
            className={`w-full rounded-xl py-3 font-semibold transition-all ${selectedPlatforms.length === 0 || isSubmitting
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30'
              }`}
          >
            {isSubmitting ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlatformSelectionModal;

