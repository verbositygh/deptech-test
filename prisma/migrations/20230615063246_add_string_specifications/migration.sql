-- AlterTable
ALTER TABLE `Category` MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Item` MODIFY `description` TEXT NOT NULL,
    MODIFY `itemImage` LONGTEXT NOT NULL;
