import { Prisma } from "@prisma/client";
import { z } from "zod";

export default z.object({
  id: z.undefined(),
  name: z.string(),
  description: z.string(),
  quantity: z.number().int(),
  itemImage: z.string(),
  categoryId: z.number().int(),
}) satisfies z.Schema<Prisma.ItemUncheckedCreateInput>;

