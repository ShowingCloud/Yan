import { NextRequest, NextResponse } from 'next/server';

// Configuration interface allows Host to inject secrets
export type CMSConfig = {
  // Add CMS-specific config as needed
};

// Route Factory Pattern
// The Host App will call this factory and mount the handlers
export function createCMSHandler(config: CMSConfig = {}) {
  return {
    POST: async (req: NextRequest) => {
      // Route handler implementation
      // This will be called when the host mounts it at app/api/cms/[...slug]/route.ts
      return NextResponse.json({ message: 'CMS handler - to be implemented' });
    },
    GET: async (req: NextRequest) => {
      return NextResponse.json({ status: 'active', service: 'cms' });
    },
  };
}

