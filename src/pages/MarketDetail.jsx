import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useStore } from '../store/store';
import BetSlip from '../components/BetSlip';

export default function MarketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const [betSlip, setBetSlip] = useState(null);

  const market = state.markets.find((m) => m.id === id);
  if (!market) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">🤷</p>
        <p className="text-text-dim">Market not found</p>
      </div>
    );
  }

  const marketBets = state.bets.filter((b) => b.marketId === market.id);
  const volume = marketBets.reduce((sum, b) => sum + b.amount, 0);
  const isResolved = market.status === 'resolved';

  function handleResolve(outcomeId) {
    if (!window.confirm('Are you sure? This will pay out all winning bets.')) return;
    dispatch({ type: 'RESOLVE_MARKET', payload: { marketId: market.id, outcomeId } });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="text-text-dim hover:text-text text-sm mb-6 bg-transparent border-none cursor-pointer"
      >
        ← Back to markets
      </button>

      <div className="mb-6">
        {isResolved ? (
          <div className="inline-flex items-center gap-1.5 bg-yes-green/20 text-yes-green px-3 py-1 rounded-full text-xs font-semibold mb-3">
            Resolved
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            Live
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-bright mb-2">
          {market.title}
        </h1>
        <p className="text-text-dim">{market.description}</p>
        <div className="flex gap-4 mt-3 text-sm text-text-dim">
          <span>{marketBets.length} bets</span>
          <span>${volume.toLocaleString()} volume</span>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {market.outcomes
          .sort((a, b) => b.probability - a.probability)
          .map((outcome) => {
            const isWinner = isResolved && market.resolvedOutcome === outcome.id;
            return (
              <div
                key={outcome.id}
                className={`bg-surface rounded-2xl border p-4 transition-all ${
                  isWinner
                    ? 'border-yes-green shadow-lg shadow-yes-green/10'
                    : 'border-border'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{outcome.emoji}</span>
                    <div>
                      <p className="text-text-bright font-bold">
                        {outcome.label}
                        {isWinner && <span className="ml-2 text-yes-green">✓ Winner</span>}
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-extrabold text-text-bright">
                    {Math.round(outcome.probability * 100)}%
                  </span>
                </div>

                <div className="w-full h-2 bg-surface-lighter rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isWinner ? 'bg-yes-green' : 'bg-primary'
                    }`}
                    style={{ width: `${outcome.probability * 100}%` }}
                  />
                </div>

                {!isResolved && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBetSlip({ outcome, side: 'yes' })}
                      className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-yes-green/15 text-yes-green border border-yes-green/30 hover:bg-yes-green/25 cursor-pointer transition-colors"
                    >
                      Yes {Math.round(outcome.probability * 100)}¢
                    </button>
                    <button
                      onClick={() => setBetSlip({ outcome, side: 'no' })}
                      className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-no-red/15 text-no-red border border-no-red/30 hover:bg-no-red/25 cursor-pointer transition-colors"
                    >
                      No {Math.round((1 - outcome.probability) * 100)}¢
                    </button>
                    {market.createdBy === state.currentUser && (
                      <button
                        onClick={() => handleResolve(outcome.id)}
                        className="px-3 py-2.5 rounded-xl text-sm bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25 cursor-pointer transition-colors"
                        title="Resolve: this is what happened"
                      >
                        ✓
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {marketBets.length > 0 && (
        <div className="bg-surface rounded-2xl border border-border p-5">
          <h2 className="text-text-bright font-bold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[...marketBets].reverse().slice(0, 10).map((bet) => {
              const friend = state.friends.find((f) => f.id === bet.userId);
              const outcome = market.outcomes.find((o) => o.id === bet.outcomeId);
              return (
                <div key={bet.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>{friend?.emoji}</span>
                    <span className="text-text font-medium">{friend?.name}</span>
                    <span className="text-text-dim">bought</span>
                    <span
                      className={`font-bold ${
                        bet.side === 'yes' ? 'text-yes-green' : 'text-no-red'
                      }`}
                    >
                      {bet.side.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-text-dim">{outcome?.emoji} {outcome?.label}</span>
                    <span className="text-text-bright font-medium ml-2">${bet.amount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {betSlip && (
        <BetSlip
          market={market}
          outcome={betSlip.outcome}
          side={betSlip.side}
          onClose={() => setBetSlip(null)}
        />
      )}
    </div>
  );
}
