import React from 'react';
import type { Metadata } from 'next';
import Meta from "@/components/meta/meta";
const newChart = new Meta();
export const metadata: Metadata = newChart.metaChart();
export default function chartlayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="mx-auto">
            {children}
        </div>
    )
}