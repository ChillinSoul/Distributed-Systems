// server/middleware/cors.ts
export default defineEventHandler((event) => {
    const headers = event.node.res.getHeaders();
  
    headers['Access-Control-Allow-Origin'] = '*';
    headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
  
    if (event.node.req.method === 'OPTIONS') {
      event.node.res.statusCode = 204;
      return '';
    }
  });
  