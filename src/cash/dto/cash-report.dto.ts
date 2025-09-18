export class CashReportDto {
  date: string; // YYYY-MM-DD (local)
  openingAmount: number;
  closingAmount: number | null;
  totalIncome: number;
  totalExpense: number;
  totalSales: number;
  balance: number;
  movements: Array<{
    id: string;
    type: string;
    amount: number;
    description?: string;
    createdAt: string;
  }>;
}
