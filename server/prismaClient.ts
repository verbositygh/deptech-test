import { PrismaClient } from "@prisma/client";
import UserValidation from "../lib/validators/UserValidation";
import ItemValidation from "../lib/validators/ItemValidation";
import TransactionValidation from "../lib/validators/TransactionValidation";
import CategoryValidation from "../lib/validators/CategoryValidation";

export default new PrismaClient({
  // log: ['query']
}).$extends({
  query: {
    user: {
      create({args, query}) {
        args.data = UserValidation.parse(args.data);
        return query(args);
      },
      update({args, query}) {
        args.data = UserValidation.partial().parse(args.data);
        return query(args);
      },
      updateMany({args, query}) {
        args.data = UserValidation.partial().parse(args.data);
        return query(args);
      },
      upsert({args, query}) {
        args.create = UserValidation.parse(args.create);
        args.update = UserValidation.partial().parse(args.update);
        return query(args);
      },
    },
    category: {
      create({args, query}) {
        args.data = CategoryValidation.parse(args.data);
        return query(args);
      },
      update({args, query}) {
        args.data = CategoryValidation.partial().parse(args.data);
        return query(args);
      },
      updateMany({args, query}) {
        args.data = CategoryValidation.partial().parse(args.data);
        return query(args);
      },
      upsert({args, query}) {
        args.create = CategoryValidation.parse(args.create);
        args.update = CategoryValidation.partial().parse(args.update);
        return query(args);
      },
    },
    item: {
      create({args, query}) {
        args.data = ItemValidation.parse(args.data);
        return query(args);
      },
      update({args, query}) {
        args.data = ItemValidation.partial().parse(args.data);
        return query(args);
      },
      updateMany({args, query}) {
        args.data = ItemValidation.partial().parse(args.data);
        return query(args);
      },
      upsert({args, query}) {
        args.create = ItemValidation.parse(args.create);
        args.update = ItemValidation.partial().parse(args.update);
        return query(args);
      },
    },
    transaction: {
      create({args, query}) {
        args.data = TransactionValidation.parse(args.data);
        return query(args);
      },
      update({args, query}) {
        args.data = TransactionValidation.partial().parse(args.data);
        return query(args);
      },
      updateMany({args, query}) {
        args.data = TransactionValidation.partial().parse(args.data);
        return query(args);
      },
      upsert({args, query}) {
        args.create = TransactionValidation.parse(args.create);
        args.update = TransactionValidation.partial().parse(args.update);
        return query(args);
      },
    },
  }
});
