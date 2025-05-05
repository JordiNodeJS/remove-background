// Test unitario para el servicio removeBackgroundFromImage usando mocks de Bun
import { describe, test, expect, beforeEach, mock } from "bun:test";
import path from "path";

// Mocks deben declararse antes de importar el servicio
const removeImageBackgroundMock = mock(() => Buffer.from("mocked buffer"));
const writeFileMock = mock(() => Promise.resolve());
const unlinkMock = mock(() => Promise.resolve());
const accessMock = mock(() => Promise.resolve());
const mkdirMock = mock(() => Promise.resolve());

mock.module("../utilities/remove", () => ({
  default: removeImageBackgroundMock,
}));
mock.module("fs/promises", () => ({
  writeFile: writeFileMock,
  unlink: unlinkMock,
  access: accessMock,
  mkdir: mkdirMock,
}));

import { removeBackgroundFromImage } from "../services/background-removal.service";

const mockFile = {
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
};

describe("removeBackgroundFromImage", () => {
  const outputDir = path.resolve(__dirname, "../../images-output");
  const outputPath = path.join(outputDir, `output-${mockFile.filename}`);

  beforeEach(() => {
    removeImageBackgroundMock.mockClear();
    writeFileMock.mockClear();
    unlinkMock.mockClear();
    accessMock.mockClear();
    mkdirMock.mockClear();
  });

  test("genera y guarda la imagen procesada", async () => {
    const result = await removeBackgroundFromImage(mockFile as any);
    expect(removeImageBackgroundMock).toHaveBeenCalledWith(mockFile.path);
    expect(writeFileMock).toHaveBeenCalledWith(
      outputPath,
      Buffer.from("mocked buffer")
    );
    expect(unlinkMock).toHaveBeenCalledWith(mockFile.path);
    expect(result.outputPath).toBe(outputPath);
    expect(result.fileBuffer).toEqual(Buffer.from("mocked buffer"));
  });

  test("crea el directorio de salida si no existe", async () => {
    // Simulamos que el directorio no existe haciendo que access lance un error
    accessMock.mockImplementationOnce(() => Promise.reject(new Error("No existe")));
    await removeBackgroundFromImage(mockFile as any);
    expect(mkdirMock).toHaveBeenCalled();
  });

  test("elimina el archivo original tras procesar", async () => {
    await removeBackgroundFromImage(mockFile as any);
    expect(unlinkMock).toHaveBeenCalledWith(mockFile.path);
  });

  test("maneja archivos con diferentes extensiones y tipos MIME", async () => {
    const fileJpg = { ...mockFile, filename: "testfile.jpg", mimetype: "image/jpeg", path: path.resolve("uploads/testfile.jpg") };
    await removeBackgroundFromImage(fileJpg as any);
    expect(removeImageBackgroundMock).toHaveBeenCalledWith(fileJpg.path);
    const fileWebp = { ...mockFile, filename: "testfile.webp", mimetype: "image/webp", path: path.resolve("uploads/testfile.webp") };
    await removeBackgroundFromImage(fileWebp as any);
    expect(removeImageBackgroundMock).toHaveBeenCalledWith(fileWebp.path);
  });

  test("lanza error si no se recibe archivo válido", async () => {
    await expect(removeBackgroundFromImage(undefined as any)).rejects.toThrow(
      "Error al procesar la imagen"
    );
  });

  test("lanza error si falla la escritura del archivo de salida", async () => {
    writeFileMock.mockImplementationOnce(() => Promise.reject(new Error("Fallo de escritura")));
    await expect(removeBackgroundFromImage(mockFile as any)).rejects.toThrow("Error al procesar la imagen");
  });

  test("lanza error si falla la eliminación del archivo original", async () => {
    unlinkMock.mockImplementationOnce(() => Promise.reject(new Error("Fallo de borrado")));
    await expect(removeBackgroundFromImage(mockFile as any)).rejects.toThrow("Error al procesar la imagen");
  });
});
