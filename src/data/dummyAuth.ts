/** Demo credentials until Nest.js auth is wired up. */

export const DUMMY_ADMIN_EMAIL = "admin@energymart.pk";
export const DUMMY_ADMIN_PASSWORD = "admin123";

/** Same password for all demo customer accounts (matches seed customers in `localStore.ts`). */
export const DUMMY_CUSTOMER_PASSWORD = "user123";

export type UserRole = "admin" | "user";

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  city?: string;
}

/** Login rows aligned with `SEED_CUSTOMERS` emails in `localStore.ts`. */
const DUMMY_CUSTOMERS: Omit<AuthUser, "role">[] = [
  { id: 1, email: "ali.khan@example.com", name: "Ali Khan", phone: "03001234567", city: "Lahore" },
  { id: 2, email: "sara.malik@example.com", name: "Sara Malik", phone: "03219876543", city: "Karachi" },
  { id: 3, email: "h.raza@example.com", name: "Hassan Raza", phone: "03335551234", city: "Islamabad" },
  { id: 4, email: "fatima.noor@example.com", name: "Fatima Noor", phone: "03451237890", city: "Faisalabad" },
  { id: 5, email: "omar.s@example.com", name: "Omar Siddiqui", phone: "03114445566", city: "Multan" },
  { id: 6, email: "ayesha.t@example.com", name: "Ayesha Tariq", phone: "03007778899", city: "Rawalpindi" },
  { id: 7, email: "bilal.ahmed@example.com", name: "Bilal Ahmed", phone: "03226667788", city: "Peshawar" },
];

export function validateLogin(
  email: string,
  password: string,
): { ok: true; user: AuthUser } | { ok: false; user: null } {
  const normalized = email.trim().toLowerCase();

  if (
    normalized === DUMMY_ADMIN_EMAIL.toLowerCase() &&
    password === DUMMY_ADMIN_PASSWORD
  ) {
    return {
      ok: true,
      user: {
        id: 1,
        email: DUMMY_ADMIN_EMAIL,
        role: "admin",
        name: "Administrator",
      },
    };
  }

  const row = DUMMY_CUSTOMERS.find((c) => c.email.toLowerCase() === normalized);
  if (row && password === DUMMY_CUSTOMER_PASSWORD) {
    return {
      ok: true,
      user: {
        ...row,
        role: "user",
      },
    };
  }

  return { ok: false, user: null };
}
