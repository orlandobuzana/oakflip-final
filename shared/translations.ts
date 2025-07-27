// Multi-language translation system
export interface Translation {
  [key: string]: string | Translation;
}

export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
];

export const translations: Record<string, Translation> = {
  en: {
    // Navigation
    home: 'Home',
    products: 'Products',
    cart: 'Cart',
    checkout: 'Checkout',
    admin: 'Admin',
    
    // Home page
    'home.hero.title': 'Discover Amazing Products',
    'home.hero.subtitle': 'Shop the latest trends with confidence and style',
    
    // Common actions
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    continue: 'Continue',
    submit: 'Submit',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    
    // Product page
    addToCart: 'Add to Cart',
    outOfStock: 'Out of Stock',
    price: 'Price',
    description: 'Description',
    category: 'Category',
    features: 'Features',
    reviews: 'Reviews',
    
    // Cart
    cartEmpty: 'Your cart is empty',
    cartTotal: 'Cart Total',
    quantity: 'Quantity',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    tax: 'Tax',
    total: 'Total',
    
    // Checkout
    shippingInfo: 'Shipping Information',
    paymentInfo: 'Payment Information',
    orderReview: 'Order Review',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    city: 'City',
    state: 'State',
    zipCode: 'ZIP Code',
    country: 'Country',
    shippingMethod: 'Shipping Method',
    paymentMethod: 'Payment Method',
    placeOrder: 'Place Order',
    
    // Order status
    orderPlaced: 'Order Placed Successfully!',
    orderProcessing: 'Your order is being processed',
    orderShipped: 'Your order has been shipped',
    orderDelivered: 'Your order has been delivered',
    
    // Admin
    dashboard: 'Dashboard',
    analytics: 'Analytics',
    orders: 'Orders',
    categories: 'Categories',
    deals: 'Deals',
    users: 'Users',
    settings: 'Settings',
    
    // Errors
    errorGeneric: 'Something went wrong. Please try again.',
    errorNetwork: 'Network error. Please check your connection.',
    errorValidation: 'Please fill in all required fields.',
    errorOutOfStock: 'This item is out of stock.',
    
    // Success messages
    addedToCart: 'Added to cart successfully!',
    orderComplete: 'Order completed successfully!',
    settingsSaved: 'Settings saved successfully!',
  },
  
  pt: {
    // Navigation
    home: 'Início',
    products: 'Produtos',
    cart: 'Carrinho',
    checkout: 'Finalizar',
    admin: 'Admin',
    
    // Common actions
    add: 'Adicionar',
    edit: 'Editar',
    delete: 'Excluir',
    save: 'Salvar',
    cancel: 'Cancelar',
    continue: 'Continuar',
    submit: 'Enviar',
    search: 'Pesquisar',
    filter: 'Filtrar',
    sort: 'Ordenar',
    
    // Product page
    addToCart: 'Adicionar ao Carrinho',
    outOfStock: 'Fora de Estoque',
    price: 'Preço',
    description: 'Descrição',
    category: 'Categoria',
    features: 'Recursos',
    reviews: 'Avaliações',
    
    // Cart
    cartEmpty: 'Seu carrinho está vazio',
    cartTotal: 'Total do Carrinho',
    quantity: 'Quantidade',
    subtotal: 'Subtotal',
    shipping: 'Frete',
    tax: 'Impostos',
    total: 'Total',
    
    // Checkout
    shippingInfo: 'Informações de Entrega',
    paymentInfo: 'Informações de Pagamento',
    orderReview: 'Revisão do Pedido',
    firstName: 'Nome',
    lastName: 'Sobrenome',
    email: 'E-mail',
    phone: 'Telefone',
    address: 'Endereço',
    city: 'Cidade',
    state: 'Estado',
    zipCode: 'CEP',
    country: 'País',
    shippingMethod: 'Método de Entrega',
    paymentMethod: 'Método de Pagamento',
    placeOrder: 'Finalizar Pedido',
    
    // Order status
    orderPlaced: 'Pedido Realizado com Sucesso!',
    orderProcessing: 'Seu pedido está sendo processado',
    orderShipped: 'Seu pedido foi enviado',
    orderDelivered: 'Seu pedido foi entregue',
    
    // Admin
    dashboard: 'Painel',
    analytics: 'Análises',
    orders: 'Pedidos',
    categories: 'Categorias',
    deals: 'Ofertas',
    users: 'Usuários',
    settings: 'Configurações',
    
    // Errors
    errorGeneric: 'Algo deu errado. Tente novamente.',
    errorNetwork: 'Erro de rede. Verifique sua conexão.',
    errorValidation: 'Preencha todos os campos obrigatórios.',
    errorOutOfStock: 'Este item está fora de estoque.',
    
    // Success messages
    addedToCart: 'Adicionado ao carrinho com sucesso!',
    orderComplete: 'Pedido concluído com sucesso!',
    settingsSaved: 'Configurações salvas com sucesso!',
  },
  
  es: {
    // Navigation
    home: 'Inicio',
    products: 'Productos',
    cart: 'Carrito',
    checkout: 'Finalizar',
    admin: 'Admin',
    
    // Common actions
    add: 'Agregar',
    edit: 'Editar',
    delete: 'Eliminar',
    save: 'Guardar',
    cancel: 'Cancelar',
    continue: 'Continuar',
    submit: 'Enviar',
    search: 'Buscar',
    filter: 'Filtrar',
    sort: 'Ordenar',
    
    // Product page
    addToCart: 'Agregar al Carrito',
    outOfStock: 'Agotado',
    price: 'Precio',
    description: 'Descripción',
    category: 'Categoría',
    features: 'Características',
    reviews: 'Reseñas',
    
    // Cart
    cartEmpty: 'Su carrito está vacío',
    cartTotal: 'Total del Carrito',
    quantity: 'Cantidad',
    subtotal: 'Subtotal',
    shipping: 'Envío',
    tax: 'Impuestos',
    total: 'Total',
    
    // Checkout
    shippingInfo: 'Información de Envío',
    paymentInfo: 'Información de Pago',
    orderReview: 'Revisión del Pedido',
    firstName: 'Nombre',
    lastName: 'Apellido',
    email: 'Correo',
    phone: 'Teléfono',
    address: 'Dirección',
    city: 'Ciudad',
    state: 'Estado',
    zipCode: 'Código Postal',
    country: 'País',
    shippingMethod: 'Método de Envío',
    paymentMethod: 'Método de Pago',
    placeOrder: 'Realizar Pedido',
    
    // Order status
    orderPlaced: '¡Pedido Realizado con Éxito!',
    orderProcessing: 'Su pedido está siendo procesado',
    orderShipped: 'Su pedido ha sido enviado',
    orderDelivered: 'Su pedido ha sido entregado',
    
    // Admin
    dashboard: 'Panel',
    analytics: 'Análisis',
    orders: 'Pedidos',
    categories: 'Categorías',
    deals: 'Ofertas',
    users: 'Usuarios',
    settings: 'Configuración',
    
    // Errors
    errorGeneric: 'Algo salió mal. Inténtelo de nuevo.',
    errorNetwork: 'Error de red. Verifique su conexión.',
    errorValidation: 'Complete todos los campos requeridos.',
    errorOutOfStock: 'Este artículo está agotado.',
    
    // Success messages
    addedToCart: '¡Agregado al carrito exitosamente!',
    orderComplete: '¡Pedido completado exitosamente!',
    settingsSaved: '¡Configuración guardada exitosamente!',
  },
  
  fr: {
    // Navigation
    home: 'Accueil',
    products: 'Produits',
    cart: 'Panier',
    checkout: 'Commander',
    admin: 'Admin',
    
    // Common actions
    add: 'Ajouter',
    edit: 'Modifier',
    delete: 'Supprimer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    continue: 'Continuer',
    submit: 'Soumettre',
    search: 'Rechercher',
    filter: 'Filtrer',
    sort: 'Trier',
    
    // Product page
    addToCart: 'Ajouter au Panier',
    outOfStock: 'Rupture de Stock',
    price: 'Prix',
    description: 'Description',
    category: 'Catégorie',
    features: 'Caractéristiques',
    reviews: 'Avis',
    
    // Cart
    cartEmpty: 'Votre panier est vide',
    cartTotal: 'Total du Panier',
    quantity: 'Quantité',
    subtotal: 'Sous-total',
    shipping: 'Livraison',
    tax: 'Taxes',
    total: 'Total',
    
    // Checkout
    shippingInfo: 'Informations de Livraison',
    paymentInfo: 'Informations de Paiement',
    orderReview: 'Révision de Commande',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'E-mail',
    phone: 'Téléphone',
    address: 'Adresse',
    city: 'Ville',
    state: 'État',
    zipCode: 'Code Postal',
    country: 'Pays',
    shippingMethod: 'Méthode de Livraison',
    paymentMethod: 'Méthode de Paiement',
    placeOrder: 'Passer Commande',
    
    // Order status
    orderPlaced: 'Commande Passée avec Succès!',
    orderProcessing: 'Votre commande est en cours de traitement',
    orderShipped: 'Votre commande a été expédiée',
    orderDelivered: 'Votre commande a été livrée',
    
    // Admin
    dashboard: 'Tableau de Bord',
    analytics: 'Analyses',
    orders: 'Commandes',
    categories: 'Catégories',
    deals: 'Offres',
    users: 'Utilisateurs',
    settings: 'Paramètres',
    
    // Errors
    errorGeneric: 'Quelque chose s\'est mal passé. Veuillez réessayer.',
    errorNetwork: 'Erreur réseau. Vérifiez votre connexion.',
    errorValidation: 'Veuillez remplir tous les champs requis.',
    errorOutOfStock: 'Cet article est en rupture de stock.',
    
    // Success messages
    addedToCart: 'Ajouté au panier avec succès!',
    orderComplete: 'Commande terminée avec succès!',
    settingsSaved: 'Paramètres enregistrés avec succès!',
  },
  
  zh: {
    // Navigation
    home: '首页',
    products: '产品',
    cart: '购物车',
    checkout: '结账',
    admin: '管理',
    
    // Common actions
    add: '添加',
    edit: '编辑',
    delete: '删除',
    save: '保存',
    cancel: '取消',
    continue: '继续',
    submit: '提交',
    search: '搜索',
    filter: '筛选',
    sort: '排序',
    
    // Product page
    addToCart: '加入购物车',
    outOfStock: '缺货',
    price: '价格',
    description: '描述',
    category: '分类',
    features: '特色',
    reviews: '评价',
    
    // Cart
    cartEmpty: '您的购物车为空',
    cartTotal: '购物车总计',
    quantity: '数量',
    subtotal: '小计',
    shipping: '运费',
    tax: '税费',
    total: '总计',
    
    // Checkout
    shippingInfo: '配送信息',
    paymentInfo: '支付信息',
    orderReview: '订单确认',
    firstName: '名',
    lastName: '姓',
    email: '邮箱',
    phone: '电话',
    address: '地址',
    city: '城市',
    state: '省/州',
    zipCode: '邮编',
    country: '国家',
    shippingMethod: '配送方式',
    paymentMethod: '支付方式',
    placeOrder: '下单',
    
    // Order status
    orderPlaced: '订单成功提交！',
    orderProcessing: '您的订单正在处理中',
    orderShipped: '您的订单已发货',
    orderDelivered: '您的订单已送达',
    
    // Admin
    dashboard: '仪表板',
    analytics: '分析',
    orders: '订单',
    categories: '分类',
    deals: '优惠',
    users: '用户',
    settings: '设置',
    
    // Errors
    errorGeneric: '出现错误，请重试。',
    errorNetwork: '网络错误，请检查连接。',
    errorValidation: '请填写所有必填字段。',
    errorOutOfStock: '此商品缺货。',
    
    // Success messages
    addedToCart: '成功加入购物车！',
    orderComplete: '订单完成！',
    settingsSaved: '设置已保存！',
  },
};

export function getTranslation(key: string, language: string = 'en'): string {
  const keys = key.split('.');
  let current: any = translations[language] || translations.en;
  
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      // Fallback to English if key not found
      current = translations.en;
      for (const fallbackKey of keys) {
        if (current && typeof current === 'object' && fallbackKey in current) {
          current = current[fallbackKey];
        } else {
          return key; // Return key if not found in fallback
        }
      }
      break;
    }
  }
  
  return typeof current === 'string' ? current : key;
}

export function t(key: string, language?: string): string {
  return getTranslation(key, language);
}