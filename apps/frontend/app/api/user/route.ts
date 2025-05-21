// app/api/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(_req: NextRequest): Promise<NextResponse> {
  try {
    // Obtener el usuario actual usando clerk
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        {
          status: 401,
          message: "Usuario no autenticado",
          id: null,
        },
        { status: 401 }
      );
    }

    // Devolver solo la información necesaria del usuario
    return NextResponse.json({
      status: 200,
      message: "Usuario autenticado",
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.emailAddresses?.[0]?.emailAddress,
    });
  } catch (error) {
    console.error("Error obteniendo información del usuario:", error);
    return NextResponse.json(
      {
        status: 500,
        message: "Error interno del servidor",
        id: null,
      },
      { status: 500 }
    );
  }
}
