"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";

type UpdateBlogParams = {
  title: string;
  description: string;
  id: string;
};

const updateBlog = async (data: UpdateBlogParams) => {
  const res = await fetch(`http://localhost:3000/api/blog/${data.id}`, {
    method: "PUT",
    body: JSON.stringify({ title: data.title, description: data.description }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
};

// 詳細ページを取得する
const getBlogById = async (id: string) => {
  const res = await fetch(`http://localhost:3000/api/blog/${id}`);
  const data = await res.json();
  // console.log(data);
  return data.posts;
};

// 投稿を削除
const deleteBlog = async (id: string) => {
  const res = await fetch(`http://localhost:3000/api/blog/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
};

const EditBlog = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (titleRef.current && descriptionRef.current) {
      toast.loading("Sending Request 🚀");

      await updateBlog({
        title: titleRef.current?.value,
        description: descriptionRef.current?.value,
        id: params.id,
      });

      toast.success("Blog Posted Successfully");

      router.push("/");
      router.refresh();
    }
  };

  const handleDelete = async () => {
    toast.loading("Deleting Blog");
    await deleteBlog(params.id);

    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    // toast.loading("Fetching Blog Details 🚀");
    getBlogById(params.id)
      .then((data) => {
        if (titleRef.current && descriptionRef.current) {
          titleRef.current.value = data.title;
          descriptionRef.current.value = data.description;
          toast.success("Fetching Completed");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error Fetching Blog");
      });
  }, [params.id]);

  return (
    <>
      <Toaster />
      <div className="w-full m-auto flex bg-slate-200 h-screen">
        <div className="flex flex-col justify-center items-center m-auto">
          <p className="text-2xl text-slate-900 font-bold p-3">
            ブログの編集 🚀
          </p>
          <form onSubmit={handleSubmit}>
            <input
              ref={titleRef}
              placeholder="タイトルを入力"
              type="text"
              className="rounded-md px-4 w-full py-2 my-2"
            />
            <textarea
              ref={descriptionRef}
              placeholder="記事詳細を入力"
              className="rounded-md px-4 py-2 w-full my-2"
            ></textarea>
            <button className="font-semibold px-4 py-2 shadow-xl bg-teal-400 rounded-lg m-auto hover:bg-slate-100">
              更新
            </button>
            <button
              className="ml-2 font-semibold px-4 py-2 shadow-xl bg-red-400 rounded-lg m-auto hover:bg-slate-100"
              onClick={handleDelete}
            >
              削除
            </button>
            <Link href={"/"}>
              <button className="ml-2 font-semibold px-4 py-2 shadow-xl bg-yellow-400 rounded-lg m-auto hover:bg-slate-100">
                投稿一覧に戻る
              </button>
            </Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditBlog;
