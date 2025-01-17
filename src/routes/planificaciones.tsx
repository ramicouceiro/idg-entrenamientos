import { useUser } from '@clerk/clerk-react'
import Layout from '../layouts/Layout';

export default function PlanificacionesPage() {
  const { user } = useUser();

  return (
    <Layout user={user}>
      <main className="bg-gray-800 text-white p-6">
        <h1 className="text-2xl font-bold">👋 Buenos días {user?.firstName}!</h1>
        {/* <DashboardContent user={user} /> */}
      </main>
    </Layout>
  );
}