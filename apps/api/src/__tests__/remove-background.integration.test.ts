import request from "supertest";
import { createApp } from "../app";
import { mock, describe, test, beforeEach, expect } from "bun:test";

// Mock del servicio para evitar procesamiento real
const removeBackgroundFromImageMock = mock(() => "ruta/fake/output.png");
mock.module("../services/background-removal.service", () => ({
  removeBackgroundFromImage: removeBackgroundFromImageMock,
}));

const app = createApp();

describe("POST /remove-background (integración)", () => {
  beforeEach(() => {
    removeBackgroundFromImageMock.mockClear();
  });

  test("procesa correctamente la subida de archivo", async () => {
    const response = await request(app)
      .post("/remove-background")
      .attach("image", Buffer.from("fake image content"), "test.png");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.message).toMatch(/Fondo eliminado exitosamente/i);
    expect(removeBackgroundFromImageMock).toHaveBeenCalled();
  });
});
