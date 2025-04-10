import { auth } from "@/auth";
import ButtonLogout from "@/components/button-logout";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

async function Page() {
  const session = await auth();
  if (!session) {
    redirect("/cuenta/login");
  }

  console.log(session);

  return (
    <Container>
      <h1 className="text-2xl font-semibold mb-5">Mi cuenta</h1>
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Datos personales</h2>
          <Button size="sm" variant="ghost" className="underline">
            Editar
          </Button>
        </div>
        <div>
          <h3 className="font-semibold text-sm">{session.user?.name}</h3>
          <h3 className="text-sm">{session.user?.email}</h3>
        </div>
        <ButtonLogout>Cerrar sesion</ButtonLogout>
      </div>
    </Container>
  );
}
export default Page;
