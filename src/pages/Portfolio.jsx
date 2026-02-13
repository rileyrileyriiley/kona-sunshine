import { Link } from 'react-router-dom';
import { useStore } from '../store/store';

export default function Portfolio() {
  const { state } = useStore();

  const userBets = state.bets
    .filter((b) => b.userId === state.currentUser)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const currentUser = state.friends.find((f) => f.id === state.currentUser);

  const activeBets = userBets.filter((b) => {
    const market = state.markets.find((m) => m.id === b.marketId);
    return market?.status === 'open';
  });

  const resolvedBets = userBets.filter((b) => {
    const market = state.markets.find((m) => m.id === b.marketId);
    return market?.status === 'resolved';
  });

  function getBetResult(bet) {
    const market = state.markets.find((m) => m.id === bet.marketId);
    if (market?.status !== 'resolved') return null;
    return (
      (bet.side === 'yes' && bet.outcomeId === market.resolvedOutcome) ||
      (bet.side === 'no' && bet.outcomeId !== market.resolvedOutcome)
    );
  }

  function renderBet(bet) {
    const market = state.markets.find((m) => m.id === bet.marketId);
    const outcome = market?.outcomes.find((o) => o.id === bet.outcomeId);
    const won = getBetResult(bet);
    const payout = Math.round(bet.amount / bet.price);

    return (
      <Link
        key={bet.id}
        to={`/market/${bet.marketId}`}
        className="block no-underline"
      >
        <div className={`bg-surface rounded-xl border p-4 hover:border-primary/50 transition-all ${
          won === true ? 'border-yes-green/50' : won === false ? 'border-no-red/50' : 'border-border'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-text-bright font-medium text-sm line-clamp-1">
              {market?.title}
            </p>
            {won === true && <span className="text-yes-green text-xs font-bold">WON</span>}
            {won === false && <span className="text-no-red text-xs font-bold">LOST</span>}
            {won === null && <span className="text-primary text-xs font-bold">OPEN</span>}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span>{outcome?.emoji}</span>
              <span className="text-text-dim">{outcome?.label}</span>
              <span className={`font-bold ${bet.side === 'yes' ? 'text-yes-green' : 'text-no-red'}`}>
                {bet.side.toUpperCase()}
              </span>
            </div>
            <div className="text-right">
              <span className="text-text-bright font-bold">${bet.amount}</span>
              <span className="text-text-dim text-xs ml-1">→ ${payout}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-4xl">{currentUser?.emoji}</span>
        <div>
          <h1 className="text-2xl font-extrabold text-text-bright">{currentUser?.name}'s Portfolio</h1>
          <p className="text-accent font-bold text-lg">
            ${currentUser?.balance.toLocaleString()} balance
          </p>
        </div>
      </div>

      {activeBets.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-text-bright mb-3">
            Active Positions ({activeBets.length})
          </h2>
          <div className="space-y-2">
            {activeBets.map(renderBet)}
          </div>
        </section>
      )}

      {resolvedBets.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-text-bright mb-3">
            History ({resolvedBets.length})
          </h2>
          <div className="space-y-2">
            {resolvedBets.map(renderBet)}
          </div>
        </section>
      )}

      {userBets.length === 0 && (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">💰</p>
          <p className="text-text-dim mb-4">No bets placed yet</p>
          <Link
            to="/"
            className="text-primary font-medium hover:underline"
          >
            Browse markets →
          </Link>
        </div>
      )}
    </div>
  );
}
