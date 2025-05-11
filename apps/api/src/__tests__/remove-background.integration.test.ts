import request from "supertest";
import { createApp } from "../app";
import { mock, describe, test, beforeEach, expect } from "bun:test";

// Mock del servicio para evitar procesamiento real
const removeBackgroundFromImageMock = mock(() =>
  Buffer.from("fake processed image content")
);
mock.module("../services/background-removal.service", () => ({
  removeBackgroundFromImage: removeBackgroundFromImageMock,
}));

const app = createApp();

describe("API Endpoints (integración)", () => {
  beforeEach(() => {
    removeBackgroundFromImageMock.mockClear();
  });

  describe("POST /remove-background", () => {
    test("procesa correctamente la subida de archivo", async () => {
      const response = await request(app)
        .post("/remove-background")
        .attach("image", Buffer.from("fake image content"), "test.png");

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body.message).toMatch(/Fondo eliminado exitosamente/i);
      expect(removeBackgroundFromImageMock).toHaveBeenCalled();
    });

    test("maneja correctamente errores si no se proporciona imagen", async () => {
      const response = await request(app).post("/remove-background");

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("status", 400);
      expect(response.body.message).toMatch(/obligatoria/i);
    });
  });

  describe("POST /remove-background/link", () => {
    test("devuelve URL para la imagen procesada", async () => {
      const response = await request(app)
        .post("/remove-background/link")
        .attach("image", Buffer.from("fake image content"), "test.png");

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("url");
      expect(typeof response.body.data.url).toBe("string");
      expect(removeBackgroundFromImageMock).toHaveBeenCalled();
    });
  });

  describe("GET /health", () => {
    test("devuelve estado OK", async () => {
      const response = await request(app).get("/health");

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("status", "ok");
    });
  });
});
