// import MisTurnos from "./MisTurnos"
import { UserResource } from "@clerk/types";
import MisTurnos from "./MisTurnos";

export default function DashboardContent({ user }: { user: UserResource | null | undefined }) {
  const isAdmin = user?.publicMetadata.role === "admin";
  return (
    <div className="mt-5 mb-20 xl:mb-0">
      {isAdmin ? (
        <div className="flex gap-5 lg:flex-row flex-col flex-wrap">
          <MisTurnos />
          <div className="bg-gray-900 rounded-xl p-5 basis-full xl:basis-1/4">
            <h2 className="text-2xl font-bold">🏋️‍♂️ Planificaciones</h2>
            <p className="text-gray-400">Administra tus planificaciones aquí</p>
          </div>
        </div>
      ) : (
        <div className="flex gap-5 xl:flex-row flex-col flex-wrap">
          <MisTurnos />
          <div className="bg-gray-900 rounded-xl p-5 w-full xl:w-[calc(50%-10px)]">
            <h2 className="text-2xl font-bold">🏋️‍♂️ Planificaciones</h2>
            <p className="text-gray-400">Administra tus planificaciones aquí</p>
          </div>
        </div>
      )}
    </div>
  );
}