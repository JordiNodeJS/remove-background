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
    expect(result).toBe(outputPath);
  });

  test("lanza error si no se recibe archivo válido", async () => {
    await expect(removeBackgroundFromImage(undefined as any)).rejects.toThrow(
      "Error al procesar la imagen"
    );
  });
});
