import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { CartProvider } from "@/contexts/CartContext";
import { FreeSampleProvider } from "@/components/FreeSampleProvider";

// Empêcher Font Awesome d'ajouter automatiquement ses styles CSS (pour éviter le clignotement)
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "BudaKush CBD Perpignan - Votre Oasis de Bien-être",
  description: "Découvrez notre gamme de produits CBD de qualité supérieure, élevés avec soin pour un bien-être naturel. 4 Rue de la Fusterie, Perpignan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body suppressHydrationWarning>
          <CartProvider>
            <FreeSampleProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            </FreeSampleProvider>
          </CartProvider>
      </body>
    </html>
  );
}
