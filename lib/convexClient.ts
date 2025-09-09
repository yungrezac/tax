// Создаём и экспортируем клиент Convex для прямых вызовов (если потребуется).
// В нашем окружении Convex провайдер зарегистрирован глобально, но клиент удобно иметь при необходимости.
import { ConvexReactClient } from "convex/react";

// Конфигурируйте CONVEX_URL через env при необходимости. Для Expo обычно используется process.env.CONVEX_URL
const CONVEX_URL = (process.env.CONVEX_URL as string) || 'https://your-convex-app.convex.cloud';

// Экспортируем singleton клиент для использования в React
export const convexClient = new ConvexReactClient(CONVEX_URL);

export default convexClient;
