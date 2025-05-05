// Test unitario para el controlador removeBackgroundLinkController
import { describe, test, expect, beforeEach, mock } from "bun:test";
import type { Request, Response, NextFunction } from "express";
import path from "path";

// Mocks deben declararse antes de importar el controlador
const removeBackgroundFromImageMock = mock(() => ({
  outputPath: path.resolve("images-output/output-testfile.png"),
  fileBuffer: Buffer.from("mocked buffer")
}));

// Definimos la ruta del directorio de salida para que coincida con el controlador
// El controlador usa path.resolve(__dirname, "../../images-output")
// En el contexto de las pruebas, __dirname es apps/api/src/__tests__
const outputDir = path.resolve(__dirname, "../../images-output");
const outputFilePath = path.join(outputDir, "output-testfile.png");

// Creamos mocks para fs
const fsMock = {
  mkdirSync: mock((path: string) => {
    // Verificamos que se llama con la ruta correcta
    expect(path).toBe(outputDir);
    return path;
  }),
  existsSync: mock((path: string) => {
    // Simulamos que el directorio no existe por defecto
    return path === outputDir ? false : true;
  })
};

// No necesitamos esta línea ya que hemos configurado el mock correctamente arriba

mock.module("../services/background-removal.service", () => ({
  removeBackgroundFromImage: removeBackgroundFromImageMock,
}));

// Reemplazamos el módulo fs completo
mock.module("fs", () => fsMock);

import { removeBackgroundLinkController } from "../controllers/remove-background-link.controller";

describe("removeBackgroundLinkController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: any;
  let statusMock: any;
  let next: NextFunction;

  beforeEach(() => {
    removeBackgroundFromImageMock.mockClear();
    fsMock.mkdirSync.mockClear();
    fsMock.existsSync.mockClear();
    fsMock.existsSync.mockImplementation((path) => path === outputDir ? false : true);
    jsonMock = mock(() => res);
    statusMock = mock(() => ({ json: jsonMock }));
    req = {
      file: {
        fieldname: "image",
        originalname: "test.png",
        encoding: "7bit",
        mimetype: "image/png",
        destination: "uploads/",
        filename: "testfile.png",
        path: path.resolve("uploads/testfile.png"),
        size: 1234,
        buffer: Buffer.from([]),
        stream: {} as any,
      },
      get: (header: string) => header === "host" ? "localhost:3000" : undefined,
      protocol: "http"
    } as Partial<Request>;
    res = {
      status: statusMock,
      json: jsonMock,
    };
    next = () => {};
  });

  test("genera correctamente la URL absoluta con protocolo y host", async () => {
    fsMock.existsSync.mockImplementation((path) => path === outputDir ? false : true);
    await removeBackgroundLinkController(req as Request, res as Response, next);

    // Verificar que se llamó al servicio de eliminación de fondo
    expect(removeBackgroundFromImageMock).toHaveBeenCalledWith(req.file);
    
    // Verificar que se creó el directorio de salida
    expect(fsMock.mkdirSync).toHaveBeenCalled();

    // Verificar que se generó la URL correcta con protocolo y host
    expect(jsonMock).toHaveBeenCalledTimes(1);
    expect(jsonMock.mock.calls[0][0]).toHaveProperty("data");
    expect(jsonMock.mock.calls[0][0].data).toHaveProperty("url", "http://localhost:3000/images-output/output-testfile.png");
    expect(jsonMock.mock.calls[0][0].message).toMatch(/Imagen procesada correctamente/i);
  });

  test("genera URL con protocolo HTTPS cuando corresponde", async () => {
    req = {
      ...req,
      get: (header: string) => header === "host" ? "localhost:3000" : undefined,
      protocol: "https"
    } as Partial<Request>;
    fsMock.existsSync.mockImplementation(() => false);
    await removeBackgroundLinkController(req as Request, res as Response, next);

    // Verificar que la URL usa HTTPS
    expect(jsonMock.mock.calls[0][0].data.url).toMatch(/^https:\/\//i);
    expect(jsonMock.mock.calls[0][0].data.url).toBe("https://localhost:3000/images-output/output-testfile.png");
  });

  test("genera URL con host diferente cuando cambia el dominio", async () => {
    req = {
      ...req,
      get: (header: string) => header === "host" ? "example.com" : undefined
    } as Partial<Request>;
    fsMock.existsSync.mockImplementation(() => false);
    await removeBackgroundLinkController(req as Request, res as Response, next);

    // Verificar que la URL usa el host correcto
    expect(jsonMock.mock.calls[0][0].data.url).toBe("http://example.com/images-output/output-testfile.png");
  });

  test("devuelve error 400 cuando no se proporciona archivo", async () => {
    req = {
      ...req,
      file: undefined
    } as Partial<Request>;
    fsMock.existsSync.mockImplementation(() => false);
    await removeBackgroundLinkController(req as Request, res as Response, next);

    // Verificar que se devuelve un error 400
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock.mock.calls[0][0]).toHaveProperty("error");
    expect(jsonMock.mock.calls[0][0].error).toMatch(/imagen es obligatoria/i);
  });

  test("maneja errores del servicio correctamente", async () => {
    removeBackgroundFromImageMock.mockImplementationOnce(() => {
      throw new Error("Error de prueba");
    });
    fsMock.existsSync.mockImplementation(() => false);
    await removeBackgroundLinkController(req as Request, res as Response, next);

    // Verificar que se devuelve un error 500
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock.mock.calls[0][0]).toHaveProperty("error", "Error de prueba");
    expect(jsonMock.mock.calls[0][0].message).toMatch(/Error interno del servidor/i);
  });

  test("funciona correctamente cuando el directorio de salida existe", async () => {
    fsMock.existsSync.mockImplementation((path) => true);
    await removeBackgroundLinkController(req as Request, res as Response, next);

    // Verificar que se generó la URL correcta
    expect(jsonMock).toHaveBeenCalledTimes(1);
    expect(jsonMock.mock.calls[0][0].data).toHaveProperty("url", "http://localhost:3000/images-output/output-testfile.png");
    // Verificar que no se llamó a mkdirSync porque el directorio ya existe
    expect(fsMock.mkdirSync).not.toHaveBeenCalled();
  });

  test("devuelve la respuesta JSON esperada con status, message y URL absoluta", async () => {
    req = {
      ...req,
      get: (header: string) => header === "host" ? "localhost:3001" : undefined
    } as Partial<Request>;
    fsMock.existsSync.mockImplementation(() => false);
  
    await removeBackgroundLinkController(req as Request, res as Response, next);
  
    // Obtenemos el objeto de respuesta enviado por el controlador
    const respuesta = jsonMock.mock.calls[0][0];
    const urlEsperada = "http://localhost:3001/images-output/output-testfile.png";
    const respuestaEsperada = {
      status: 200,
      message: "Imagen procesada correctamente. Utilice la URL proporcionada para acceder a la imagen sin fondo.",
      data: { url: urlEsperada }
    };
    // Comprobamos que la respuesta contiene exactamente los campos esperados
    expect(respuesta.status).toBe(respuestaEsperada.status);
    expect(respuesta.message).toBe(respuestaEsperada.message);
    expect(respuesta.data.url).toBe(respuestaEsperada.data.url);
  });
});