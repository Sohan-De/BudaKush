'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faSpinner, faHome, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { sendOrderConfirmationEmail } from '@/services/email.service';
import styles from './page.module.css';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart, cart } = useCart();
  const sessionId = searchParams.get('session_id');
  const [hasCleared, setHasCleared] = useState(false);
  const [emailsSent, setEmailsSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  
  // Clear the cart when the success page loads
  useEffect(() => {
    if (!sessionId) {
      // Redirect to home if accessed directly without session_id
      router.push('/');
      return;
    }
    
    // Only clear the cart once when component mounts
    if (!hasCleared && cart.length > 0) {
      clearCart();
      setHasCleared(true);
    }
  }, [sessionId, router, clearCart, hasCleared, cart.length]);

  // Send confirmation emails when the page loads
  useEffect(() => {
    if (sessionId && !emailsSent && !emailError) {
      const sendConfirmationEmails = async () => {
        try {
          console.log('Sending confirmation emails for session:', sessionId);
          
          // Get order details from localStorage or session
          const orderData = localStorage.getItem(`order_${sessionId}`);
          if (orderData) {
            const order = JSON.parse(orderData);
            
                         // Send confirmation emails
             if (process.env.NEXT_PUBLIC_DEMO_CHECKOUT !== 'true') await sendOrderConfirmationEmail(order);
            setEmailsSent(true);
            console.log('Confirmation emails sent successfully');
          } else {
            console.log('No order data found for session:', sessionId);
            setEmailsSent(true); // Don't retry if no data
          }
        } catch (error) {
          console.error('Error sending confirmation emails:', error);
          setEmailError(error instanceof Error ? error.message : 'Failed to send emails');
        }
      };

      sendConfirmationEmails();
    }
  }, [sessionId, emailsSent, emailError]);

  if (!sessionId) {
    return (
      <div className={styles.loading}>
        <FontAwesomeIcon icon={faSpinner} spin />
        <p>Redirection...</p>
      </div>
    );
  }

  return (
    <div className={styles.successContainer}>
      <div className={styles.successCard}>
        <div className={styles.successIcon}>
          <FontAwesomeIcon icon={faCheckCircle} className={styles.checkIcon} />
        </div>
        
        <h1>Commande Confirmée!</h1>
        
        <p className={styles.orderNumber}>
          Numéro de commande: <span>#{sessionId.substring(0, 8)}</span>
        </p>
        
        <p className={styles.thankYou}>
          Merci pour votre achat! Votre commande a été traitée avec succès.
        </p>
        
        <p className={styles.emailInfo}>
          {emailsSent ? (
            'Un email de confirmation a été envoyé à l\'adresse fournie lors de votre commande avec tous les détails.'
          ) : emailError ? (
            'Votre commande a été traitée avec succès. Un email de confirmation sera envoyé sous peu.'
          ) : (
            'Envoi de l\'email de confirmation...'
          )}
        </p>
        
        {emailError && (
          <p className={styles.emailError}>
            Note: Il y a eu un problème avec l'envoi de l'email de confirmation, mais votre commande a bien été traitée.
          </p>
        )}
        
        <div className={styles.shippingInfo}>
          <h2>Prochaines étapes</h2>
          <p>Votre commande sera traitée et expédiée dans les 1 à 3 jours ouvrables.</p>
          <p>Vous recevrez un email de confirmation d'expédition avec un numéro de suivi dès que votre colis sera en route.</p>
        </div>
        
        <div className={styles.actionButtons}>
          <Link href="/" className={styles.homeButton}>
            <FontAwesomeIcon icon={faHome} />
            Retour à l'accueil
          </Link>
          
          <Link href="/products" className={styles.shopButton}>
            <FontAwesomeIcon icon={faBoxOpen} />
            Continuer vos achats
          </Link>
        </div>
        
        <div className={styles.support}>
          <p>
            Besoin d'aide? Contactez notre <Link href="/contact">service client</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={
      <div className={styles.loading}>
        <FontAwesomeIcon icon={faSpinner} spin />
        <p>Chargement...</p>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
} 