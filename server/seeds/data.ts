import { UserRole } from "../src/entities/User";

type UserSeedDataT = {
  name: string;
  email: string;
  passwordInput: string;
  contactNum: string;
  imageURL: string;
  role: UserRole;
};

export const ADMIN_SEED_DATA: UserSeedDataT[] = [
  {
    name: "Lay Hoon",
    email: "layhoon@test.com",
    passwordInput: "1234",
    contactNum: "+6512345678",
    imageURL: "LayHoonProfile.png",
    role: UserRole.STAFF,
  },
  {
    name: "Alex",
    email: "alex@test.com",
    passwordInput: "1234",
    contactNum: "+6512345678",
    imageURL: "AlexProfile.png",
    role: UserRole.STAFF,
  },
  {
    name: "Siew May",
    email: "siumei@test.com",
    passwordInput: "1234",
    contactNum: "+6512345678",
    imageURL: "SiewMayProfile.png",
    role: UserRole.STAFF,
  },
  {
    name: "Aaron",
    email: "aaron@test.com",
    passwordInput: "1234",
    contactNum: "+6512345678",
    imageURL: "AaronProfile.jpg",
    role: UserRole.ADMIN,
  },
];

export const EVENT_TYPE_SEED_DATA = [
  {
    name: "Electronic Waste",
  },
  {
    name: "Food Waste",
  },
  {
    name: "Book Donation",
  },
  {
    name: "Clothing Waste",
  },
];

export const ITEM_SEED_DATA = [
  {
    name: "Laptop",
    unit: "unit",
    eventType: "Electronic Waste",
  },
  {
    name: "iPad",
    unit: "unit",
    eventType: "Electronic Waste",
  },
  {
    name: "iPhone 12",
    unit: "unit",
    eventType: "Electronic Waste",
  },
  {
    name: "Bok Choy",
    unit: "gram",
    eventType: "Food Waste",
  },
  {
    name: "Eggs",
    unit: "unit",
    eventType: "Food Waste",
  },
  {
    name: "Rice",
    unit: "gram",
    eventType: "Food Waste",
  },
  {
    name: "Bread",
    unit: "slice",
    eventType: "Food Waste",
  },
  {
    name: "Mobile Phone",
    unit: "unit",
    eventType: "Electronic Waste",
  },
  {
    name: "Old Newspaper",
    unit: "unit",
    eventType: "Book Donation",
  },
  {
    name: "Old Magazines",
    unit: "unit",
    eventType: "Book Donation",
  },
  {
    name: "Old Books",
    unit: "unit",
    eventType: "Book Donation",
  },
  {
    name: "Old Comics",
    unit: "unit",
    eventType: "Book Donation",
  },
  {
    name: "Children's Clothing",
    unit: "unit",
    eventType: "Clothing Waste",
  },
  {
    name: "Young Adult Clothing",
    unit: "unit",
    eventType: "Clothing Waste",
  },
];

export const DONATION_EVENT_SEED_DATA = [
  {
    name: "From Shelf to Heart",
    imageId: "BookPoster.jpeg",
    user: "Aaron",
    eventType: "Book Donation",
    startDate: new Date("2024-01-14"),
    endDate: new Date("2024-01-20"),
    donationEventItems: [
      {
        name: "Old Books",
        targetQty: 50,
        minQty: 5,
        pointsPerUnit: 10,
      },
      {
        name: "Old Comics",
        targetQty: 80,
        minQty: 10,
        pointsPerUnit: 5,
      },
    ],
  },
  {
    name: "Gadgets for Cash",
    imageId: "ElectronicsPoster.jpg",
    user: "Alex",
    eventType: "Electronic Waste",
    startDate: new Date("2024-01-25"),
    endDate: new Date("2024-01-29"),
    donationEventItems: [
      {
        name: "iPad",
        targetQty: 20,
        minQty: 1,
        pointsPerUnit: 50,
      },
      {
        name: "Laptop",
        targetQty: 10,
        minQty: 1,
        pointsPerUnit: 100,
      },
    ],
  },
  {
    name: "Clothes Upcycling",
    imageId: "ClothesPoster.jpeg",
    user: "Alex",
    eventType: "Clothing Waste",
    startDate: new Date("2024-02-25"),
    endDate: new Date("2024-02-29"),
    donationEventItems: [
      {
        name: "Children's Clothing",
        targetQty: 200,
        minQty: 5,
        pointsPerUnit: 10,
      },
      {
        name: "Young Adult Clothing",
        targetQty: 100,
        minQty: 10,
        pointsPerUnit: 20,
      },
    ],
  },
  {
    name: "Harvest for Hope: Food Donation Drive",
    imageId: "FoodProducePoster.jpg",
    user: "Siew May",
    eventType: "Food Waste",
    startDate: new Date("2024-02-25"),
    endDate: new Date("2024-03-25"),
    donationEventItems: [
      {
        name: "Bok Choy",
        targetQty: 100000,
        minQty: 500,
        pointsPerUnit: 5,
      },
      {
        name: "Bread",
        targetQty: 1000,
        minQty: 10,
        pointsPerUnit: 5,
      },
      {
        name: "Rice",
        targetQty: 100000,
        minQty: 500,
        pointsPerUnit: 15,
      },
      {
        name: "Eggs",
        targetQty: 1000,
        minQty: 10,
        pointsPerUnit: 5,
      },
    ],
  },
  {
    name: "Do good with electronics",
    imageId: "ElectronicsPoster.jpg",
    user: "Aaron",
    eventType: "Electronic Waste",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-04-30"),
    donationEventItems: [
      {
        name: "Laptop",
        targetQty: 10,
        minQty: 1,
        pointsPerUnit: 1500,
      },
      {
        name: "iPhone 12",
        targetQty: 15,
        minQty: 1,
        pointsPerUnit: 5000,
      },
    ],
  },
  {
    name: "Reshelf and Reuse: Book Recycling Initiative",
    imageId: "BookPoster.jpeg",
    user: "Aaron",
    eventType: "Book Donation",
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-03-30"),
    donationEventItems: [
      {
        name: "Old Newspaper",
        targetQty: 500,
        minQty: 10,
        pointsPerUnit: 20,
      },
      {
        name: "Old Books",
        targetQty: 300,
        minQty: 5,
        pointsPerUnit: 30,
      },
      {
        name: "Old Magazines",
        targetQty: 300,
        minQty: 5,
        pointsPerUnit: 30,
      },
    ],
  },
];
