import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import LevelsSidebar from "~/components/LevelsSidebar";
import { getUserLevels } from "~/models/level.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  levels: Awaited<ReturnType<typeof getUserLevels>>;
};

export const loader: LoaderFunction = async ({ request }) =>
  json<LoaderData>({
    levels: await getUserLevels(await requireUserId(request)),
  });

// This component shares a layout but doesn't appear in the url!
export default function Levels() {
  const { levels } = useLoaderData() as unknown as LoaderData;
  return (
    <main className="flex flex-row">
      <LevelsSidebar levels={levels} />
      <Outlet />
    </main>
  );
}
