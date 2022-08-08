import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import LevelsSidebar from "~/components/LevelsSidebar";
import { getUserLevels } from "~/models/level.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  levels: Awaited<ReturnType<typeof getUserLevels>>;
  active: string;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  console.log("SERVER ACTIVE: ", params.levelId);
  return json<LoaderData>({
    levels: await getUserLevels(await requireUserId(request)),
    active: params.levelId ?? "",
  });
};

// This component shares a layout but doesn't appear in the url!
export default function Levels() {
  const { levels, active } = useLoaderData() as unknown as LoaderData;
  console.log("CLIENT ACTIVE: ", active);
  return (
    <main className="Levels">
      <LevelsSidebar levels={levels} active={active} />
      <Outlet />
    </main>
  );
}
