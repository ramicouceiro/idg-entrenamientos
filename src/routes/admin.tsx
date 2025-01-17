// interface User {
//     id: number;
//     clerk_user_id: string;
//     first_name: string;
//     last_name: string;
// }


export default function AdminPage() {
    return(
        <h1>No tienes permisos de administrador</h1>
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