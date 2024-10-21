"use client";
import React from 'react'
import NextPage from "./nextPage";
export default function Index() {
    const refTest = React.useRef(null);
    React.useEffect(() => {
        if (typeof window !== "undefined" && refTest.current) {
            const doc = document.querySelector("div#injector") as HTMLElement;
            if (doc) {
                const nextpage = new NextPage();
                nextpage.main({ parent: doc });

            }

        }
    }, []);
    return (
        <div ref={refTest} id="injector">Index</div>
    )
}
