// frontend/src/components/MemeDisplay.jsx
import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

/**
 * Composant pour afficher des mèmes crypto de manière contextuelle
 * Supporte plusieurs styles d'affichage : popup, inline, corner
 */
export default function MemeDisplay({
  meme,
  onClose,
  autoClose = true,
  autoCloseDuration = 4000,
  style = 'popup', // 'popup', 'inline', 'corner'
  size = 'medium', // 'small', 'medium', 'large'
  animated = true,
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (animated) {
      // Trigger animation
      setTimeout(() => setIsAnimating(true), 100);
    }

    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDuration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDuration, onClose, animated]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible || !meme) return null;

  // Tailles d'emoji/image
  const sizeClasses = {
    small: { container: 'w-24 h-24', text: 'text-6xl' },
    medium: { container: 'w-32 h-32', text: 'text-8xl' },
    large: { container: 'w-48 h-48', text: 'text-9xl' },
  };

  // Composant interne pour afficher le mème (emoji ou image)
  const MemeContent = ({ sizeName }) => {
    const { container, text } = sizeClasses[sizeName];

    if (meme.url) {
      return (
        <img
          src={meme.url}
          alt={meme.alt}
          className={`${container} object-contain rounded-lg shadow-lg`}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      );
    }

    return (
      <div className={`${container} ${text} flex items-center justify-center`}>
        {meme.emoji || '🎯'}
      </div>
    );
  };

  // Style popup (modal avec overlay)
  if (style === 'popup') {
    return (
      <div
        className={`fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      >
        <div
          className={`bg-card rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border-2 border-primary/30 transition-all duration-300 transform ${
            isAnimating ? 'scale-100 rotate-0' : 'scale-75 rotate-12'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          {onClose && (
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          )}

          {/* Sparkles decoration */}
          <div className="flex justify-center mb-4">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>

          {/* Meme emoji/image */}
          <div className="flex justify-center mb-6">
            <MemeContent sizeName={size} />
          </div>

          {/* Message */}
          {meme.message && (
            <div className="text-center">
              <p className="text-lg font-semibold text-card-foreground mb-2">
                {meme.message}
              </p>
              {meme.usage && (
                <p className="text-xs text-muted-foreground italic">
                  {meme.usage}
                </p>
              )}
            </div>
          )}

          {/* Auto-close indicator */}
          {autoClose && (
            <div className="mt-6 h-1 bg-accent rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-100"
                style={{
                  width: '100%',
                  animation: `shrink ${autoCloseDuration}ms linear`,
                }}
              />
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes shrink {
            from {
              width: 100%;
            }
            to {
              width: 0%;
            }
          }
        `}</style>
      </div>
    );
  }

  // Style inline (dans le contenu)
  if (style === 'inline') {
    return (
      <div
        className={`bg-accent/30 rounded-xl p-4 border border-border transition-all duration-300 ${
          isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Meme emoji/image */}
          <div className="flex-shrink-0">
            <MemeContent sizeName={size} />
          </div>

          {/* Message */}
          <div className="flex-1">
            {meme.message && (
              <p className="text-base font-semibold text-card-foreground mb-1">
                {meme.message}
              </p>
            )}
            {meme.usage && (
              <p className="text-xs text-muted-foreground italic">
                {meme.usage}
              </p>
            )}
          </div>

          {/* Close button */}
          {onClose && (
            <button
              onClick={handleClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Style corner (coin de l'écran)
  if (style === 'corner') {
    return (
      <div
        className={`fixed bottom-4 right-4 bg-card rounded-xl p-4 shadow-2xl border-2 border-primary/30 max-w-xs z-40 transition-all duration-300 transform ${
          isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        {/* Close button */}
        {onClose && (
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 p-1 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}

        <div className="flex items-start gap-3">
          {/* Meme emoji/image */}
          <div className="flex-shrink-0">
            <MemeContent sizeName="small" />
          </div>

          {/* Message */}
          <div className="flex-1 pr-6">
            {meme.message && (
              <p className="text-sm font-semibold text-card-foreground mb-1">
                {meme.message}
              </p>
            )}
            {meme.usage && (
              <p className="text-xs text-muted-foreground italic">
                {meme.usage}
              </p>
            )}
          </div>
        </div>

        {/* Auto-close indicator */}
        {autoClose && (
          <div className="mt-3 h-0.5 bg-accent rounded-full overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{
                width: '100%',
                animation: `shrink ${autoCloseDuration}ms linear`,
              }}
            />
          </div>
        )}

        <style jsx>{`
          @keyframes shrink {
            from {
              width: 100%;
            }
            to {
              width: 0%;
            }
          }
        `}</style>
      </div>
    );
  }

  return null;
}

/**
 * Mini composant pour afficher juste l'emoji du mème (sans message)
 */
export function MemeImage({ meme, size = 'medium', className = '' }) {
  const sizeClasses = {
    small: 'text-2xl w-8 h-8',
    medium: 'text-4xl w-12 h-12',
    large: 'text-6xl w-16 h-16',
    xlarge: 'text-8xl w-24 h-24',
  };

  if (!meme) return null;

  // Si le mème a une URL d'image, l'afficher
  if (meme.url) {
    return (
      <img
        src={meme.url}
        alt={meme.alt}
        title={meme.message || meme.alt}
        className={`${sizeClasses[size].split(' ').slice(1).join(' ')} object-contain rounded-lg ${className}`}
        onError={(e) => {
          // Fallback vers emoji si l'image ne charge pas
          e.target.style.display = 'none';
          e.target.insertAdjacentHTML('afterend', `<div class="${sizeClasses[size]} flex items-center justify-center ${className}">${meme.emoji || '🎯'}</div>`);
        }}
      />
    );
  }

  // Sinon afficher l'emoji
  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center ${className}`}
      title={meme.message || meme.alt}
    >
      {meme.emoji || '🎯'}
    </div>
  );
}

/**
 * Hook pour gérer l'affichage de mèmes avec état
 */
export function useMemeDisplay() {
  const [currentMeme, setCurrentMeme] = useState(null);
  const [memeStyle, setMemeStyle] = useState('corner');

  const showMeme = (meme, style = 'corner') => {
    setCurrentMeme(meme);
    setMemeStyle(style);
  };

  const hideMeme = () => {
    setCurrentMeme(null);
  };

  const MemeRenderer = () => (
    <MemeDisplay
      meme={currentMeme}
      onClose={hideMeme}
      style={memeStyle}
      autoClose={true}
      autoCloseDuration={4000}
    />
  );

  return {
    showMeme,
    hideMeme,
    MemeRenderer,
    currentMeme,
  };
}
