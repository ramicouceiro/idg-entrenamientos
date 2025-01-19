import { SignUp, useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
const API_URL = import.meta.env.VITE_API_URL;

export default function SignUpPage() {
  const { user } = useUser();

  // Efecto para guardar los datos del usuario en la base de datos después del registro
  useEffect(() => {
    if (user) {
      const clerkUserId: string = user.id; // ID único de Clerk
      const firstName: string | null = user.firstName;
      const lastName: string | null = user.lastName;

      // Llamar a la función para guardar en la base de datos
      saveToDatabase(clerkUserId, firstName, lastName);
    }
  }, [user]);

  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center bg-cover'>
      <SignUp path="/sign-up" />
    </div>
  );
}

// Función para guardar los datos en la base de datos
async function saveToDatabase(clerkUserId: string, firstName: string | null, lastName: string | null): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/api/user/addUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clerkUserId,
        firstName,
        lastName,
      }),
    });

    if (!response.ok) {
      throw new Error("Error saving user to database");
    }

    const data = await response.json();
    console.log("User saved:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// function saveToDatabase(a:string,b:string|null,c:string|null){
//   console.log('Saving to database');
//   console.log(a,b,c)
// }
