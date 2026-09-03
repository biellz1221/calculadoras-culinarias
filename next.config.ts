import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // O site inteiro é estático: todo cálculo roda no navegador e não existe
  // nenhuma API route. Ver TD-001 no PRD.
  output: 'export',

  // Sem servidor não há otimização de imagem sob demanda.
  images: { unoptimized: true },

  typedRoutes: true,
};

export default nextConfig;
