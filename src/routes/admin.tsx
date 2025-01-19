// interface User {
//     id: number;
//     clerk_user_id: string;
//     first_name: string;
//     last_name: string;
// }

import { useUser } from "@clerk/clerk-react";
import Layout from "../layouts/Layout";
import { Link, Outlet } from "react-router-dom";

export default function AdminPage() {
    const { user } = useUser();
    const isAdmin = user?.publicMetadata.role === "admin";

    return (
        <Layout user={user}>
            {isAdmin ? (
                <div className="bg-gray-800 text-white p-6 w-full">
                    <h1 className="text-2xl font-bold mb-5">👋 Buenos días {user?.firstName}!</h1>
                    <div className="bg-gray-900 rounded-xl p-5 w-full">
                        <h2 className="text-2xl font-bold">🏋️‍♂️ Admin</h2>
                        <p className="text-gray-400">Administra la app aquí</p>
                        <Link to="/admin/horarios">
                            <div className="bg-gray-800 rounded-xl p-5 mt-5 flex text-white justify-between cursor-pointer">
                                <h3 className="text-xl font-bold">Horarios</h3>
                            </div>
                        </Link>
                        <Link to="/admin/disciplinas">
                            <div className="bg-gray-800 rounded-xl p-5 mt-5 flex text-white justify-between cursor-pointer">
                                <h3 className="text-xl font-bold">Disciplinas</h3>
                            </div>
                        </Link>
                    </div>

                    {/* 🔥 Aquí se renderizarán las subrutas como /admin/horarios */}
                    <Outlet />
                </div>
            ) : (
                <h1>Acceso denegado</h1>
            )}
        </Layout>
    );
}


// async function getUserList(): Promise<User[]> {
//     try {
//         const response = await fetch("http://localhost:3000/api/getUsers", {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });

//         if (!response.ok) {
//             throw new Error("Error getting users from database");
//         }
//         const data = await response.json();
//         return data as User[];
//     } catch (error) {
//         console.error("Error:", error);
//         return [];
//     }
// }