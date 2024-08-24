import { NextResponse } from "next/server";

import { main } from "../route";
import prisma from "@/app/utils/connect";

// ブログの詳細記事を取得するAPI
export async function GET(req: Request, res: NextResponse) {
  try {
    await main();

    const slug = req.url.split("/blog/")[1];
    const posts = await prisma.post.findUnique({ where: { id: slug } });

    return NextResponse.json({ message: "Success", posts }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// ブログの詳細記事を編集するAPI
export async function PUT(req: Request, res: NextResponse) {
  try {
    await main();

    const { title, description } = await req.json();

    const slug = req.url.split("/blog/")[1];
    const posts = await prisma.post.update({
      data: { title, description },
      where: { id: slug },
    });

    return NextResponse.json({ message: "Success", posts }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// ブログの詳細記事を削除するAPI
export async function DELETE(req: Request, res: NextResponse) {
  try {
    await main();

    const slug = req.url.split("/blog/")[1];
    const posts = await prisma.post.delete({
      where: { id: slug },
    });

    return NextResponse.json({ message: "Success", posts }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
