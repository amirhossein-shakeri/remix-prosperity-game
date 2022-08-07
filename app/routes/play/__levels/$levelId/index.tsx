import { ActionArgs, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { createItem } from "~/models/item.server";
import { requireUserId } from "~/session.server";
import { prisma } from "~/db.server";
import { levelItemsCost, maxLevelCost } from "~/models/level.server";

export async function loader() {
  return null;
}

export async function action({ request, params }: ActionArgs) {
  invariant(params.levelId, "level id is required");
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const title = formData.get("title"); // TODO: couldn't destructure like { title, price } = formData.values() or something?
  const price = formData.get("price");
  const url = formData.get("url");
  const description = formData.get("description");

  const errors = {
    title: title ? null : "Title is required",
    price: price ? null : "Price is required",
  };
  if (Object.values(errors).some((errorMessage) => errorMessage))
    return json(errors);

  invariant(typeof title === "string", "title must be string");
  invariant(typeof price === "string", "price must be string");
  invariant(typeof url === "string", "url must be string");
  invariant(typeof description === "string", "description must be string");

  const level = await prisma.level.findFirstOrThrow({
    where: { userId, id: params.levelId },
  });

  if (
    parseFloat(price) + (await levelItemsCost(level.id)) >
    maxLevelCost(level.number)
  ) {
    return json({
      price: `${title} is too expensive($${price}) to be in level ${
        level.number
      }(max $${maxLevelCost(
        level.number
      )}). Remove some items or add an item up to $${
        maxLevelCost(level.number) - (await levelItemsCost(level.id))
      }`,
    });
  }
  await createItem({
    title,
    price: parseFloat(price),
    levelId: level.id,
    userId,
    url: url ?? "",
    description: description ?? "",
  });

  return redirect(`/play/${params.levelId}`);
}

const inputClassName = `w-full rounded border border-gray-300 px-2 py-1 text-lg text-gray-600`;

export default function LevelIndex() {
  const data = useLoaderData();
  const errors = useActionData<typeof action>();

  const transition = useTransition();
  const isCreating = transition.submission?.formData.get("intent") === "create";
  const isUpdating = transition.submission?.formData.get("intent") === "update";
  const isDeleting = transition.submission?.formData.get("intent") === "delete";

  return (
    <main className="border p-1">
      Level Info; LEVEL INDEX; Create New Item; Select An Item To See Purchases
      And Items of it; Overview?
      <Form method="post">
        <div>
          <label>
            Title*:{" "}
            {errors?.title ? (
              <em className="text-red-600">{errors.title}</em>
            ) : null}
            <input
              type="text"
              name="title"
              className={inputClassName}
              key={data?.item?.title ?? "new"}
              defaultValue={data?.item?.title}
            />
          </label>
        </div>
        <div>
          <label>
            Price*:{" "}
            {errors?.price ? (
              <em className="text-red-600">{errors.price}</em>
            ) : null}
            <input
              type="number"
              name="price"
              className={inputClassName}
              key={data?.item?.price ?? "new"}
              defaultValue={data?.item?.price}
            />
          </label>
        </div>
        <div>
          <label>
            URL:{" "}
            {/* {errors?.url ? (
              <em className="text-red-600">{errors.url}</em>
            ) : null} */}
            <input
              type="text"
              name="url"
              className={inputClassName}
              key={data?.item?.url ?? "new"}
              defaultValue={data?.item?.url}
            />
          </label>
        </div>
        <div>
          <label>
            Description:{" "}
            {/* {errors?.description ? (
              <em className="text-red-600">{errors.description}</em>
            ) : null} */}
            <textarea
              name="description"
              className={inputClassName}
              key={data?.item?.description ?? "new"}
              defaultValue={data?.item?.description}
            />
          </label>
        </div>
        <div>
          <button
            type="submit"
            className="btn btn-primary text-shadow rounded bg-green-500 py-1 px-4 text-white shadow-md"
          >
            {isCreating ? "Creating Item ..." : "Create Item"}
          </button>
        </div>
      </Form>
    </main>
  );
}
