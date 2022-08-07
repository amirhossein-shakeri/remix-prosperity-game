import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import ItemsSidebar from "~/components/ItemsSidebar";
import { json } from "@remix-run/node";
import { getLevelItems } from "~/models/item.server";
import invariant from "tiny-invariant";

// export async function loader({ params }: LoaderArgs) {
//   // no additional page for new level
//   // https://github.com/FrontendMasters/remix-fundamentals/blob/main/final/07-multiple-forms/app/routes/posts/admin/%24slug.tsx
//   invariant(params.levelId, "Level ID is required");
//   return json({
//     items: await getItems(params.levelId),
//   });
// }

type LoaderData = {
  items: Awaited<ReturnType<typeof getLevelItems>>;
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.levelId, "Level ID is required");
  return json<LoaderData>({
    items: await getLevelItems(params.levelId),
  });
};

export default function Level() {
  const { items } = useLoaderData<typeof loader>();
  return (
    <main className="flex">
      <ItemsSidebar items={items} />
      <Outlet />
    </main>
  );
}
