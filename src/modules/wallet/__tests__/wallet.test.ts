import { describe, it, expect } from "bun:test";
import { TransactionType, HoldStatus } from "../types";

/**
 * Simulación de la lógica de negocio de la Billetera para verificar invariantes.
 */
describe("Wallet Logic Invariants", () => {

  it("Double-entry JournalEntry must sum zero", () => {
    const journalEntry = {
      id: "j_1",
      ledgerEntries: [
        { accountId: "user_1", amount: -100, type: TransactionType.PAYMENT },
        { accountId: "system_revenue", amount: 100, type: TransactionType.PAYMENT }
      ]
    };

    const sum = journalEntry.ledgerEntries.reduce((acc, entry) => acc + entry.amount, 0);
    expect(sum).toBe(0);
  });

  it("Available balance must be balance minus active holds", () => {
    const account = {
      balance: 1000,
      holds: [
        { amount: 200, status: HoldStatus.ACTIVE },
        { amount: 150, status: HoldStatus.RELEASED },
        { amount: 300, status: HoldStatus.ACTIVE }
      ]
    };

    const activeHoldsSum = account.holds
      .filter(h => h.status === HoldStatus.ACTIVE)
      .reduce((acc, h) => acc + h.amount, 0);

    const availableBalance = account.balance - activeHoldsSum;
    expect(availableBalance).toBe(500);
  });

  it("Reversal must negate previous entries", () => {
    const originalEntries = [
      { accountId: "user_1", amount: -50 },
      { accountId: "system", amount: 50 }
    ];

    const reversalEntries = originalEntries.map(e => ({
      ...e,
      amount: -e.amount,
      description: "Reversal"
    }));

    expect(reversalEntries[0].amount).toBe(50);
    expect(reversalEntries[1].amount).toBe(-50);
  });
});
