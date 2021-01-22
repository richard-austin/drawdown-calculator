export class YearTotalDualCol
{
    public constructor(init?:Partial<YearTotalDualCol>) {
        Object.assign(this, init);
    }

    yearNum!: number;
    remainingFunds!: number;
    annualIncome!: number;

    yearNumRight!: number
    remainingFundsRight!: number;
    annualIncomeRight!: number;
}
