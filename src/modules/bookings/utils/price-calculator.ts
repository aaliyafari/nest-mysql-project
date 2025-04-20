import { PricingRule } from '@modules/pricing/entities/pricing-rule.entity';

export const calculateBookingPrice = (
  start: Date,
  end: Date,
  pricingRules: PricingRule[]
): number => {
  const totalMilliseconds = end.getTime() - start.getTime();
  const totalHours = totalMilliseconds / (1000 * 60 * 60);
  const totalDays = Math.ceil(totalMilliseconds / (1000 * 60 * 60 * 24));

  const dailyRule = pricingRules.find(rule => rule.ruleType === 'daily');
  const hourlyRule = pricingRules.find(rule => rule.ruleType === 'hourly');

  let dailyPrice = Number.MAX_SAFE_INTEGER;
  let hourlyPrice = Number.MAX_SAFE_INTEGER;

  if (dailyRule) {
    const basePrice = Number(dailyRule.basePrice) || 0;
    const multiplier = Number(dailyRule.multiplier) || 1;
    dailyPrice = basePrice * multiplier * totalDays;
  }

  if (hourlyRule) {
    const basePrice = Number(hourlyRule.basePrice) || 0;
    const multiplier = Number(hourlyRule.multiplier) || 1;
    hourlyPrice = basePrice * multiplier * totalHours;
  }

  const finalPrice = Math.min(dailyPrice, hourlyPrice);
  return roundToTwoDecimal(finalPrice);
};

const roundToTwoDecimal = (value: number): number => {
  return Math.round(value * 100) / 100;
};

