import prismaClient from "../prismaClient";

export default defineEventHandler(async (event) => {
  const cats = await prismaClient.category.findMany({include: {items: {include: {transactions: {include: {transaction: true}}}}}});
  return cats;
});
