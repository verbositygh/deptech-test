import prismaClient from "../../prismaClient";

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id ?? '');
  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid id',
    });
  }
  try {
    await prismaClient.user.delete({where: {id}});
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'An error occured. Read the data for details.',
      data: e?.issues,
    });
  }
});

