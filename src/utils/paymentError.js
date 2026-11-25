export function paymentErrorMessage(error) {
  let details = error;

  if (typeof details === 'string') {
    try { details = JSON.parse(details); } catch { details = { message: details }; }
  }
  if (typeof details?.description === 'string' && details.description.startsWith('{')) {
    try { details = { ...details, ...JSON.parse(details.description) }; } catch { /* Keep the original message. */ }
  }

  const payment = details?.error || details;
  const message = [payment?.description, payment?.message, details?.message]
    .find(value => typeof value === 'string' && value.trim() && value !== 'undefined') || '';
  const reason = String(payment?.reason || '').toLowerCase();
  const code = String(payment?.code || details?.code || '').toLowerCase();
  const combined = `${message} ${reason} ${code}`.toLowerCase();

  if (/cancel|dismiss|closed by user/.test(combined) || code === '2') {
    return { title: 'Payment cancelled', message: 'You closed the payment window. No subscription was activated. You can choose a plan whenever you are ready.' };
  }
  if (message && !message.startsWith('{')) {
    return { title: 'Payment could not be completed', message };
  }
  return { title: 'Payment could not be completed', message: 'The payment was not completed. Please try again or choose another payment method.' };
}
