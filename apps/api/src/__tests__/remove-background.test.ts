import request from 'supertest';
import { test, mock, beforeEach, expect } from 'bun:test';
import { describe } from 'bun:test';
import type { Express } from 'express';
import { createApp } from '../app';
import { removeBackgroundFromImage } from '../services/background-removal.service';

const app: Express = createApp();

const removeBackgroundMock = mock(() => 'ruta/mock.png');
mock.module('../services/background-removal.service', () => ({
  removeBackgroundFromImage: removeBackgroundMock
}));

beforeEach(() => {
  removeBackgroundMock.mockClear();
});

describe('POST /api/remove-background', () => {
  beforeEach(() => {
    removeBackgroundMock.mockClear();
  });

  test('debe retornar 400 cuando falta imagePath', async () => {
    const response = await request(app)
      .post('/api/remove-background')
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('debe retornar 200 con resultado exitoso', async () => {
    removeBackgroundMock.mockResolvedValue('ruta/imagen-procesada.png');

    const response = await request(app)
      .post('/api/remove-background')
      .send({ imagePath: 'ruta/imagen.png' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(removeBackgroundMock).toHaveBeenCalledWith('ruta/imagen.png');
  });

  test('debe manejar errores 500 correctamente', async () => {
    removeBackgroundMock.mockRejectedValue(new Error('Error de prueba'));

    const response = await request(app)
      .post('/api/remove-background')
      .send({ imagePath: 'ruta/imagen.png' });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error');
  });
});