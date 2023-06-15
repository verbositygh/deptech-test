import { Prisma } from "@prisma/client";
import { z } from "zod";

export default z.object({
  id: z.undefined(),
  type: z.literal('in').or(z.literal('out')),
  time: z.string().datetime(),
}) satisfies z.Schema<Prisma.TransactionUncheckedCreateInput>;

