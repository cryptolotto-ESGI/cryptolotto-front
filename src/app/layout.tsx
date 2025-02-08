import './globals.css'
import {Navigation} from '@/components/Navigation'
import React from "react";
import {Providers} from "@/app/providers";
import {ToastProvider, ToastViewport} from "@/components/ui/toast";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body>
        <ToastProvider>
            <Providers>
                <Navigation/>
                {children}
            </Providers>
            <ToastViewport/>
        </ToastProvider>
        </body>
        </html>
    )
}
