"use client";
import React from 'react';
import Blogs from "@/components/blogs/blogsInjection";
// import { useEditor } from '../context/editorContext';
import { blogType, } from '../editor/Types';
import ModSelector from "@/components/editor/modSelector";
import Service from "@/components/common/services";
import AuthService from "@/components/common/auth";


export default function Index() {
    // let window: CustomWindow
    // const { setBlogs } = useEditor();
    const inRef = React.useRef(null);
    React.useEffect(() => {

        if (typeof window !== "undefined" && inRef.current) {
            const url = `/api/savegetblog`;
            const modSelector = new ModSelector();
            const auth = new AuthService(modSelector);
            const service = new Service(modSelector, auth);
            const initBlogs = new Blogs(modSelector, service);
            const injectBlogs = document.getElementById("injectBlogs");
            const option = {
                Headers: { "Content-Type": "application/json" },
                method: "GET"
            }
            fetch(url, option).then(async (res) => {
                if (res) {

                    const body = await res.json() as blogType[];
                    modSelector._blogs = body;
                    if (injectBlogs && body) {
                        modSelector._blogs = body;
                        await initBlogs.showBlogs(injectBlogs, false, body);
                    }
                }
            });

        }
    }, []);

    return (
        <div className="container-fuid mx-auto">

            <div id="injectBlogs" ref={inRef}></div>
        </div>
    )
}

