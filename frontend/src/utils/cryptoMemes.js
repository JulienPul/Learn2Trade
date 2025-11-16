// frontend/src/utils/cryptoMemes.js

/**
 * Collection de mèmes crypto pour gamification
 * Catégories: wojak, gigachad, success, fail, thinking, diamond hands, etc.
 */

export const CRYPTO_MEMES = {
  // Wojak variations
  wojak: {
    crying: {
      url: 'https://i.imgur.com/yXEiYQ7.png',
      alt: 'Crying Wojak',
      usage: 'losses, bad trades, market crash',
    },
    pink: {
      url: 'https://i.imgur.com/9TK2TSC.png',
      alt: 'Pink Wojak',
      usage: 'extreme losses, panic selling',
    },
    cope: {
      url: 'https://i.imgur.com/rKFBXJo.png',
      alt: 'Cope Wojak',
      usage: 'rationalizing losses, copium',
    },
    smug: {
      url: 'https://i.imgur.com/6PlUYOp.png',
      alt: 'Smug Wojak',
      usage: 'small wins, thinking you\'re smart',
    },
    rage: {
      url: 'https://i.imgur.com/kGWKc7L.png',
      alt: 'Rage Wojak',
      usage: 'sold too early, missed pump',
    },
  },

  // Gigachad variations
  gigachad: {
    default: {
      url: 'https://i.imgur.com/JkuHdKC.png',
      alt: 'Gigachad',
      usage: 'big wins, diamond hands, hodl',
    },
    yes: {
      url: 'https://i.imgur.com/9FZW3hK.png',
      alt: 'Yes Chad',
      usage: 'confident trades, ignoring FUD',
    },
    crypto: {
      url: 'https://i.imgur.com/LR8VrT7.png',
      alt: 'Crypto Chad',
      usage: 'successful DCA, buying the dip',
    },
  },

  // Pepe variations
  pepe: {
    happy: {
      url: 'https://i.imgur.com/uJk91UY.png',
      alt: 'Happy Pepe',
      usage: 'moderate gains, good vibes',
    },
    sad: {
      url: 'https://i.imgur.com/X4Hq8Le.png',
      alt: 'Sad Pepe',
      usage: 'small losses, red days',
    },
    think: {
      url: 'https://i.imgur.com/x7aBctP.png',
      alt: 'Thinking Pepe',
      usage: 'analyzing charts, planning trades',
    },
    rocket: {
      url: 'https://i.imgur.com/mZHDqVs.png',
      alt: 'Rocket Pepe',
      usage: 'pumping, moon soon, gains',
    },
  },

  // Trading culture
  culture: {
    diamondHands: {
      url: 'https://i.imgur.com/QxPyV0L.png',
      alt: 'Diamond Hands',
      usage: 'holding through dip, strong conviction',
    },
    paperHands: {
      url: 'https://i.imgur.com/8TlPSKN.png',
      alt: 'Paper Hands',
      usage: 'selling too early, weak hands',
    },
    pumpIt: {
      url: 'https://i.imgur.com/BydAwtD.png',
      alt: 'Pump It',
      usage: 'market pumping, buying momentum',
    },
    dumpIt: {
      url: 'https://i.imgur.com/kE7RQXF.png',
      alt: 'Dump It',
      usage: 'market dumping, panic',
    },
    bogdanoff: {
      url: 'https://i.imgur.com/I7m0ONF.png',
      alt: 'Bogdanoff',
      usage: 'market manipulation jokes, bad timing',
    },
  },

  // Success/Motivation
  success: {
    stonks: {
      url: 'https://i.imgur.com/s46dOcC.png',
      alt: 'Stonks',
      usage: 'profits, gains, portfolio up',
    },
    notStonks: {
      url: 'https://i.imgur.com/9oBNXNu.png',
      alt: 'Not Stonks',
      usage: 'losses, portfolio down, red',
    },
    brain: {
      url: 'https://i.imgur.com/Z0iJesJ.png',
      alt: 'Expanding Brain',
      usage: 'learning progression, strategy evolution',
    },
  },

  // Doge/Shiba
  doge: {
    rich: {
      url: 'https://i.imgur.com/YvBWfPm.png',
      alt: 'Rich Doge',
      usage: 'big profits, whale status',
    },
    thinking: {
      url: 'https://i.imgur.com/6CZ6rUg.png',
      alt: 'Thinking Doge',
      usage: 'strategy planning, market analysis',
    },
  },
};

/**
 * Obtenir un mème basé sur le contexte du trade
 * @param {string} signal - 'BUY', 'SELL', 'HOLD'
 * @param {number} confidence - 0-100
 * @param {number} changePercent - % de changement du prix
 * @returns {object} - { url, alt, message }
 */
export function getMemeForSignal(signal, confidence, changePercent = 0) {
  // BUY signals
  if (signal === 'BUY') {
    if (confidence >= 85) {
      return {
        ...CRYPTO_MEMES.gigachad.default,
        message: "Achat de chad - Signal ultra fort ! 💎🙌",
      };
    } else if (confidence >= 70) {
      return {
        ...CRYPTO_MEMES.pepe.rocket,
        message: "Bon signal d'achat ! To the moon! 🚀",
      };
    } else if (confidence >= 50) {
      return {
        ...CRYPTO_MEMES.doge.thinking,
        message: "Signal d'achat modéré - Analyse supplémentaire conseillée",
      };
    } else {
      return {
        ...CRYPTO_MEMES.pepe.think,
        message: "Signal faible - Prudence recommandée",
      };
    }
  }

  // SELL signals
  if (signal === 'SELL') {
    if (confidence >= 85) {
      return {
        ...CRYPTO_MEMES.culture.dumpIt,
        message: "Signal de vente fort - Protège tes gains ! 📉",
      };
    } else if (confidence >= 70) {
      return {
        ...CRYPTO_MEMES.wojak.cope,
        message: "Attention - Signal de vente détecté ⚠️",
      };
    } else if (confidence >= 50) {
      return {
        ...CRYPTO_MEMES.pepe.sad,
        message: "Signal de vente modéré - Surveille le marché",
      };
    } else {
      return {
        ...CRYPTO_MEMES.wojak.smug,
        message: "Signal de vente faible - Pas de panique",
      };
    }
  }

  // HOLD signal
  return {
    ...CRYPTO_MEMES.gigachad.yes,
    message: "Pas de signal clair - HODL ! 💎",
  };
}

/**
 * Obtenir un mème basé sur le résultat d'un trade
 * @param {number} profitPercent - % de profit/perte
 * @returns {object} - { url, alt, message }
 */
export function getMemeForTradeResult(profitPercent) {
  if (profitPercent >= 20) {
    return {
      ...CRYPTO_MEMES.doge.rich,
      message: `+${profitPercent.toFixed(1)}% - Énorme gain ! Tu es une légende ! 🚀💰`,
    };
  } else if (profitPercent >= 10) {
    return {
      ...CRYPTO_MEMES.success.stonks,
      message: `+${profitPercent.toFixed(1)}% - Excellent trade ! Stonks ! 📈`,
    };
  } else if (profitPercent >= 5) {
    return {
      ...CRYPTO_MEMES.gigachad.crypto,
      message: `+${profitPercent.toFixed(1)}% - Bon travail chad ! 💪`,
    };
  } else if (profitPercent > 0) {
    return {
      ...CRYPTO_MEMES.pepe.happy,
      message: `+${profitPercent.toFixed(1)}% - Petit gain mais gain quand même ! 🐸`,
    };
  } else if (profitPercent >= -5) {
    return {
      ...CRYPTO_MEMES.pepe.sad,
      message: `${profitPercent.toFixed(1)}% - Petite perte, ça arrive ! 😢`,
    };
  } else if (profitPercent >= -10) {
    return {
      ...CRYPTO_MEMES.wojak.crying,
      message: `${profitPercent.toFixed(1)}% - Dommage... Apprends de cette erreur ! 😭`,
    };
  } else if (profitPercent >= -20) {
    return {
      ...CRYPTO_MEMES.culture.paperHands,
      message: `${profitPercent.toFixed(1)}% - Paper hands détectées ! 📄🙌`,
    };
  } else {
    return {
      ...CRYPTO_MEMES.wojak.pink,
      message: `${profitPercent.toFixed(1)}% - Grosse perte... Stay strong ! 💔`,
    };
  }
}

/**
 * Obtenir un mème basé sur le momentum du marché
 * @param {number} change24h - % de changement sur 24h
 * @returns {object} - { url, alt, message }
 */
export function getMemeForMarketMomentum(change24h) {
  if (change24h >= 15) {
    return {
      ...CRYPTO_MEMES.culture.pumpIt,
      message: "PUMP IT ! Le marché s'envole ! 🚀🚀🚀",
    };
  } else if (change24h >= 5) {
    return {
      ...CRYPTO_MEMES.pepe.rocket,
      message: "Momentum haussier fort ! 📈",
    };
  } else if (change24h > 0) {
    return {
      ...CRYPTO_MEMES.pepe.happy,
      message: "Marché légèrement haussier 😊",
    };
  } else if (change24h >= -5) {
    return {
      ...CRYPTO_MEMES.pepe.sad,
      message: "Marché légèrement baissier 😐",
    };
  } else if (change24h >= -15) {
    return {
      ...CRYPTO_MEMES.wojak.crying,
      message: "Dump detected ! Protège-toi ! 📉",
    };
  } else {
    return {
      ...CRYPTO_MEMES.wojak.pink,
      message: "CRASH ! Opportunity to buy the dip ? 💥",
    };
  }
}

/**
 * Obtenir un mème de motivation random
 * @returns {object} - { url, alt, message }
 */
export function getRandomMotivationalMeme() {
  const memes = [
    {
      ...CRYPTO_MEMES.gigachad.yes,
      message: "Tu peux le faire ! Diamond hands ! 💎🙌",
    },
    {
      ...CRYPTO_MEMES.culture.diamondHands,
      message: "HODL fort ! La patience paie ! ⏳",
    },
    {
      ...CRYPTO_MEMES.success.brain,
      message: "Chaque trade est une leçon ! 📚",
    },
    {
      ...CRYPTO_MEMES.doge.thinking,
      message: "Analyse avant d'agir ! 🧠",
    },
    {
      ...CRYPTO_MEMES.gigachad.crypto,
      message: "Le vrai chad DCA et HODL ! 💪",
    },
  ];

  return memes[Math.floor(Math.random() * memes.length)];
}

/**
 * Obtenir un mème basé sur le niveau RSI
 * @param {number} rsi - Valeur RSI (0-100)
 * @returns {object} - { url, alt, message }
 */
export function getMemeForRSI(rsi) {
  if (rsi < 25) {
    return {
      ...CRYPTO_MEMES.gigachad.crypto,
      message: `RSI ${rsi.toFixed(0)} - Ultra survente ! Opportunité d'achat ! 🎯`,
    };
  } else if (rsi < 30) {
    return {
      ...CRYPTO_MEMES.pepe.rocket,
      message: `RSI ${rsi.toFixed(0)} - Zone de survente ! 📊`,
    };
  } else if (rsi > 75) {
    return {
      ...CRYPTO_MEMES.wojak.rage,
      message: `RSI ${rsi.toFixed(0)} - Ultra surachat ! Danger ! ⚠️`,
    };
  } else if (rsi > 70) {
    return {
      ...CRYPTO_MEMES.wojak.cope,
      message: `RSI ${rsi.toFixed(0)} - Zone de surachat ! Prudence ! 📊`,
    };
  } else {
    return {
      ...CRYPTO_MEMES.pepe.think,
      message: `RSI ${rsi.toFixed(0)} - Zone neutre 🤔`,
    };
  }
}

/**
 * Obtenir un mème d'achievement
 * @param {string} achievementType - Type d'achievement
 * @returns {object} - { url, alt, message }
 */
export function getMemeForAchievement(achievementType) {
  const achievementMemes = {
    firstTrade: {
      ...CRYPTO_MEMES.pepe.happy,
      message: "Premier trade ! Bienvenue dans le game ! 🎮",
    },
    tenTrades: {
      ...CRYPTO_MEMES.wojak.smug,
      message: "10 trades ! Tu commences à comprendre ! 📊",
    },
    firstWin: {
      ...CRYPTO_MEMES.success.stonks,
      message: "Premier trade gagnant ! Stonks ! 📈",
    },
    winStreak: {
      ...CRYPTO_MEMES.gigachad.default,
      message: "Série de victoires ! Tu es un chad ! 🔥",
    },
    diamondHands: {
      ...CRYPTO_MEMES.culture.diamondHands,
      message: "HODL pendant 30 jours ! Diamond Hands ! 💎🙌",
    },
    profitMaster: {
      ...CRYPTO_MEMES.doge.rich,
      message: "+100% de profits ! Tu es riche ! 💰",
    },
    paperHands: {
      ...CRYPTO_MEMES.culture.paperHands,
      message: "Vendu trop tôt... Paper Hands ! 📄🙌",
    },
    buyTheDip: {
      ...CRYPTO_MEMES.gigachad.crypto,
      message: "Acheté le dip ! Smart move ! 🧠",
    },
  };

  return achievementMemes[achievementType] || getRandomMotivationalMeme();
}

export default CRYPTO_MEMES;
