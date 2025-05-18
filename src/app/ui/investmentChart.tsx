'use client';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useMemo } from 'react';
import { Investment } from '../customTypes/Investment';

ChartJS.register(ArcElement, Tooltip, Legend);


interface InvestmentChartProps {
  investments: Investment[];
}

export default function InvestmentChart({ investments }: InvestmentChartProps) {
  const chartData = useMemo(() => {
    const totalByType: Record<string, number> = {
      STOCK: 0,
      FUND: 0,
      BOND: 0
    };

    investments.forEach((investment) => {
      totalByType[investment.type] += 1;
    });

    return {
      labels: ['Ação', 'Fundo', 'Título'],
      datasets: [
        {
          data: [
            totalByType['STOCK'],
            totalByType['FUND'],
            totalByType['BOND']
          ],
          backgroundColor: ['#79B473', '#F46197', '#F0F2A6'],
          hoverOffset: 10,
        },
      ],
    };
  }, [investments]);

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <Pie data={chartData} />
    </div>
  );
}
