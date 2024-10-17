import { assertEquals } from "jsr:@std/assert";
import { getLuhn } from "./main.ts";

Deno.test("luhn", () => {
  assertEquals(getLuhn("750930193"), 8);
  assertEquals(getLuhn("090301668"), 1);
  assertEquals(getLuhn("721101050"), 4);
  assertEquals(getLuhn("110530493"), 3);
});
