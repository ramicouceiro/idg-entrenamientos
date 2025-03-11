// import MisTurnos from "./MisTurnos"
import { UserResource } from "@clerk/types";
import MisTurnos from "./MisTurnos";
import MisPlanificaciones from "./MisPlanificaciones";

export default function DashboardContent({ user }: { user: UserResource | null | undefined }) {
  const isAdmin = user?.publicMetadata.role === "admin";
  return (
    <div className="mt-5 mb-20 xl:mb-0">
      {isAdmin ? (
        <div className="flex gap-5 lg:flex-row flex-col flex-wrap">
          <MisTurnos />
          <MisPlanificaciones />
        </div>
      ) : (
        <div className="flex gap-5 xl:flex-row flex-col flex-wrap">
          <MisTurnos />
          <MisPlanificaciones />
        </div>
      )}
    </div>
  );
}