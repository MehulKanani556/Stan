import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../Redux/Slice/cart.slice';

const usePlatformSelection = ({ onSuccess } = {}) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cart);

  const [platformModalGame, setPlatformModalGame] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [isSubmittingPlatforms, setIsSubmittingPlatforms] = useState(false);

  const cartPlatformsByGame = useMemo(() => {
    if (!Array.isArray(cartItems)) return {};
    return cartItems.reduce((acc, item) => {
      const gameId = item?.game?._id || item?.game;
      if (!gameId) return acc;

      if (!acc[gameId]) {
        acc[gameId] = [];
      }

      if (item?.platform && !acc[gameId].includes(item.platform)) {
        acc[gameId].push(item.platform);
      }

      return acc;
    }, {});
  }, [cartItems]);

  const selectedGamePlatforms = useMemo(() => {
    if (!platformModalGame) return [];
    return cartPlatformsByGame[platformModalGame._id] || [];
  }, [cartPlatformsByGame, platformModalGame]);

  useEffect(() => {
    if (!platformModalGame) return;
    setSelectedPlatforms((prev) =>
      prev.filter((platform) => !selectedGamePlatforms.includes(platform))
    );
  }, [platformModalGame, selectedGamePlatforms]);

  const openPlatformModal = useCallback((game) => {
    if (!game) return;
    setPlatformModalGame(game);
    setSelectedPlatforms([]);
  }, []);

  const closePlatformModal = useCallback(() => {
    setPlatformModalGame(null);
    setSelectedPlatforms([]);
  }, []);

  const handlePlatformToggle = useCallback((platform) => {
    if (selectedGamePlatforms.includes(platform)) return;
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  }, [selectedGamePlatforms]);

  const handleConfirmPlatforms = useCallback(async () => {
    if (!platformModalGame || selectedPlatforms.length === 0) return;
    try {
      setIsSubmittingPlatforms(true);
      const results = await Promise.all(
        selectedPlatforms.map((platform) =>
          dispatch(addToCart({ gameId: platformModalGame._id, platform, qty: 1 }))
        )
      );

      const isAnySuccess = results.some((action) => addToCart.fulfilled.match(action));

      if (isAnySuccess) {
        onSuccess?.(platformModalGame);
        closePlatformModal();
      }
    } finally {
      setIsSubmittingPlatforms(false);
    }
  }, [dispatch, selectedPlatforms, platformModalGame, closePlatformModal, onSuccess]);

  return {
    openPlatformModal,
    closePlatformModal,
    handlePlatformToggle,
    handleConfirmPlatforms,
    selectedPlatforms,
    isSubmittingPlatforms,
    platformModalGame,
    selectedGamePlatforms,
    cartPlatformsByGame
  };
};

export default usePlatformSelection;

