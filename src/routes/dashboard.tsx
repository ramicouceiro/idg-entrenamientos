import { useUser } from '@clerk/clerk-react'
import DashboardContent from '../components/DashboardContent';
import Layout from '../layouts/Layout';

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <Layout user={user}>
      <main className="bg-gray-800 text-white p-6 w-full">
        <h1 className="text-2xl font-bold">👋 Buenos díass {user?.firstName}!</h1>
        <DashboardContent user={user} />
      </main>
    </Layout>
  );
}