import { useUser } from "@clerk/clerk-react";
import Layout from "../layouts/Layout";
import Turnos from "../components/Turnos";

export default function TurnosPage(){
    const { user } = useUser();
    return(
        <Layout user={user}>
            <main className="bg-gray-800 text-white w-full mb-20 xl:mb-0">
                <h1 className="text-2xl font-bold">👋 Buenos días {user?.firstName}!</h1>
                <Turnos/>
            </main>
        </Layout>
    );
}    
