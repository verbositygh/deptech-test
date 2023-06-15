import prismaClient from "../prismaClient";

export default defineEventHandler(async (event) => {
  const transactions = await prismaClient.transaction.findMany({include: {items: {include: {item: {include: {category: true}}}}}});
  return transactions;
});
