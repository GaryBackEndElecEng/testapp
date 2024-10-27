import React from 'react';
import type { Metadata } from 'next';
import Meta from "@/components/meta/meta";
export const metadata: Metadata = Meta.metaChart();
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