import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies, headers } from 'next/headers';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'gym_tracker_super_secure_jwt_secret_key_2026_odinbi';
const key = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = 'gym_auth_token';

export const DEFAULT_ADMIN_EMAIL = 'duyrnt09@gmail.com';
export const DEFAULT_ADMIN_PASS = 'Odinbi@123#';

export interface UserSession {
  userId: string;
  email: string;
  name?: string | null;
  role?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signToken(payload: UserSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(key);
}

export async function verifyToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, key);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string | undefined,
      role: (payload.role as string) || 'MEMBER',
    };
  } catch {
    return null;
  }
}

/**
 * Automatically check and ensure default admin account exists
 */
export async function ensureDefaultAdmin() {
  try {
    const admin = await prisma.user.findUnique({
      where: { email: DEFAULT_ADMIN_EMAIL },
    });

    if (!admin) {
      const hashedPassword = await hashPassword(DEFAULT_ADMIN_PASS);
      return await prisma.user.create({
        data: {
          email: DEFAULT_ADMIN_EMAIL,
          name: 'Duy Nguyễn (Admin)',
          password: hashedPassword,
          role: 'ADMIN',
        },
      });
    }

    if (admin.role !== 'ADMIN') {
      return await prisma.user.update({
        where: { id: admin.id },
        data: { role: 'ADMIN' },
      });
    }

    return admin;
  } catch (err) {
    console.error('Error ensuring default admin:', err);
    return null;
  }
}

export async function getCurrentUser(request?: Request): Promise<UserSession | null> {
  try {
    // Strategy 1: Check Bearer token from explicitly passed Request
    if (request) {
      const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7).trim();
        if (token) {
          const user = await verifyToken(token);
          if (user) return user;
        }
      }
    }

    // Strategy 2: Check Bearer token from next/headers
    try {
      const headerList = await headers();
      const authHeader = headerList.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7).trim();
        if (token) {
          const user = await verifyToken(token);
          if (user) return user;
        }
      }
    } catch {
      // In non-request context (e.g. static generation or scripts), ignore
    }

    // Strategy 3: Check HTTP-only Cookie (Web browser / WebView)
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export async function getAuthenticatedUserOrDemo(request?: Request) {
  await ensureDefaultAdmin();
  const user = await getCurrentUser(request);
  if (user) {
    const dbUser = await prisma.user.findUnique({ where: { id: user.userId } });
    if (dbUser) return dbUser;
  }

  // Fallback to default admin user
  const defaultAdmin = await prisma.user.findUnique({
    where: { email: DEFAULT_ADMIN_EMAIL },
  });
  if (defaultAdmin) return defaultAdmin;

  return prisma.user.findFirst();
}

export { COOKIE_NAME };
