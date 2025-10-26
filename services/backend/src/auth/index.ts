// services/backend/src/auth/index.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:5432',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-key'
);

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Extend FastifyRequest to include user
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      role: string;
      organization_id: string;
    };
  }
}

// Authentication middleware
export async function authMiddleware(fastify: FastifyInstance) {
  fastify.decorateRequest('user', null);

  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    // Skip auth for public routes
    const publicRoutes = [
      '/api/health',
      '/api/auth/login',
      '/api/auth/register',
      '/api/qa',  // Keep legacy route public for now
      '/api/ingest',  // Keep legacy route public for now
    ];

    // Check if route starts with any public route
    if (publicRoutes.some(route => request.url.startsWith(route))) {
      return;
    }

    try {
      // Get token from Authorization header
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // For development, allow requests without token
        if (process.env.NODE_ENV === 'development') {
          fastify.log.warn('No authorization header, using mock user for development');
          request.user = {
            id: '770e8400-e29b-41d4-a716-446655440000',
            email: 'admin@forever-tech.com',
            role: 'admin',
            organization_id: '550e8400-e29b-41d4-a716-446655440000'
          };
          return;
        }

        return reply.status(401).send({ error: 'Missing or invalid authorization header' });
      }

      const token = authHeader.substring(7);

      // Verify JWT
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      // Mock user data (until Supabase is connected)
      request.user = {
        id: decoded.sub || '770e8400-e29b-41d4-a716-446655440000',
        email: decoded.email || 'admin@forever-tech.com',
        role: decoded.role || 'admin',
        organization_id: decoded.organization_id || '550e8400-e29b-41d4-a716-446655440000'
      };

    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        // For development, allow invalid tokens
        if (process.env.NODE_ENV === 'development') {
          fastify.log.warn('Invalid token, using mock user for development');
          request.user = {
            id: '770e8400-e29b-41d4-a716-446655440000',
            email: 'admin@forever-tech.com',
            role: 'admin',
            organization_id: '550e8400-e29b-41d4-a716-446655440000'
          };
          return;
        }
        return reply.status(401).send({ error: 'Invalid token' });
      }
      if (error instanceof jwt.TokenExpiredError) {
        return reply.status(401).send({ error: 'Token expired' });
      }
      throw error;
    }
  });
}

// Auth routes
export async function authRoutes(fastify: FastifyInstance) {

  // POST /api/v1/auth/register - Register new user
  fastify.post('/register', async (request, reply) => {
    const { email, password, name } = request.body as any;

    try {
      fastify.log.info(`Registering new user: ${email}`);

      // Hash password
      const password_hash = await bcrypt.hash(password, 10);

      // Mock user creation
      const userId = `user_${Date.now()}`;

      // Generate JWT
      const token = jwt.sign(
        {
          sub: userId,
          email,
          role: 'user',
          organization_id: '550e8400-e29b-41d4-a716-446655440000'
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        user: {
          id: userId,
          email,
          name,
          role: 'user'
        },
        token
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(400).send({ error: 'Registration failed' });
    }
  });

  // POST /api/v1/auth/login - Login user
  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body as any;

    try {
      fastify.log.info(`Login attempt for: ${email}`);

      // Mock authentication (always succeed for development)
      const userId = '770e8400-e29b-41d4-a716-446655440000';

      // Generate JWT
      const token = jwt.sign(
        {
          sub: userId,
          email,
          role: 'admin',
          organization_id: '550e8400-e29b-41d4-a716-446655440000'
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        user: {
          id: userId,
          email,
          name: 'Admin User',
          role: 'admin',
          organization_id: '550e8400-e29b-41d4-a716-446655440000'
        },
        token
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(401).send({ error: 'Invalid credentials' });
    }
  });

  // GET /api/v1/auth/me - Get current user
  fastify.get('/me', async (request, reply) => {
    return { user: request.user };
  });

  // POST /api/v1/auth/logout - Logout user
  fastify.post('/logout', async (request, reply) => {
    // For JWT, logout is client-side (remove token)
    return { success: true, message: 'Logged out successfully' };
  });

  // POST /api/v1/auth/refresh - Refresh token
  fastify.post('/refresh', async (request, reply) => {
    const { token: oldToken } = request.body as any;

    try {
      // Verify old token
      const decoded = jwt.verify(oldToken, JWT_SECRET) as any;

      // Generate new token
      const newToken = jwt.sign(
        {
          sub: decoded.sub,
          email: decoded.email,
          role: decoded.role,
          organization_id: decoded.organization_id
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return { token: newToken };
    } catch (error) {
      return reply.status(401).send({ error: 'Invalid or expired token' });
    }
  });
}
