"use client"
import React from 'react'
import { useEditor } from '../context/editorContext';
import { blogType } from '../editor/Types';
import DisplayBlog from "@/components/blog/displayBlog";
import ModSelector from "@/components/editor/modSelector";
import Service from '../common/services';
import AuthService from "@/components/common/auth";
import User from '../user/userMain';
// import Message from '@/components/common/message';
import ShapeOutside from '../editor/shapeOutside';
import Misc from '../common/misc';
import NewCode from '../editor/newCode';
import ChartJS from '../chart/chartJS';
import Message from '../common/message';

// const url = process.env.BASE_URL as string;

function Index({ id }: { id: number }) {
    const clientRef = React.useRef(null);
    let count: number = 0;
    // const { blog_, setBlog_ } = useEditor();



    React.useEffect(() => {
        if (typeof window !== "undefined" && clientRef && id) {
            const url_id = `/api/blog/${id}`;
            const _modSelector = new ModSelector();
            const maxWidth = window.innerWidth < 900 ? "none" : "75%";
            const target = document.querySelector("section#client_blog") as HTMLElement;
            if (target) {
                const _service = new Service(_modSelector);
                const user = new User(_modSelector, _service);
                const shapeOutside = new ShapeOutside(_modSelector, _service, user);
                const code = new NewCode(_modSelector, _service, user);
                const chart = new ChartJS(_modSelector, _service, user);
                if (target) {
                    target.style.maxWidth = "auto";
                    Misc.matchMedia({ parent: target, maxWidth: 420, cssStyle: { maxWidth: maxWidth, width: "100%", paddngInline: "0rem" } })
                };
                // GET BLOG
                const option = {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "GET"
                }

                fetch(url_id, option).then(async (res) => {
                    if (res && target && count === 0) {
                        const body = await res.json() as blogType;
                        const message = new Message(_modSelector, _service, body);
                        const displayBlog = new DisplayBlog(_modSelector, _service, user, shapeOutside, code, chart, message);
                        displayBlog._onlyMeta = true;
                        await displayBlog.main({ parent: target, blog: body });
                        count++;
                    } else {
                        DisplayBlog.noBlog({ parent: target });
                    }
                });



            }
        }

    }, [count, id]);


    return (
        <div className="container-fluid mx-auto">
            <section className="client_blog" id="client_blog" ref={clientRef}></section>
        </div>
    )
}

export default Index

