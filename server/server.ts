import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { handleRequest } from "./routes/index.ts";

serve(handleRequest);