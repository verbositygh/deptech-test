import prismaClient from "../prismaClient";

export default defineEventHandler(async (event) => {
  const customers = await prismaClient.user.findMany();
  return customers;
});
