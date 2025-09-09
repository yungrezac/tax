import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

// Настройка Convex Auth с Password provider (email + password).
// Экспортируем хелперы: signIn/signOut/store/isAuthenticated — будут доступны для использования в других функциях при необходимости.
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
});
