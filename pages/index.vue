<script setup>
import { faker } from '@faker-js/faker';
import UserValidation from '../lib/validators/UserValidation';
import vueImage from '../lib/dummies/images/vue';
import CategoryValidation from '~/lib/validators/CategoryValidation';
import ItemValidation from '~/lib/validators/ItemValidation';
import TransactionValidation from '~/lib/validators/TransactionValidation';

const actAsCookie = useCookie('actAs');

function actAs(user) {
  console.log(user)
  actAsCookie.value = {
    id: user.id,
    plainPassword: user.plainPassword
  }
}

function stopActAs() {
  actAsCookie.value = {};
}

function getUser(id) {
  return users.value.find(u => u.id === id);
}

const { data: users, refresh: refetchUsers } = useFetch('/api/users');
const { data: categories, refresh: refetchCategories } = useFetch('/api/categories');
const { data: items, refresh: refetchItems } = useFetch('/api/items');
const { data: sales, refresh: refetchSales } = useFetch('/api/sales');

function getItemStock(i) {
  return i.quantity - i.transactions.reduce((acc, curr) => acc + curr.quantity, 0);
}

function getSum(i) {
  return i.reduce((acc, curr) => acc + curr, 0);
}

const Category = ref({
  Name: '',
  Description: '',
});
const Item = ref({
  Name: '',
  Description: '',
  CategoryId: '',
  Quantity: '',
  Image: '',
});
const Sale = ref({
  Quantities: '',
  ItemIds: '',
  Type: '',
});

const basePostFetchOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};
const baseDeleteFetchOptions = {
  method: 'DELETE',
};

// FILL
function handleFillCategoryForm() {
  const randName = faker.string.alpha({casing: 'upper', length: 3});
  Category.value.Name = randName;
  Category.value.Description = `${randName} Description`;
}
function handleFillItemForm() {
  const randName = faker.commerce.productName();
  Item.value.Name = randName;
  Item.value.Description = `${randName} Description`;
  Item.value.CategoryId = 1;
  Item.value.Quantity = faker.number.int({ min: 1, max: 1000 });
  Item.value.Image = faker.image.dataUri();
}

function handleFillSaleForm() {
  Sale.value.Quantities = `${faker.number.int({ min: 1, max: getItemStock(items.value[0]) })}`;
  Sale.value.ItemIds = '1';
  Sale.value.Type = faker.helpers.arrayElement(['in', 'out']);
}

// SUBMISSION
async function handleCategoryFormSubmission() {
  console.log(Category);
  const payload = {
    name: Category.value.Name,
    description: Category.value.Description,
  };
  console.log(payload)
  CategoryValidation.parse(payload);
  await fetch('/api/categories', { ...basePostFetchOptions, body: JSON.stringify(payload) });
  refetchCategories();
}
async function handleItemFormSubmission() {
  const payload = {
    name: Item.value.Name,
    description: Item.value.Description,
    categoryId: Item.value.CategoryId,
    quantity: Item.value.Quantity,
    itemImage: Item.value.Image,
  };
  ItemValidation.parse(payload);
  await fetch('/api/items', { ...basePostFetchOptions, body: JSON.stringify(payload) });
  refetchItems();
}
async function handleSaleFormSubmission() {
  const quantities = Sale.value.Quantities.split(' ');
  const itemIds = Sale.value.ItemIds.split(' ');
  if (quantities.length != itemIds.length || quantities.length > new Set(quantities).size || itemIds.length > new Set(itemIds).size) {
    throw new Error('Inconsistent items');
  }
  const payload = {
    time: new Date().toISOString(),
    items: [],
    type: Sale.value.Type,
  };
  for (let i = 0; i < quantities.length; ++i) {
    payload.items.push({
      id: parseInt(itemIds[i]),
      quantity: parseFloat(quantities[i]),
    });
  }
  TransactionValidation.parse(payload);
  await fetch('/api/sales', { ...basePostFetchOptions, body: JSON.stringify(payload) });
  refetchSales();
}

// DELETE
async function handleUserDeletion(id) {
  await fetch(`/api/users/${id}`, baseDeleteFetchOptions);
  refetchUsers();
  refetchItems();
  refetchSales();
}
async function handleItemDeletion(id) {
  await fetch(`/api/items/${id}`, baseDeleteFetchOptions);
  refetchItems();
  refetchSales();
}
async function handleCategoryDeletion(id) {
  await fetch(`/api/categories/${id}`, baseDeleteFetchOptions);
  refetchItems();
  refetchSales();
  refetchCategories();
}
async function handleSaleDeletion(id) {
  await fetch(`/api/sales/${id}`, baseDeleteFetchOptions);
  refetchItems();
  refetchSales();
}
</script>

<template>
  <div v-if="actAsCookie?.id">
    Logged in as: {{ getUser(actAsCookie.id).firstName }} {{ getUser(actAsCookie.id).lastName }} <button @click="stopActAs">Logout</button>
  </div>
  <div v-else>
    Not logged in
  </div>
  <div>
    <h1>Users</h1>
    <!-- <form> -->
    <!--   <button @click.prevent="handleFillUserForm">Fill with Fake Data</button> -->
    <!--   <div> -->
    <!--     <label for="User.Name">Name</label> -->
    <!--     <input name="User.Name" id="User.Name" v-model="User.Name"> -->
    <!--   </div> -->
    <!--   <button @click.prevent="handleUserFormSubmission">Add</button> -->
    <!-- </form> -->
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Delete?</th>
          <th>Login As?</th>
        </tr>
      </thead>
      <tbody v-for="c in users">
        <tr>
          <td>{{ c.id }}</td>
          <td>{{ c.lastName }}</td>
          <td>{{ c.firstName }}</td>
          <td>{{ c.email }}</td>
          <td v-if="c.id == 1">
            Seeded Data
          </td>
          <td v-else>
            <button @click.prevent="handleUserDeletion(c.id)">Del</button>
          </td>
          <td>
            <button @click.prevent="actAs({ id: c.id, plainPassword: c.plainPassword })">Use</button>
          </td>
        </tr>
      </tbody>
    </table>

    <h1>Categories</h1>
    <form>
      <button @click.prevent="handleFillCategoryForm">Fill with Fake Data</button>
      <div>
        <label for="Category.Name">Name</label>
        <input name="Category.Name" id="Category.Name" v-model="Category.Name">
      </div>
      <div>
        <label for="Category.Description">Description</label>
        <input name="Category.Description" id="Category.Description" v-model="Category.Description">
      </div>
      <button @click.prevent="handleCategoryFormSubmission">Add</button>
    </form>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Delete?</th>
        </tr>
      </thead>
      <tbody v-for="c in categories">
        <tr>
          <td>{{ c.id }}</td>
          <td>{{ c.name }}</td>
          <td>{{ c.description }}</td>
          <td v-if="c.id == 1">
            Seeded Data
          </td>
          <td v-else>
            <button @click.prevent="handleCategoryDeletion(c.id)">Del</button>
          </td>
        </tr>
      </tbody>
    </table>

    <h1>Items</h1>
    <form>
      <button @click.prevent="handleFillItemForm">Fill with Fake Data</button>
      <div>
        <label for="Item.Name">Name</label>
        <input name="Item.Name" id="Item.Name" v-model="Item.Name">
      </div>
      <div>
        <label for="Item.Description">Description</label>
        <input name="Item.Description" id="Item.Description" v-model="Item.Description">
      </div>
      <div>
        <label for="Item.CategoryId">Category ID</label>
        <input name="Item.CategoryId" id="Item.CategoryId" v-model="Item.CategoryId">
      </div>
      <div>
        <label for="Item.Quantity">Quantity</label>
        <input type="number" name="Item.Quantity" id="Item.Quantity" v-model="Item.Quantity">
      </div>
      <div>
        <label for="Item.Image">Item Image (Base64)</label>
        <input name="Item.Image" id="Item.Image" v-model="Item.Image">
      </div>
      <button @click.prevent="handleItemFormSubmission">Add</button>
    </form>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Category</th>
          <th>Stock</th>
          <th>Image</th>
          <th>Delete?</th>
        </tr>
      </thead>
      <tbody v-for="i in items">
        <tr>
          <td>{{ i.id }}</td>
          <td>{{ i.name }}</td>
          <td>{{ i.description }}</td>
          <td>{{ i.category.name }}</td>
          <td>{{ getItemStock(i) }}</td>
          <td><img :src="i.itemImage" alt="Image" style="height: 50px;"></td>
          <td v-if="i.id == 1">
            Seeded Data
          </td>
          <td v-else>
            <button @click.prevent="handleItemDeletion(i.id)">Del</button>
          </td>
        </tr>
      </tbody>
    </table>

    <h1>Transactions</h1>
      <h2>Form</h2>
    <form>
      <button @click.prevent="handleFillSaleForm">Fill with Fake Data</button>
      <div>
        <label for="Sale.Quantities">Quantities (space separated)</label>
        <input name="Sale.Quantities" id="Sale.Quantities" v-model="Sale.Quantities">
      </div>
      <div>
        <label for="Sale.ItemIds">Item IDs (space separated)</label>
        <input name="Sale.ItemIds" id="Sale.ItemIds" v-model="Sale.ItemIds">
      </div>
      <div>
        <label for="Sale.Type">Type</label>
        <select name="Sale.Type" id="Sale.Type">
          <option>in</option>
          <option>out</option>
        </select>
      </div>
      <button @click.prevent="handleSaleFormSubmission">Add</button>
    </form>
    <h2>Table</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Quantity</th>
          <th>Type</th>
          <th>Time</th>
          <th>Item Images</th>
          <th>Delete?</th>
        </tr>
      </thead>
      <tbody v-for="s in sales">
        <tr>
          <td>{{ s.id }}</td>
          <td>{{ s.items.map(i => {
            return `${i.quantity}x of ${i.item.name}`;
          }).join(', ') }}</td>
          <td>{{ s.type }}</td>
          <td>{{ s.time }}</td>
          <td v-for="i in s.items" style="max-width: 100px;">
            <img :src="i.item.itemImage" alt="Item Image" style="height: 50px;">
          </td>
          <td v-if="s.id == 1">
            Seeded Data
          </td>
          <td v-else>
            <button @click.prevent="handleSaleDeletion(s.id)">Del</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
