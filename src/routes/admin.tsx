import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import TotalRevenueCard from "../components/TotalRevenueCard";
import { UserTable } from "../components/UserTable";

interface User {
    id: number;
    clerk_user_id: string;
    first_name: string;
    last_name: string;
}


export default function AdminPage() {
    const { user } = useUser();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const isAdmin = user?.publicMetadata.role === "admin";
    
    useEffect(() => {
        if (isAdmin) {
            setIsLoading(true);
            getUserList()
            .then((userList) => {
                    setUsers(userList);
                })
                .finally(() => setIsLoading(false));
            }
        }, [isAdmin]);
        
        return isAdmin ? (
            <main className="w-screen h-screen flex flex-col p-5 gap-4">
                <h1>Administración 3T Pucara</h1>
                <div className="flex w-1/4">
                    <TotalRevenueCard/>
                </div>
                <div className="flex gap-4">
                    <UserTable title="Pagaron" users={users} isLoading={isLoading} />
                    <UserTable title="No pagaron" users={users} isLoading={isLoading} />
                </div>
            </main>
    ) : (
        <h1>No tienes permisos de administrador</h1>
    );
}

async function getUserList(): Promise<User[]> {
    try {
        const response = await fetch("http://localhost:3000/api/getUsers", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Error getting users from database");
        }
        const data = await response.json();
        return data as User[];
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}