// import MisTurnos from "./MisTurnos"
import { UserResource } from "@clerk/types";
import MisTurnos from "./MisTurnos";

export default function DashboardContent({ user }: { user: UserResource | null | undefined }) {
  const isAdmin = user?.publicMetadata.role === "admin";
  return (
    <div className="mt-5">
      {!isAdmin ? (
        <div className="grid grid-cols-2 grid-rows-1 gap-5">
          <MisTurnos />
          <div className="bg-gray-900 rounded-xl p-5">
            <h2 className="text-2xl font-bold">🏋️‍♂️ Planificaciones</h2>
            <p className="text-gray-400">Administra tus planificaciones aquí</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 grid-rows-1 gap-5">
          <MisTurnos />
          <div className="bg-gray-900 rounded-xl p-5">
            <h2 className="text-2xl font-bold">🏋️‍♂️ Planificaciones</h2>
            <p className="text-gray-400">Administra tus planificaciones aquí</p>
          </div>
        </div>
      )}
    </div>
  );
}