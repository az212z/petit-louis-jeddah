/* oxlint-disable next/no-css-tags -- Self-hosted fonts support static hosting at any base path. */
import type { Metadata } from 'next';
import './globals.css';
import './brand.css';
import data from '@/data/restaurant.json';
export const metadata: Metadata={title:`${data.nameAr} | ${data.nameEn} — ${data.cityAr}`,description:data.intro,robots:{index:false,follow:true},icons:{icon:'./favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ar" dir="rtl"><head><link rel="stylesheet" href="./fonts/fonts.css"/></head><body>{children}</body></html>}
