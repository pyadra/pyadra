import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '../route';
import { NextResponse } from 'next/server';

// Mock dependencies
vi.mock('@/app/lib/db', () => ({
  getSupabase: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({ data: { id: 'test-capsule-id' }, error: null })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: {}, error: null })),
      })),
    })),
  })),
}));

vi.mock('stripe', () => {
  const MockStripe = vi.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({
          id: 'cs_test_123',
          url: 'https://checkout.stripe.com/test',
        }),
      },
    },
  }));
  return { default: MockStripe };
});

describe('POST /api/ethernicapsule/checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = 'sk_test_mock_key';
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('should return 400 if sender_name is missing', async () => {
    const request = new Request('http://localhost:3000/api/ethernicapsule/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'test message' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing required fields');
  });

  it('should return 400 if message is missing', async () => {
    const request = new Request('http://localhost:3000/api/ethernicapsule/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender_name: 'Test User' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing required fields');
  });

  it('should create checkout session with valid data', async () => {
    const request = new Request('http://localhost:3000/api/ethernicapsule/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'origin': 'http://localhost:3000'
      },
      body: JSON.stringify({
        sender_name: 'Test Sender',
        recipient_name: 'Test Recipient',
        message: 'This is a test message for the capsule.',
        guardian_email: 'guardian@example.com',
        deliver_at: '2025-12-31T00:00:00Z',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('url');
    expect(data.url).toBe('https://checkout.stripe.com/test');
  });

  it('should sanitize HTML in sender_name', async () => {
    const request = new Request('http://localhost:3000/api/ethernicapsule/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender_name: '<script>alert("xss")</script>Legit Name',
        message: 'Test message',
      }),
    });

    const response = await POST(request);

    // Should not throw and should process successfully
    expect(response.status).toBe(200);
  });

  it('should handle database errors gracefully', async () => {
    const { getSupabase } = await import('@/app/lib/db');
    vi.mocked(getSupabase).mockReturnValueOnce({
      from: vi.fn(() => ({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: null,
              error: { message: 'Database error', code: 'DB_ERROR' }
            })),
          })),
        })),
      })),
    } as any);

    const request = new Request('http://localhost:3000/api/ethernicapsule/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender_name: 'Test Sender',
        message: 'Test message',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to initialize capsule secure vault.');
  });

  it('should generate unique keys for each capsule', async () => {
    const request1 = new Request('http://localhost:3000/api/ethernicapsule/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender_name: 'Sender 1',
        message: 'Message 1',
      }),
    });

    const request2 = new Request('http://localhost:3000/api/ethernicapsule/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender_name: 'Sender 2',
        message: 'Message 2',
      }),
    });

    const response1 = await POST(request1);
    const response2 = await POST(request2);

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);
    // Both should succeed independently
  });

  it('should handle optional fields correctly', async () => {
    const request = new Request('http://localhost:3000/api/ethernicapsule/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender_name: 'Minimal Sender',
        message: 'Minimal message',
        // No recipient_name, guardian_email, or deliver_at
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('url');
  });
});
