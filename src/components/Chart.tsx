
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Types
interface ChartData {
  name: string;
  value: number;
}

type ChartType = 'bar' | 'pie';

interface ChartProps {
  data: ChartData[];
  type?: ChartType;
  title?: string;
  height?: number;
  colors?: string[];
}

const Chart = ({
  data,
  type = 'bar',
  title,
  height = 300,
  colors = ['#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899'],
}: ChartProps) => {
  // Generate colors for pie chart segments
  const COLORS = useMemo(() => {
    if (colors.length >= data.length) return colors;
    
    // If not enough colors provided, generate additional colors
    return [...colors, ...Array(data.length - colors.length).fill('#3b82f6')];
  }, [data.length, colors]);
  
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                className="text-foreground/70"
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                className="text-foreground/70"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  color: 'hsl(var(--foreground))',
                }}
              />
              <Bar 
                dataKey="value" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                fill="hsl(var(--primary))"
                dataKey="value"
                nameKey="name"
                paddingAngle={2}
                animationDuration={1500}
                animationEasing="ease-out"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  color: 'hsl(var(--foreground))',
                }}
                formatter={(value, name) => [value, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return <div>Invalid chart type</div>;
    }
  };
  
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      {renderChart()}
    </div>
  );
};

export default Chart;
