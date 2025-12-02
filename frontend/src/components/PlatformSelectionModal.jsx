import React, { useMemo } from 'react';
import { FaApple, FaDesktop, FaPlaystation, FaXbox, FaGamepad } from 'react-icons/fa';
import { SiOculus, SiNintendoswitch } from 'react-icons/si'
export const PLATFORM_OPTIONS = [
  { label: 'Vision Pro', value: 'vision_pro' },
  { label: 'PC', value: 'windows' },
  { label: 'PS 5', value: 'ps5' },
  { label: 'X Box', value: 'xbox' },
  { label: 'Quest', value: 'quest' },
  { label: 'Nintendo Switch 1', value: 'nintendo_switch_1' },
  { label: 'Nintendo Switch 2', value: 'nintendo_switch_2' }
];

const PLATFORM_DETAILS = {
  vision_pro: { icon: FaApple, fallbackPrice: 599 },
  windows: { icon: FaDesktop, fallbackPrice: 499 },
  ps5: { icon: FaPlaystation, fallbackPrice: 549 },
  xbox: { icon: FaXbox, fallbackPrice: 499 },
  quest: { icon: SiOculus, fallbackPrice: 499 },
  nintendo_switch_1: { icon: SiNintendoswitch, fallbackPrice: 449 },
  nintendo_switch_2: { icon: SiNintendoswitch, fallbackPrice: 549 }
};

const PlatformSelectionModal = ({
  open,
  gameTitle,
  game,
  onClose,
  selectedPlatforms = [],
  onPlatformToggle,
  onConfirm,
  addedPlatforms = [],
  isSubmitting,
  confirmLabel = 'Add Selected'
}) => {
  // Filter platforms to only show available ones from game data
  const availablePlatforms = useMemo(() => {
    if (!game?.platforms) return PLATFORM_OPTIONS;

    return PLATFORM_OPTIONS.filter((option) => {
      const platformData = game.platforms[option.value];
      return platformData?.available === true;
    });
  }, [game]);

  const formatPrice = (platformValue) => {
    const platformData = game?.platforms?.[platformValue];
    const configuredPrice = platformData?.price;
    const fallbackPrice = PLATFORM_DETAILS[platformValue]?.fallbackPrice;
    const price = typeof configuredPrice === 'number' ? configuredPrice : fallbackPrice;

    if (price == null) return 'Included';
    return `$${price.toFixed(2)}`;
  };

  // Calculate total price for selected platforms
  const totalPrice = useMemo(() => {
    if (selectedPlatforms.length === 0) return 0;

    return selectedPlatforms.reduce((total, platformValue) => {
      const platformData = game?.platforms?.[platformValue];
      const price =
        typeof platformData?.price === 'number'
          ? platformData.price
          : PLATFORM_DETAILS[platformValue]?.fallbackPrice || 0;
      return total + price;
    }, 0);
  }, [selectedPlatforms, game]);

  const allPlatformsAdded = availablePlatforms.every(option =>
    addedPlatforms.includes(option.value)
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900/95 border border-slate-700 shadow-2xl p-5 sm:p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors text-xl leading-none"
          aria-label="Close platform selection"
        >
          &times;
        </button>

        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-1 text-center">
          Choose Platform(s)
        </h2>
        <p className="text-slate-300 text-center mb-4 text-sm">
          {gameTitle ? `Select the platforms for ${gameTitle}` : 'Select your preferred platforms'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {availablePlatforms.map((option) => {
            const isSelected = selectedPlatforms.includes(option.value);
            const alreadyAdded = addedPlatforms.includes(option.value);
            const details = PLATFORM_DETAILS[option.value] || {};

            const priceDisplay = formatPrice(option.value);

            return (
              <button
                key={option.value}
                type="button"
                disabled={alreadyAdded}
                onClick={() => onPlatformToggle(option.value)}
                className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm transition-all duration-150 ${
                  alreadyAdded
                    ? 'border-slate-800 bg-slate-900/70 text-slate-500 cursor-not-allowed'
                    : isSelected
                    ? 'border-purple-400 bg-purple-500/15 text-white shadow-md shadow-purple-500/25'
                    : 'border-slate-700 bg-slate-800/80 text-slate-200 hover:border-purple-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-base ${isSelected ? 'bg-purple-600/70 text-white' : 'bg-slate-900/70 text-slate-200'}`}>
                    {(() => {
                      const IconComponent = details.icon || FaGamepad;
                      return <IconComponent className="h-4 w-4" />;
                    })()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-[15px] leading-tight">{option.label}</span>
                    <span className="text-xs text-slate-400 mt-0.5">{priceDisplay}</span>
                  </div>
                </div>
                {alreadyAdded ? (
                  <span className="text-[11px] uppercase tracking-wide text-emerald-400">
                    Added
                  </span>
                ) : (
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border text-[11px] font-bold ${
                      isSelected
                        ? 'bg-purple-500 border-purple-300 text-white'
                        : 'border-slate-600 text-transparent'
                    }`}
                    aria-hidden="true"
                  >
                    {isSelected && '✓'}
                  </span>
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

        {selectedPlatforms.length > 0 && (
          <div className="mb-4 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total</p>
                <p className="text-xl font-semibold text-white">${totalPrice.toFixed(2)}</p>
              </div>
              <div className="text-xs text-slate-400 text-right">
                {selectedPlatforms.length} platform{selectedPlatforms.length > 1 ? 's' : ''} selected
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="w-full rounded-xl border border-slate-600 bg-transparent text-white py-3 font-semibold hover:border-white/80 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={selectedPlatforms.length === 0 || isSubmitting}
            className={`w-full rounded-xl py-3 font-semibold transition-all ${
              selectedPlatforms.length === 0 || isSubmitting
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

