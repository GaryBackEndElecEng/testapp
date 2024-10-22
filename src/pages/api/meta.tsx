import { PrismaClient } from "@prisma/client";
import { userType } from "@/components/editor/Types";
import { NextApiRequest, NextApiResponse } from "next";
import { blogType } from "@/components/editor/Types";
import { getErrorMessage } from "@/lib/errorBoundaries";
import { getAllBlogImages, getUsersImage } from "@/lib/awsFunctions";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    //  THIS SAVES MESSAGES AND , IF BLOG_ID && RATE UPDATES BLOG RATE
    if (req.method === "GET") {
        const { blogs, users } = req.query;
        if (!(blogs || users)) { res.status(400).json({ msg: "nothing recieved" }); return await prisma.$disconnect() };
        if (users === "users") {
            try {
                const users_ = await prisma.user.findMany({
                    select: {
                        name: true,
                        email: true,
                        imgKey: true,
                        image: true
                    }
                });
                const userImgs = await getUsersImage(users_ as unknown[] as userType[]);
                res.status(200).json(userImgs);
                return await prisma.$disconnect();
            } catch (error) {
                const msg = getErrorMessage(error);
                console.log(msg);
                res.status(400).json({ message: msg });
                return await prisma.$disconnect();
            }
        }
        if (blogs === "blogs") {
            try {
                const blogs_ = await prisma.blog.findMany({
                    select: {
                        id: true,
                        name: true,
                        desc: true,
                        user_id: true,
                        img: true,
                        imgKey: true,
                        rating: true,
                        attr: true
                    }
                });
                const newBlogs = await getAllBlogImages(blogs_ as unknown[] as blogType[]);
                res.status(200).json(newBlogs);
                // console.log("blogMsgs", blogMsgs, "blog_id", blog_id, "type", typeof (blog_id))
                return await prisma.$disconnect();
            } catch (error) {
                const msg = getErrorMessage(error);
                console.log(msg);
                res.status(400).json({ message: msg });
                return await prisma.$disconnect();
            }
        }
    }
    if (req.method === "PUT") {
        const blog = req.body as blogType;
        if (!(blog && blog.id)) { res.status(400).json({ msg: "no blog recieved" }); return await prisma.$disconnect(); };
        try {
            const metaBlog = await prisma.blog.update({
                where: { id: blog.id },
                data: {
                    name: blog.name,
                    title: blog.title ? blog.title : null,
                    desc: blog.desc,
                    img: null,
                    eleId: blog.eleId ? blog.eleId : null,
                    class: blog.class ? blog.class : null,
                    inner_html: blog.inner_html ? blog.inner_html : null,
                    cssText: blog.cssText ? blog.cssText : null,
                    imgKey: blog.imgKey ? blog.imgKey : null,
                    imgBgKey: blog.imgBgKey ? blog.imgBgKey : null,
                    show: blog.show,
                    username: blog.username ? blog.username : null,
                    attr: blog.attr ? blog.attr : "circle"

                }
            });
            if (!metaBlog) { res.status(400).json({ msg: "blog not found" }) };
            res.status(200).json(metaBlog);
            return await prisma.$disconnect();
        } catch (error) {
            const msg = getErrorMessage(error);
            console.log(msg);
            res.status(500).json({ msg: msg });
            return await prisma.$disconnect();
        } finally {
            return await prisma.$disconnect();
        }
    }



}