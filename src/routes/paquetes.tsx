import { useUser } from "@clerk/clerk-react"
import Layout from "../layouts/Layout"

export default function PaquetesPage() {
    const { user } = useUser();
    return (
        <Layout user={user} loading={false}>
            <main className="bg-gray-800 text-white p-6 w-full">
                <h1 className="text-2xl font-bold">👋 Buenos días {user?.firstName}!</h1>
            </main>
        </Layout>
    )
}