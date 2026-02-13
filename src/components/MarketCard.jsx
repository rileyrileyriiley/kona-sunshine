import { Link } from 'react-router-dom';
import { useStore } from '../store/store';

export default function MarketCard({ market }) {
  const { state } = useStore();

  const topOutcome = [...market.outcomes].sort(
    (a, b) => b.probability - a.probability
  )[0];

  const betCount = state.bets.filter((b) => b.marketId === market.id).length;
  const volume = state.bets
    .filter((b) => b.marketId === market.id)
    .reduce((sum, b) => sum + b.amount, 0);

  const isResolved = market.status === 'resolved';
  const resolvedOutcome = market.outcomes.find(
    (o) => o.id === market.resolvedOutcome
  );

  return (
    <Link
      to={`/market/${market.id}`}
      className="block no-underline group"
    >
      <div className="bg-surface rounded-2xl border border-border p-5 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
        {isResolved && (
          <div className="inline-flex items-center gap-1.5 bg-yes-green/20 text-yes-green px-2.5 py-1 rounded-full text-xs font-semibold mb-3">
            <span>Resolved</span>
            <span>{resolvedOutcome?.emoji} {resolvedOutcome?.label}</span>
          </div>
        )}

        {!isResolved && (
          <div className="inline-flex items-center gap-1.5 bg-primary/20 text-primary px-2.5 py-1 rounded-full text-xs font-semibold mb-3">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            Live
          </div>
        )}

        <h3 className="text-text-bright font-bold text-lg mb-3 group-hover:text-primary transition-colors">
          {market.title}
        </h3>

        <div className="space-y-2 mb-4">
          {market.outcomes.slice(0, 3).map((outcome) => (
            <div key={outcome.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <span>{outcome.emoji}</span>
                <span className="text-text">{outcome.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-surface-lighter rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${outcome.probability * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-text-bright w-10 text-right">
                  {Math.round(outcome.probability * 100)}%
                </span>
              </div>
            </div>
          ))}
          {market.outcomes.length > 3 && (
            <p className="text-xs text-text-dim">
              +{market.outcomes.length - 3} more outcomes
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-text-dim pt-3 border-t border-border">
          <span>{betCount} bet{betCount !== 1 ? 's' : ''}</span>
          <span>${volume.toLocaleString()} volume</span>
          <span className="ml-auto text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Trade →
          </span>
        </div>
      </div>
    </Link>
  );
}
