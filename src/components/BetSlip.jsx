import { useState } from 'react';
import { useStore } from '../store/store';

export default function BetSlip({ market, outcome, side, onClose }) {
  const { state, dispatch } = useStore();
  const [amount, setAmount] = useState(25);

  const currentUser = state.friends.find((f) => f.id === state.currentUser);
  const price = side === 'yes' ? outcome.probability : 1 - outcome.probability;
  const payout = Math.round(amount / price);
  const profit = payout - amount;

  function handleBet() {
    if (amount <= 0 || amount > currentUser.balance) return;
    dispatch({
      type: 'PLACE_BET',
      payload: {
        marketId: market.id,
        outcomeId: outcome.id,
        amount,
        userId: state.currentUser,
        side,
      },
    });
    onClose();
  }

  const presets = [10, 25, 50, 100, 250];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-2xl border border-border w-full max-w-md overflow-hidden">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-bright font-bold text-lg">Place Bet</h3>
            <button
              onClick={onClose}
              className="text-text-dim hover:text-text text-xl bg-transparent border-none cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="bg-surface-light rounded-xl p-4 mb-4">
            <p className="text-sm text-text-dim mb-1">
              {outcome.emoji} {outcome.label}
            </p>
            <div className="flex items-center gap-2">
              <span
                className={`text-2xl font-extrabold ${
                  side === 'yes' ? 'text-yes-green' : 'text-no-red'
                }`}
              >
                {side === 'yes' ? 'YES' : 'NO'}
              </span>
              <span className="text-text-dim">@</span>
              <span className="text-text-bright font-bold text-2xl">
                {Math.round(price * 100)}¢
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm text-text-dim block mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim font-bold">
                $
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-surface-light border border-border rounded-xl px-8 py-3 text-text-bright font-bold text-xl text-center focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => setAmount(p)}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                    amount === p
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-surface-light border-border text-text-dim hover:text-text'
                  }`}
                >
                  ${p}
                </button>
              ))}
            </div>
            <p className="text-xs text-text-dim mt-2 text-right">
              Balance: ${currentUser?.balance.toLocaleString()}
            </p>
          </div>

          <div className="bg-surface-light rounded-xl p-4 mb-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-dim">Avg price</span>
              <span className="text-text-bright font-medium">{Math.round(price * 100)}¢</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-dim">Shares</span>
              <span className="text-text-bright font-medium">{payout}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-dim">Potential payout</span>
              <span className="text-yes-green font-bold">${payout.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-border">
              <span className="text-text-dim">Max profit</span>
              <span className="text-yes-green font-extrabold text-lg">
                +${profit.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={handleBet}
            disabled={amount <= 0 || amount > currentUser.balance}
            className={`w-full py-3.5 rounded-xl font-bold text-lg text-white border-none cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              side === 'yes'
                ? 'bg-yes-green hover:bg-yes-green-dark'
                : 'bg-no-red hover:bg-no-red-dark'
            }`}
          >
            {side === 'yes' ? 'Buy Yes' : 'Buy No'} — ${amount}
          </button>
        </div>
      </div>
    </div>
  );
}
