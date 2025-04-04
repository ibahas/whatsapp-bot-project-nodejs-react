import { Outlet } from 'react-router-dom';
import { DashboardSidebar, StatsOverview, QuickActions } from '../../components/dashboard';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <UserDropdown />
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <MessageComposer />
            </div>
            
            <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
              <RecentChats />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <QuickActions />
            </div>
            
            <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
              <CampaignProgress />
            </div>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
};