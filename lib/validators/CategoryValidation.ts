import { Prisma } from "@prisma/client";
import { z } from "zod";

export default z.object({
  id: z.undefined(),
  name: z.string(),
  description: z.string(),
}) satisfies z.Schema<Prisma.CategoryUncheckedCreateInput>;

