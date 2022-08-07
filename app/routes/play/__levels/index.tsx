import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { ActionArgs, json, LoaderFunction, redirect } from "@remix-run/node";
import { createLevel } from "~/models/level.server";
import { requireUser, requireUserId } from "~/session.server";
import {
  countUserItems,
  getUserCurrentLevel,
  getUserNextLevelNumber,
  totalUserItemsCost,
  totalUserWastedCost,
} from "~/models/user.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  return json({
    user,
    currentLevel: await getUserCurrentLevel(user.id),
    itemsCount: await countUserItems(user.id),
    totalCost: await totalUserItemsCost(user.id),
    totalWasted: await totalUserWastedCost(user.id),
  });
};

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  const level = await createLevel({
    userId,
    number: await getUserNextLevelNumber(userId),
    note: "",
  });
  return redirect(`/play/${level.id}`);
}

export default function LevelsIndex() {
  const actionData = useActionData<typeof action>();
  const { user, currentLevel, itemsCount, totalCost, totalWasted } =
    useLoaderData<typeof loader>();
  return (
    <main className="LevelsIndex">
      <h1>Welcome Back {user.email}!</h1>
      <p>Please seelect a level to show the details or Create a new one</p>
      <p>
        Your level is {currentLevel} and you've bought {itemsCount} items which
        cost ${totalCost}. You've wasted ${totalWasted}.
      </p>
      <Form method="post" className="flex justify-end">
        <button
          type="submit"
          className="rounded bg-orange-400 px-8 py-2 text-white shadow"
        >
          Start Next Level
        </button>
      </Form>
    </main>
  );
}
