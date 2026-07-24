export const paymentConfig = {
  bankAccountNumber: process.env.NEXT_PUBLIC_PAYMENT_BANK_ACCOUNT ?? "",
  bankAccountName: process.env.NEXT_PUBLIC_PAYMENT_BANK_ACCOUNT_NAME ?? "",
  bankName: process.env.NEXT_PUBLIC_PAYMENT_BANK_NAME ?? "",
  qrisImage: process.env.NEXT_PUBLIC_PAYMENT_QRIS_IMAGE ?? "",
  qrisLabel: process.env.NEXT_PUBLIC_PAYMENT_QRIS_LABEL ?? "",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
};

export function isManualPaymentConfigured(): boolean {
  return Boolean(
    paymentConfig.bankAccountNumber && paymentConfig.bankAccountName,
  );
}
