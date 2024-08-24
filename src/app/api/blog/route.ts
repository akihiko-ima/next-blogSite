import { NextResponse } from "next/server";

import prisma from "@/app/utils/connect";

export async function main() {
  try {
    await prisma.$connect();
  } catch (error) {
    return Error("DB接続に失敗しました。");
  }
}

// ブログの全記事を取得API
export async function GET(req: Request, res: NextResponse) {
  try {
    await main();
    const posts = await prisma.post.findMany({ orderBy: { date: "asc" } });
    return NextResponse.json({ message: "Success", posts }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// ブログ投稿用API
export async function POST(req: Request, res: NextResponse) {
  try {
    await main();
    const { title, description } = await req.json();

    const post = await prisma.post.create({ data: { title, description } });
    return NextResponse.json({ message: "Success", post }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// export async function PUT(req: Request) {
//   try {
//   } catch (error) {
//     console.error("ERROR UPDATING BLOG", error);
//     return NextResponse.json({ error: "ERROR UPDATING BLOG", status: 500 });
//   }
// }

// export async function DELETE(req: Request) {
//   try {
//   } catch (error) {
//     console.error("ERROR DELETING BLOG", error);
//     return NextResponse.json({ error: "ERROR DELETING BLOG", status: 500 });
//   }
// }
