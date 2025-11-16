import { X, TrendingUp, TrendingDown, Activity, Target, BarChart3, Layers } from 'lucide-react';
import { useMarketSeries } from '../hooks/useMarketSeries';
import {
  calculateFibonacciLevels,
  analyzeBollingerBands,
  analyzeFibonacciPosition,
  calculateConfluence
} from '../utils/advancedIndicators';
import { useMemo } from 'react';

export default function TechnicalAnalysisModal({ symbol, price, change24h, onClose }) {
  const { data: series, loading } = useMarketSeries({ symbol, tf: '1h' });

  const analysis = useMemo(() => {
    if (!series || series.length === 0 || loading) {
      return null;
    }

    const latest = series[series.length - 1];
    const fibonacci = calculateFibonacciLevels(series, 100);
    const bbSignal = analyzeBollingerBands(series, price);
    const fibSignal = analyzeFibonacciPosition(price, fibonacci);
    const rsi = latest?.rsi ?? null;

    const confluence = calculateConfluence({
      rsi,
      bbSignal,
      fibSignal,
      change24h,
    });

    return {
      confluence,
      rsi,
      fibonacci,
      bollingerBands: {
        upper: latest?.bbUpper,
        middle: latest?.bbMiddle,
        lower: latest?.bbLower,
        signal: bbSignal,
      },
      sma20: latest?.ma20,
      sma50: latest?.ma50,
    };
  }, [series, loading, price, change24h]);

  if (loading || !analysis) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-card rounded-2xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Analyse en cours...</p>
          </div>
        </div>
      </div>
    );
  }

  const { confluence, rsi, fibonacci, bollingerBands, sma20, sma50 } = analysis;
  const actionColor = confluence.action === 'BUY' ? 'text-green-600' :
                     confluence.action === 'SELL' ? 'text-red-600' : 'text-yellow-600';

  const IndicatorRow = ({ label, value, signal, description }) => {
    const signalColors = {
      BUY: 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30',
      SELL: 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30',
      HOLD: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
      NEUTRAL: 'bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30',
    };

    return (
      <div className="border border-border rounded-lg p-4 bg-accent/30">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-card-foreground">{label}</span>
          {signal && (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${signalColors[signal]}`}>
              {signal}
            </span>
          )}
        </div>
        <div className="text-2xl font-bold text-card-foreground mb-1">{value}</div>
        {description && <div className="text-xs text-muted-foreground">{description}</div>}
      </div>
    );
  };

  const getRSISignal = () => {
    if (rsi < 30) return 'BUY';
    if (rsi > 70) return 'SELL';
    return 'NEUTRAL';
  };

  const getRSIDescription = () => {
    if (rsi < 30) return 'Zone de survente - Signal d\'achat potentiel';
    if (rsi > 70) return 'Zone de surachat - Signal de vente potentiel';
    if (rsi >= 45 && rsi <= 55) return 'Zone neutre - Pas de signal clair';
    return rsi < 50 ? 'Légèrement baissier' : 'Légèrement haussier';
  };

  const getBBPosition = () => {
    if (!bollingerBands.upper || !bollingerBands.lower) return 'N/A';
    const range = bollingerBands.upper - bollingerBands.lower;
    const position = (price - bollingerBands.lower) / range;
    return `${(position * 100).toFixed(1)}%`;
  };

  const getBBDescription = () => {
    if (!bollingerBands.signal?.signal) return 'Position normale';
    return bollingerBands.signal.reason;
  };

  const getTrendDescription = () => {
    if (!fibonacci.trend) return 'Tendance non déterminée';
    return fibonacci.trend === 'UPTREND' ?
      'Tendance haussière - Swing high récent supérieur au swing low' :
      'Tendance baissière - Swing low récent inférieur au swing high';
  };

  const getSMACross = () => {
    if (!sma20 || !sma50) return 'NEUTRAL';
    if (sma20 > sma50) return 'BUY';
    if (sma20 < sma50) return 'SELL';
    return 'NEUTRAL';
  };

  const getSMADescription = () => {
    if (!sma20 || !sma50) return 'Données insuffisantes';
    const diff = ((sma20 - sma50) / sma50 * 100).toFixed(2);
    if (sma20 > sma50) return `Golden Cross - SMA20 au-dessus de SMA50 (+${diff}%)`;
    if (sma20 < sma50) return `Death Cross - SMA20 en-dessous de SMA50 (${diff}%)`;
    return 'Moyennes mobiles alignées';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-card rounded-2xl max-w-4xl w-full my-8" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-card-foreground mb-1">
                Analyse Technique Détaillée - {symbol}
              </h2>
              <p className="text-muted-foreground">
                ${price.toLocaleString('fr-FR')}
                <span className={`ml-2 ${change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}% (24h)
                </span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Signal Global */}
          <div className={`rounded-xl p-6 border-2 ${
            confluence.action === 'BUY' ? 'bg-green-500/10 border-green-500/30' :
            confluence.action === 'SELL' ? 'bg-red-500/10 border-red-500/30' :
            'bg-yellow-500/10 border-yellow-500/30'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground">Signal de Confluence</h3>
                  <p className="text-sm text-muted-foreground">Basé sur {confluence.reasons.length} indicateurs</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${actionColor}`}>{confluence.action}</div>
                <div className="text-sm text-muted-foreground">Confiance: {confluence.confidence}%</div>
              </div>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                <div className="text-xs text-muted-foreground mb-1">Score Achat</div>
                <div className="text-2xl font-bold text-green-600">{confluence.scores.buy}</div>
              </div>
              <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                <div className="text-xs text-muted-foreground mb-1">Score Vente</div>
                <div className="text-2xl font-bold text-red-600">{confluence.scores.sell}</div>
              </div>
            </div>

            {/* Raisons */}
            <div className="space-y-1">
              <div className="text-sm font-semibold text-card-foreground mb-2">Facteurs analysés:</div>
              {confluence.reasons.map((reason, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Indicateurs Détaillés */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-card-foreground">Indicateurs Techniques</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* RSI */}
              <IndicatorRow
                label="RSI (14)"
                value={rsi ? rsi.toFixed(1) : 'N/A'}
                signal={rsi ? getRSISignal() : null}
                description={rsi ? getRSIDescription() : 'Données insuffisantes'}
              />

              {/* Bollinger Bands */}
              <IndicatorRow
                label="Bollinger Bands"
                value={getBBPosition()}
                signal={bollingerBands.signal?.signal || 'NEUTRAL'}
                description={getBBDescription()}
              />

              {/* Fibonacci */}
              <IndicatorRow
                label="Tendance Fibonacci"
                value={fibonacci.trend === 'UPTREND' ? 'Haussière' : fibonacci.trend === 'DOWNTREND' ? 'Baissière' : 'N/A'}
                signal={fibonacci.trend === 'UPTREND' ? 'BUY' : fibonacci.trend === 'DOWNTREND' ? 'SELL' : 'NEUTRAL'}
                description={getTrendDescription()}
              />

              {/* SMA Cross */}
              <IndicatorRow
                label="SMA 20/50"
                value={sma20 && sma50 ? `${sma20.toFixed(2)} / ${sma50.toFixed(2)}` : 'N/A'}
                signal={getSMACross()}
                description={getSMADescription()}
              />
            </div>
          </div>

          {/* Niveaux Clés */}
          {fibonacci.levels && fibonacci.levels.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-card-foreground">Niveaux Fibonacci</h3>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: 'Swing High (100%)', level: fibonacci.levels[6] },
                  { label: 'Niveau 78.6%', level: fibonacci.levels[5] },
                  { label: 'Golden Ratio (61.8%)', level: fibonacci.levels[4] },
                  { label: 'Niveau 50%', level: fibonacci.levels[3] },
                  { label: 'Niveau 38.2%', level: fibonacci.levels[2] },
                  { label: 'Niveau 23.6%', level: fibonacci.levels[1] },
                  { label: 'Swing Low (0%)', level: fibonacci.levels[0] },
                ].map((item, i) => {
                  const isNearPrice = Math.abs(item.level - price) / price < 0.02;
                  return (
                    <div
                      key={i}
                      className={`p-2 rounded border ${
                        isNearPrice
                          ? 'bg-primary/10 border-primary/30 font-semibold'
                          : 'bg-accent/30 border-border'
                      }`}
                    >
                      <div className="text-muted-foreground">{item.label}</div>
                      <div className="font-mono text-card-foreground">
                        ${item.level.toFixed(2)}
                        {isNearPrice && <span className="ml-1 text-primary">★</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bollinger Bands Détails */}
          {bollingerBands.upper && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-card-foreground">Bollinger Bands (20, 2)</h3>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-3 rounded border border-border bg-red-500/10">
                  <div className="text-muted-foreground mb-1">Bande Supérieure</div>
                  <div className="font-mono font-semibold text-card-foreground">
                    ${bollingerBands.upper.toFixed(2)}
                  </div>
                </div>
                <div className="p-3 rounded border border-border bg-blue-500/10">
                  <div className="text-muted-foreground mb-1">Moyenne (SMA20)</div>
                  <div className="font-mono font-semibold text-card-foreground">
                    ${bollingerBands.middle.toFixed(2)}
                  </div>
                </div>
                <div className="p-3 rounded border border-border bg-green-500/10">
                  <div className="text-muted-foreground mb-1">Bande Inférieure</div>
                  <div className="font-mono font-semibold text-card-foreground">
                    ${bollingerBands.lower.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="mt-3 relative h-2 bg-gradient-to-r from-green-500 via-blue-500 to-red-500 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 h-full w-1 bg-white shadow-lg"
                  style={{
                    left: `${Math.max(0, Math.min(100, ((price - bollingerBands.lower) / (bollingerBands.upper - bollingerBands.lower)) * 100))}%`
                  }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Survente</span>
                <span>Prix actuel: ${price.toFixed(2)}</span>
                <span>Surachat</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6 bg-accent/30">
          <p className="text-xs text-muted-foreground text-center">
            ⚠️ Cette analyse est fournie à des fins éducatives uniquement. Ce n'est pas un conseil financier.
            Faites toujours vos propres recherches avant de prendre une décision d'investissement.
          </p>
        </div>
      </div>
    </div>
  );
}
