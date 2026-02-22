/**
 * Cuentas operativas del sistema (Hardcoded IDs o códigos)
 */
export const SYSTEM_ACCOUNTS = {
  SHIPPING_REVENUE: 'sys_shipping_revenue',
  TAX_COLLECTION: 'sys_tax_collection',
  OFFSHORE_ESCROW: 'sys_offshore_escrow',
  LIQUIDITY_POOL: 'sys_liquidity_pool',
};

export const WALLET_CONFIG = {
  MIN_RECHARGE_AMOUNT: 10, // USD
  MAX_DAILY_TRANSACTION: 5000, // USD
  HOLD_EXPIRATION_DAYS: 7,
};
