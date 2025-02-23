// import { AreaChart } from "@/components/base/AreaChart";
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis } from "recharts";

const MOCK_DATA = [
  {
    date: "2024-01-01",
    balance: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    date: "2024-01-02",
    balance: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    date: "2024-01-03",
    balance: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    date: "2024-01-04",
    balance: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    date: "2024-01-05",
    balance: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    date: "2024-01-06",
    balance: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    date: "2024-01-07",
    balance: 3490,
    pv: 4300,
    amt: 2100,
  },
];

interface Props {
  data?: {
    date: string;
    balance: number;
  }[];
}

export default function TokenPriceChart({ data }: Props) {

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data || MOCK_DATA}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#627EEA" stopOpacity={0.7} />
            <stop offset="70%" stopColor="#627EEA" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip contentStyle={{ border: "1px solid #FFF", borderRadius: 8 }} />
        <XAxis dataKey="date" hide={true} />
        <Area
          type="monotone"
          dataKey="balance"
          stroke="#627EEA"
          strokeWidth={3}
          fill="url(#colorBalance)"
          fillOpacity={1}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
