import { ChargeConfig, Person, PersonSummary } from '../types';

/** Round to 2 decimal places to prevent floating point drift in monetary calculations */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function getPersonSubtotal(person: Person): number {
  return person.items.reduce((sum, item) => {
    const splitCount = item.splitBetween.length;
    if (splitCount === 0) return sum;
    return sum + round2(item.price / splitCount);
  }, 0);
}

export function getGroupSubtotal(people: Person[]): number {
  return people.reduce((sum, person) => sum + getPersonSubtotal(person), 0);
}

export function getChargeAmount(config: ChargeConfig, groupSubtotal: number): number {
  if (config.type === 'percentage') {
    return round2(groupSubtotal * (config.value / 100));
  }
  return config.value;
}

export function getPersonChargeShare(
  personSubtotal: number,
  groupSubtotal: number,
  totalCharge: number
): number {
  if (groupSubtotal === 0) return 0;
  return round2((personSubtotal / groupSubtotal) * totalCharge);
}

export function calculatePersonSummaries(
  people: Person[],
  tax: ChargeConfig,
  service: ChargeConfig,
  tip: ChargeConfig = { type: 'percentage', value: 0 }
): PersonSummary[] {
  const groupSubtotal = getGroupSubtotal(people);
  const totalTax = getChargeAmount(tax, groupSubtotal);
  const totalService = getChargeAmount(service, groupSubtotal);
  const totalTip = getChargeAmount(tip, groupSubtotal);

  const summaries = people.map((person) => {
    const subtotal = round2(getPersonSubtotal(person));
    const taxAmount = getPersonChargeShare(subtotal, groupSubtotal, totalTax);
    const serviceAmount = getPersonChargeShare(subtotal, groupSubtotal, totalService);
    const tipAmount = getPersonChargeShare(subtotal, groupSubtotal, totalTip);

    const items = person.items.map((item) => ({
      name: item.name,
      amount: item.splitBetween.length > 0 ? round2(item.price / item.splitBetween.length) : 0,
    }));

    return {
      person,
      subtotal,
      taxAmount,
      serviceAmount,
      tipAmount,
      total: round2(subtotal + taxAmount + serviceAmount + tipAmount),
      items,
    };
  });

  // Adjust rounding remainder: ensure sum of per-person tax/service/tip equals the total
  // Apply any rounding difference (typically ≤0.01) to the first person
  if (summaries.length > 0) {
    const sumTax = summaries.reduce((s, p) => s + p.taxAmount, 0);
    const sumService = summaries.reduce((s, p) => s + p.serviceAmount, 0);
    const sumTip = summaries.reduce((s, p) => s + p.tipAmount, 0);
    const taxDrift = round2(totalTax - sumTax);
    const serviceDrift = round2(totalService - sumService);
    const tipDrift = round2(totalTip - sumTip);

    const recalcTotal = (s: PersonSummary) =>
      round2(s.subtotal + s.taxAmount + s.serviceAmount + s.tipAmount);

    if (taxDrift !== 0) {
      summaries[0].taxAmount = round2(summaries[0].taxAmount + taxDrift);
      summaries[0].total = recalcTotal(summaries[0]);
    }
    if (serviceDrift !== 0) {
      summaries[0].serviceAmount = round2(summaries[0].serviceAmount + serviceDrift);
      summaries[0].total = recalcTotal(summaries[0]);
    }
    if (tipDrift !== 0) {
      summaries[0].tipAmount = round2(summaries[0].tipAmount + tipDrift);
      summaries[0].total = recalcTotal(summaries[0]);
    }
  }

  return summaries;
}

export function getGrandTotal(summaries: PersonSummary[]): number {
  return round2(summaries.reduce((sum, s) => sum + s.total, 0));
}

export function validateAgainstReceipt(
  summaries: PersonSummary[],
  receiptTotal: number
): { isValid: boolean; difference: number } {
  if (!isFinite(receiptTotal) || isNaN(receiptTotal)) {
    return { isValid: false, difference: 0 };
  }
  const grandTotal = getGrandTotal(summaries);
  if (!isFinite(grandTotal) || isNaN(grandTotal)) {
    return { isValid: false, difference: 0 };
  }
  const difference = round2(grandTotal - receiptTotal);
  return {
    isValid: Math.abs(difference) <= 0.99,
    difference,
  };
}
