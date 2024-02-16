import '@radix-ui/themes/styles.css';
import { Inter } from 'next/font/google'
import { Theme } from '@radix-ui/themes';
import './globals.css'
import { GeistSans } from "geist/font/sans";


import NavBar from '../lib/navbar';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning lang="en" className={GeistSans.className}>
      <body className={inter.className}>
        <NavBar />
        <Theme appearance="light" grayColor="gray" accentColor="mint" radius='large' scaling='100%' panelBackground='translucent'>  {children} </Theme>
      </body>
    </html>
  )
}
