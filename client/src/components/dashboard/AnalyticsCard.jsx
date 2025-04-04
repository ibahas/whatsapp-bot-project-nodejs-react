import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function AnalyticsCard({ data }) {
  const options = {
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: ["#3B82F6", "#10B981", "#F59E0B"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" },
    xaxis: {
      categories: data.dates,
      labels: { style: { colors: "#6B7280" } },
    },
    yaxis: { labels: { style: { colors: "#6B7280" } } },
    tooltip: {
      theme: "dark",
      x: { format: "dd/MM/yy" },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      labels: { colors: "#6B7280" },
    },
  };

  const series = [
    { name: "Messages Sent", data: data.sent },
    { name: "Messages Read", data: data.read },
    { name: "Replies", data: data.replies },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Message Analytics
      </h3>
      <Chart options={options} series={series} type="area" height={350} />
      <div className="mt-4 grid grid-cols-3 gap-4">
        <StatCard
          title="Response Rate"
          value={`${data.responseRate}%`}
          change={data.responseRateChange}
        />
        <StatCard
          title="Avg. Reply Time"
          value={data.avgReplyTime}
          change={data.replyTimeChange}
        />
        <StatCard
          title="Engagement"
          value={`${data.engagementScore}/10`}
          change={data.engagementChange}
        />
      </div>
    </div>
  );
}
