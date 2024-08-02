import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  percentage: number;
}

const DoughnutChart = ({ percentage }:DoughnutChartProps) => {
  const primaryColor = '#8b5cf6';
  const secondaryColor = '#C4C4C4';

  const data = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: [primaryColor, secondaryColor],
        hoverBackgroundColor: [primaryColor, secondaryColor],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '75%',
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: false, 
      },
    },
  };

  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: (chart:any) => {
      const { ctx, width, height } = chart;
      ctx.restore();
      const fontSize = (height / 100).toFixed(2);
      ctx.font = `bold ${fontSize}em Montserrat`;
      ctx.fillStyle = primaryColor; 
      ctx.textBaseline = 'middle';

      const text = `${percentage.toFixed(2)}%`;
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2;

      ctx.fillText(text, textX, textY);
      ctx.save();
    },
  };

  return (
    <div style={{ position: 'relative', width: '4rem', height: '4rem' }}>
      <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
    </div>
  );
};

export default DoughnutChart;
