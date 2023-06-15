import { Prisma } from "@prisma/client";
import { z } from "zod";

export default z.object({
  id: z.undefined(),
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  email: z.string().email(),
  dateOfBirth: z.string().datetime(),
  plainPassword: z.string(),
}) satisfies z.Schema<Prisma.UserUncheckedCreateInput>;

