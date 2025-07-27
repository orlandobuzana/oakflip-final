// User analytics and tracking system
export interface UserSession {
  sessionId: string;
  userId?: string;
  ipAddress: string;
  userAgent: string;
  country: string;
  language: string;
  createdAt: Date;
  lastActivity: Date;
  pageViews: PageView[];
  cartEvents: CartEvent[];
  conversionEvents: ConversionEvent[];
}

export interface PageView {
  path: string;
  timestamp: Date;
  referrer?: string;
  timeOnPage?: number;
}

export interface CartEvent {
  type: 'add' | 'remove' | 'update' | 'clear' | 'checkout_start';
  productId?: string;
  quantity?: number;
  timestamp: Date;
  value?: number;
}

export interface ConversionEvent {
  type: 'purchase' | 'signup' | 'newsletter' | 'contact';
  orderId?: string;
  value?: number;
  timestamp: Date;
}

// In-memory analytics storage (in production, use Redis or database)
const userSessions = new Map<string, UserSession>();
const dailyStats = new Map<string, DailyStats>();

export interface DailyStats {
  date: string;
  uniqueVisitors: number;
  pageViews: number;
  cartAdditions: number;
  checkouts: number;
  conversions: number;
  revenue: number;
  topPages: { path: string; views: number }[];
  topProducts: { productId: string; additions: number }[];
}

// IP to country detection (simplified - in production use GeoIP service)
const IP_TO_COUNTRY: Record<string, string> = {
  '127.0.0.1': 'US', // localhost
  '::1': 'US', // localhost IPv6
};

// Country to language mapping
const COUNTRY_TO_LANGUAGE: Record<string, string> = {
  'BR': 'pt',
  'ES': 'es',
  'MX': 'es',
  'AR': 'es',
  'FR': 'fr',
  'CN': 'zh',
  'TW': 'zh',
  'HK': 'zh',
  'US': 'en',
  'GB': 'en',
  'CA': 'en',
  'AU': 'en',
};

export function getCountryFromIP(ip: string): string {
  // In production, use a GeoIP service like MaxMind
  return IP_TO_COUNTRY[ip] || 'US';
}

export function getLanguageFromCountry(country: string): string {
  return COUNTRY_TO_LANGUAGE[country] || 'en';
}

export function createUserSession(
  sessionId: string,
  ipAddress: string,
  userAgent: string,
  userId?: string
): UserSession {
  const country = getCountryFromIP(ipAddress);
  const language = getLanguageFromCountry(country);
  
  const session: UserSession = {
    sessionId,
    userId,
    ipAddress,
    userAgent,
    country,
    language,
    createdAt: new Date(),
    lastActivity: new Date(),
    pageViews: [],
    cartEvents: [],
    conversionEvents: []
  };
  
  userSessions.set(sessionId, session);
  updateDailyStats(new Date().toISOString().split('T')[0], 'unique_visitor');
  
  return session;
}

export function trackPageView(
  sessionId: string,
  path: string,
  referrer?: string
): void {
  const session = userSessions.get(sessionId);
  if (!session) return;
  
  // Update previous page time on page
  if (session.pageViews.length > 0) {
    const lastView = session.pageViews[session.pageViews.length - 1];
    if (!lastView.timeOnPage) {
      lastView.timeOnPage = Date.now() - lastView.timestamp.getTime();
    }
  }
  
  session.pageViews.push({
    path,
    timestamp: new Date(),
    referrer
  });
  
  session.lastActivity = new Date();
  updateDailyStats(new Date().toISOString().split('T')[0], 'page_view', { path });
}

export function trackCartEvent(
  sessionId: string,
  type: CartEvent['type'],
  productId?: string,
  quantity?: number,
  value?: number
): void {
  const session = userSessions.get(sessionId);
  if (!session) return;
  
  session.cartEvents.push({
    type,
    productId,
    quantity,
    timestamp: new Date(),
    value
  });
  
  session.lastActivity = new Date();
  
  const dateKey = new Date().toISOString().split('T')[0];
  if (type === 'add') {
    updateDailyStats(dateKey, 'cart_addition', { productId });
  } else if (type === 'checkout_start') {
    updateDailyStats(dateKey, 'checkout');
  }
}

export function trackConversion(
  sessionId: string,
  type: ConversionEvent['type'],
  orderId?: string,
  value?: number
): void {
  const session = userSessions.get(sessionId);
  if (!session) return;
  
  session.conversionEvents.push({
    type,
    orderId,
    value,
    timestamp: new Date()
  });
  
  session.lastActivity = new Date();
  
  const dateKey = new Date().toISOString().split('T')[0];
  updateDailyStats(dateKey, 'conversion', { value: value || 0 });
}

function updateDailyStats(
  date: string,
  metric: 'unique_visitor' | 'page_view' | 'cart_addition' | 'checkout' | 'conversion',
  data?: { path?: string; productId?: string; value?: number }
): void {
  let stats = dailyStats.get(date);
  if (!stats) {
    stats = {
      date,
      uniqueVisitors: 0,
      pageViews: 0,
      cartAdditions: 0,
      checkouts: 0,
      conversions: 0,
      revenue: 0,
      topPages: [],
      topProducts: []
    };
    dailyStats.set(date, stats);
  }
  
  switch (metric) {
    case 'unique_visitor':
      stats.uniqueVisitors++;
      break;
    case 'page_view':
      stats.pageViews++;
      if (data?.path) {
        const pageIndex = stats.topPages.findIndex(p => p.path === data.path);
        if (pageIndex >= 0) {
          stats.topPages[pageIndex].views++;
        } else {
          stats.topPages.push({ path: data.path, views: 1 });
        }
        stats.topPages.sort((a, b) => b.views - a.views);
        stats.topPages = stats.topPages.slice(0, 10);
      }
      break;
    case 'cart_addition':
      stats.cartAdditions++;
      if (data?.productId) {
        const productIndex = stats.topProducts.findIndex(p => p.productId === data.productId);
        if (productIndex >= 0) {
          stats.topProducts[productIndex].additions++;
        } else {
          stats.topProducts.push({ productId: data.productId, additions: 1 });
        }
        stats.topProducts.sort((a, b) => b.additions - a.additions);
        stats.topProducts = stats.topProducts.slice(0, 10);
      }
      break;
    case 'checkout':
      stats.checkouts++;
      break;
    case 'conversion':
      stats.conversions++;
      if (data?.value) {
        stats.revenue += data.value;
      }
      break;
  }
}

export function getUserSession(sessionId: string): UserSession | undefined {
  return userSessions.get(sessionId);
}

export function getDailyStats(date: string): DailyStats | undefined {
  return dailyStats.get(date);
}

export function getAnalyticsSummary(days: number = 7): {
  totalSessions: number;
  totalPageViews: number;
  totalRevenue: number;
  conversionRate: number;
  averageOrderValue: number;
  topCountries: { country: string; sessions: number }[];
  topLanguages: { language: string; sessions: number }[];
} {
  const sessions = Array.from(userSessions.values());
  const totalSessions = sessions.length;
  const totalPageViews = sessions.reduce((sum, s) => sum + s.pageViews.length, 0);
  const conversions = sessions.filter(s => s.conversionEvents.length > 0);
  const totalRevenue = conversions.reduce((sum, s) => 
    sum + s.conversionEvents.reduce((sum2, e) => sum2 + (e.value || 0), 0), 0
  );
  
  const conversionRate = totalSessions > 0 ? (conversions.length / totalSessions) * 100 : 0;
  const averageOrderValue = conversions.length > 0 ? totalRevenue / conversions.length : 0;
  
  // Count by country and language
  const countryCount = new Map<string, number>();
  const languageCount = new Map<string, number>();
  
  sessions.forEach(session => {
    countryCount.set(session.country, (countryCount.get(session.country) || 0) + 1);
    languageCount.set(session.language, (languageCount.get(session.language) || 0) + 1);
  });
  
  const topCountries = Array.from(countryCount.entries())
    .map(([country, sessions]) => ({ country, sessions }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 5);
    
  const topLanguages = Array.from(languageCount.entries())
    .map(([language, sessions]) => ({ language, sessions }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 5);
  
  return {
    totalSessions,
    totalPageViews,
    totalRevenue,
    conversionRate,
    averageOrderValue,
    topCountries,
    topLanguages
  };
}