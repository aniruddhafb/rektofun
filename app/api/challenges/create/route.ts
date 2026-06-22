import { NextRequest, NextResponse } from "next/server";
import { buildAdminSignedCreateChallengeTx } from "@/app/lib/admin-signer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export interface CreateChallengePayload {
  userWallet: string;         // user's Solana wallet address (base58)
  asset: string;
  betAmountUsdc: number;
  targetPriceUsdCents: number;
  directionAbove: boolean;
  expiresAt: number;
  resolvesAt: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<CreateChallengePayload>;

    if (!body.userWallet || typeof body.userWallet !== "string") {
      return NextResponse.json({ error: "Missing or invalid userWallet" }, { status: 400 });
    }
    if (!body.asset || typeof body.asset !== "string") {
      return NextResponse.json({ error: "Missing or invalid asset" }, { status: 400 });
    }
    if (typeof body.betAmountUsdc !== "number" || body.betAmountUsdc <= 0) {
      return NextResponse.json({ error: "Missing or invalid betAmountUsdc" }, { status: 400 });
    }
    if (typeof body.targetPriceUsdCents !== "number" || body.targetPriceUsdCents < 0) {
      return NextResponse.json({ error: "Missing or invalid targetPriceUsdCents" }, { status: 400 });
    }
    if (typeof body.directionAbove !== "boolean") {
      return NextResponse.json({ error: "Missing or invalid directionAbove" }, { status: 400 });
    }
    if (typeof body.expiresAt !== "number" || typeof body.resolvesAt !== "number") {
      return NextResponse.json({ error: "Missing or invalid timestamps" }, { status: 400 });
    }

    const trimmedAsset = body.asset.trim();
    if (trimmedAsset.length === 0 || trimmedAsset.length > 10) {
      return NextResponse.json({ error: "Asset must be 1-10 characters" }, { status: 400 });
    }

    // Build the transaction with:
    //   creator  = user's wallet  (USDC debited from their ATA)
    //   feePayer = admin wallet   (admin pays all SOL fees)
    // Admin partially signs and returns the serialized tx for the user to sign.
    const result = await buildAdminSignedCreateChallengeTx(body.userWallet, {
      asset: trimmedAsset,
      betAmountUsdc: body.betAmountUsdc,
      targetPriceUsdCents: Math.floor(body.targetPriceUsdCents),
      directionAbove: body.directionAbove,
      expiresAt: Math.floor(body.expiresAt),
      resolvesAt: Math.floor(body.resolvesAt),
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("[api/challenges/create] error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create challenge" },
      { status: 500 }
    );
  }
}
