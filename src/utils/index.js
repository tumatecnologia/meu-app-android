export function createPageUrl(pageName) {
  const routes = {
    'DailyCard': '/daily-card',
    'ThreeCardsReading': '/three-cards-reading',
    'ReadingHistory': '/reading-history'
  };
  
  return routes[pageName] || `/${pageName.toLowerCase().replace(/\s+/g, '-')}`;
}

export function formatPrice(price) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
}
