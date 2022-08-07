import { useLoaderData } from "@remix-run/react";
import { LoaderFunction, Response } from "@remix-run/node";
import { getItemById, Item } from "~/models/item.server";
import invariant from "tiny-invariant";
import { requireUserId } from "~/session.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.itemId, "item id not provided");
  const item = await getItemById(params.itemId);
  const userId = await requireUserId(request);
  if (!item) throw new Response("item not found", { status: 404 });
  if (item.userId !== userId)
    throw new Response("you don't have access to this item", { status: 403 });
  return item;
};

export default function ItemDetails() {
  const item = useLoaderData() as unknown as Item;
  return (
    <main className="border">
      <h1>{item.title}</h1>
    </main>
  );
}
