import request from 'supertest';
import express, { Express } from 'express';
import { registerRoutes } from '../routes';

describe('Checkout and Shipping API', () => {
  let app: Express;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    await registerRoutes(app);
  });

  describe('POST /api/shipping/calculate', () => {
    test('should calculate shipping rates for California', async () => {
      const response = await request(app)
        .post('/api/shipping/calculate')
        .send({
          state: 'CA',
          subtotal: '100.00',
          itemCount: 3
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('shippingRates');
      expect(response.body).toHaveProperty('tax');
      expect(response.body).toHaveProperty('taxRate', 'CA');
      expect(Array.isArray(response.body.shippingRates)).toBe(true);
      expect(response.body.shippingRates.length).toBeGreaterThan(0);
      
      // Check if free shipping is available for orders over threshold
      const freeShipping = response.body.shippingRates.find(
        (rate: any) => rate.method === 'free_shipping'
      );
      expect(freeShipping).toBeDefined();
      expect(freeShipping.cost).toBe(0);
    });

    test('should calculate shipping rates for Alaska (remote zone)', async () => {
      const response = await request(app)
        .post('/api/shipping/calculate')
        .send({
          state: 'AK',
          subtotal: '50.00',
          itemCount: 2
        });

      expect(response.status).toBe(200);
      expect(response.body.shippingRates).toBeDefined();
      expect(response.body.shippingRates.length).toBeGreaterThan(0);
      
      // Alaska should have higher rates
      const standardRate = response.body.shippingRates.find(
        (rate: any) => rate.method === 'standard'
      );
      expect(standardRate).toBeDefined();
      expect(standardRate.cost).toBeGreaterThan(10); // Remote zone should be more expensive
    });

    test('should return error for missing parameters', async () => {
      const response = await request(app)
        .post('/api/shipping/calculate')
        .send({
          state: 'CA'
          // Missing subtotal and itemCount
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('required');
    });

    test('should calculate tax correctly for different states', async () => {
      // Test California (has tax)
      const caResponse = await request(app)
        .post('/api/shipping/calculate')
        .send({
          state: 'CA',
          subtotal: '100.00',
          itemCount: 1
        });

      expect(caResponse.status).toBe(200);
      expect(parseFloat(caResponse.body.tax)).toBeGreaterThan(0);

      // Test Oregon (no sales tax)
      const orResponse = await request(app)
        .post('/api/shipping/calculate')
        .send({
          state: 'OR',
          subtotal: '100.00',
          itemCount: 1
        });

      expect(orResponse.status).toBe(200);
      expect(parseFloat(orResponse.body.tax)).toBe(0);
    });
  });

  describe('POST /api/orders with shipping', () => {
    test('should create order with complete shipping information', async () => {
      const orderData = {
        order: {
          customerName: 'Test Customer',
          customerEmail: 'test@example.com',
          customerPhone: '555-0123',
          customerAddress: '123 Test St',
          customerCity: 'Test City',
          customerState: 'CA',
          customerZip: '90210',
          customerCountry: 'US',
          shippingMethod: 'standard',
          specialInstructions: 'Leave at door',
          subtotal: '99.99',
          shipping: '8.99',
          tax: '7.25',
          total: '116.23',
          status: 'pending'
        },
        items: [
          {
            productId: '1',
            quantity: 2,
            price: '49.99'
          }
        ]
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.customerState).toBe('CA');
      expect(response.body.shippingMethod).toBe('standard');
      expect(response.body.shipping).toBe('8.99');
      expect(response.body.tax).toBe('7.25');
    });

    test('should validate required shipping fields', async () => {
      const incompleteOrderData = {
        order: {
          customerName: 'Test Customer',
          customerEmail: 'test@example.com',
          // Missing required shipping fields
          total: '100.00',
          status: 'pending'
        },
        items: []
      };

      const response = await request(app)
        .post('/api/orders')
        .send(incompleteOrderData);

      expect(response.status).toBe(400);
    });
  });

  describe('Shipping rate calculations', () => {
    test('should apply correct shipping zones', async () => {
      // Test local zone (CA, NV, OR, WA)
      const localResponse = await request(app)
        .post('/api/shipping/calculate')
        .send({
          state: 'CA',
          subtotal: '50.00',
          itemCount: 2
        });

      // Test national zone
      const nationalResponse = await request(app)
        .post('/api/shipping/calculate')
        .send({
          state: 'NY',
          subtotal: '50.00',
          itemCount: 2
        });

      expect(localResponse.status).toBe(200);
      expect(nationalResponse.status).toBe(200);

      const localStandard = localResponse.body.shippingRates.find(
        (rate: any) => rate.method === 'standard'
      );
      const nationalStandard = nationalResponse.body.shippingRates.find(
        (rate: any) => rate.method === 'standard'
      );

      // National shipping should be more expensive than local
      expect(nationalStandard.cost).toBeGreaterThan(localStandard.cost);
    });

    test('should offer multiple shipping methods', async () => {
      const response = await request(app)
        .post('/api/shipping/calculate')
        .send({
          state: 'TX',
          subtotal: '75.00',
          itemCount: 1
        });

      expect(response.status).toBe(200);
      
      const methods = response.body.shippingRates.map((rate: any) => rate.method);
      expect(methods).toContain('standard');
      expect(methods).toContain('express');
      expect(methods).toContain('overnight');
      
      // Verify pricing order: standard < express < overnight
      const standard = response.body.shippingRates.find((r: any) => r.method === 'standard');
      const express = response.body.shippingRates.find((r: any) => r.method === 'express');
      const overnight = response.body.shippingRates.find((r: any) => r.method === 'overnight');
      
      expect(standard.cost).toBeLessThan(express.cost);
      expect(express.cost).toBeLessThan(overnight.cost);
    });
  });
});