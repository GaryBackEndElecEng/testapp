"use client";

import React from 'react'
import ChartJS from "@/components/chart/chartJS";
import ModSelector from '@/components/editor/modSelector';
import Service from '@/components/common/services';
import AuthService from '@/components/common/auth';
import User from '@/components/user/userMain';
import Header from '../editor/header';
import Climate from './climate';
export default function Index() {
    let count = 0;
    const refChart = React.useRef(null);
    React.useEffect(() => {

        if (typeof window !== "undefined" && refChart.current) {
            const climate = new Climate();
            const modSelector = new ModSelector();
            const service = new Service(modSelector);
            const user = new User(modSelector, service);
            const chart = new ChartJS(modSelector, service, user);
            const docChart = document.getElementById("chart") as HTMLElement;
            Header.cleanUp(docChart);
            // console.log(docChart)//works
            if (count === 0) {
                setTimeout(async () => {
                    const blog = modSelector.blog;
                    await chart.mainChart(docChart, blog);
                    await climate.generateGraph({ parent: docChart })
                }, 0)
                count++;
            }
        }

    }, [count]);
    return (
        <div className="container-fluid mx-auto" style={{ minHeight: "110vh" }}>
            <h5 className="mx-auto lean display-5 text-light text-center"> Graphs for you</h5>
            <h6 className="mx-auto px-1 text-center text-light lean display-6 my-6"> Create your own graph</h6>
            <p className="mx-auto px-1 text-center text-light lean my-2">Graph demonstration for you</p>
            <p className="mx-auto px-1 text-center text-light lean my-2">,,,further reading below:</p>

            <div id="chart" ref={refChart} ></div>
        </div>
    )
}


