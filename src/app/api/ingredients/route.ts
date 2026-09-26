import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

// GET /api/ingredients — list all ingredients with allergy metadata
export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("ingredients")
    .select("*")
    .order("name");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ingredients: data });
}

// PATCH /api/ingredients — update an ingredient's allergy metadata
export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) return NextResponse.json({ error: "Missing ingredient id" }, { status: 400 });

  // Set reviewed timestamp when status changes to VERIFIED
  if (updates.allergy_data_status === "VERIFIED") {
    updates.allergy_data_reviewed_at = new Date().toISOString();
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("ingredients")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ingredient: data });
}
