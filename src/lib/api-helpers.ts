import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function errorResponse(message: string, code: string, status: number) {
  return NextResponse.json({ error: message, code }, { status });
}

export function unauthorizedResponse() {
  return errorResponse("Unauthorized", "UNAUTHORIZED", 401);
}

export function forbiddenResponse() {
  return errorResponse("Forbidden", "FORBIDDEN", 403);
}

export function notFoundResponse(resource: string) {
  return errorResponse(`${resource} not found`, "NOT_FOUND", 404);
}

export function validationErrorResponse(error: ZodError) {
  const formatted = error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

  return NextResponse.json(
    { error: "Validation failed", code: "VALIDATION_ERROR", details: formatted },
    { status: 400 },
  );
}
