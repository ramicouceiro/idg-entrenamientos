// interface User {
//     id: number;
//     clerk_user_id: string;
//     first_name: string;
//     last_name: string;
// }

import { useUser } from "@clerk/clerk-react";
import Layout from "../layouts/Layout";


export default function AdminPage() {
    const { user } = useUser();
    return(
        <Layout user={user}>
            <h1>admin page</h1>
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