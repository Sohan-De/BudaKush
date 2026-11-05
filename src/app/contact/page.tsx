'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faClock, 
  faEnvelope, 
  faPhone,
  faPaperPlane,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    // Here you would typically send the form data to your backend
    // For now, we'll just simulate a successful submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch {
      // No need to capture the error object since we're not using it
      setError('Une erreur est survenue. Veuillez réessayer plus tard.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>Contactez <span>BudaKush CBD</span></h1>
          <p>Nous sommes là pour répondre à toutes vos questions concernant nos produits CBD</p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.sectionTitle}>
            <h2>Nos <span>Coordonnées</span></h2>
          </div>
          
          <div className={styles.contactInfoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <div className={styles.infoIconInner}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </div>
              </div>
              <h3>Notre Adresse</h3>
              <p>4 Rue de la Fusterie</p>
              <p>66000 Perpignan, France</p>
            </div>
            
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <div className={styles.infoIconInner}>
                  <FontAwesomeIcon icon={faClock} />
                </div>
              </div>
              <h3>Heures d&apos;Ouverture</h3>
              <p>Mardi - Samedi: 11h30 - 20h30</p>
              <p>Dimanche et lundi : Fermé</p>
            </div>
            
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <div className={styles.infoIconInner}>
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
              </div>
              <h3>Email</h3>
              <p>Via le formulaire de contact</p>
            </div>
            
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <div className={styles.infoIconInner}>
                  <FontAwesomeIcon icon={faPhone} />
                </div>
              </div>
              <h3>Téléphone</h3>
              <p>+33 6 35 14 40 89</p>
              <p>Mardi-Samedi: 11h30-20h30</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className={`${styles.contactSection} ${styles.formSection}`}>
        <div className={styles.container}>
          <div className={styles.sectionTitle}>
            <h2>Envoyez-nous un <span>Message</span></h2>
          </div>
          
          <div className={styles.formContainer}>
            {submitted ? (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>
                  <FontAwesomeIcon icon={faCheckCircle} />
                </div>
                <h3>Merci pour votre message!</h3>
                <p>Nous vous répondrons dans les plus brefs délais.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className={styles.newMessageBtn}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                  Envoyer un nouveau message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.contactForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Nom complet</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Votre nom complet"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="subject">Sujet</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="question">Question sur un produit</option>
                    <option value="order">Commande</option>
                    <option value="return">Retour</option>
                    <option value="partnership">Partenariat</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Décrivez votre demande..."
                    rows={6}
                  />
                </div>
                
                {error && <div className={styles.errorMessage}>{error}</div>}
                
                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
} 