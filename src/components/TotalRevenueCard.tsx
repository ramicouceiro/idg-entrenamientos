import { DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function TotalRevenueCard() {
  return (
    <Card className='w-full h-full'>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2x; font-medium">Ingreso Total</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">$45,231.89</div>
      </CardContent>
    </Card>
  );
}