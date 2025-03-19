import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function App() {
  // Limpio el localStorage al iniciar la app turnos-storage planificaciones-storage
  
  return (
    <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}