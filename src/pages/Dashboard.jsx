import SummaryCards from '../components/SummaryCards';
import RecentActivity from '../components/RecentActivity';
import MinistryChart from '../components/MinistryChart';

export default function Dashboard() {
  return (
    <div className="p-6">
      <SummaryCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MinistryChart />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
