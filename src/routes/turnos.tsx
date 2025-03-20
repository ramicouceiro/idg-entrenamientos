import { useUser } from "@clerk/clerk-react";
import Layout from "../layouts/Layout";
import Turnos from "../components/Turnos";

export default function TurnosPage(){
    const { user } = useUser();
    return(
        <Layout user={user} loading={false}>
            <Turnos/>
        </Layout>
    );
}    
