import styles from './page.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLeaf, 
  faSeedling, 
  faRecycle, 
  faLightbulb,
  faAward,
  faShieldAlt,
  faUsers,
  faHeart
} from '@fortawesome/free-solid-svg-icons';

export default function APropos() {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>À Propos de <span>BudaKush CBD</span></h1>
          <p>Découvrez notre passion pour le bien-être naturel et notre engagement envers la qualité</p>
        </div>
      </section>

      {/* Notre Histoire Section */}
      <section className={styles.aboutSection}>
        <div className={styles.container}>
          <div className={styles.sectionTitle}>
            <h2>Notre <span>Histoire</span></h2>
          </div>
          <div className={styles.storyContent}>
            <div className={styles.storyText}>
              <p>
                BudaKush CBD est née d'une passion pour les vertus naturelles du chanvre et d'une conviction que la nature offre ce qu'il y a de meilleur pour notre bien-être. Fondée en 2018 par une équipe d'experts passionnés, notre entreprise s'est rapidement imposée comme une référence dans le domaine des produits CBD de haute qualité.
              </p>
              <p>
                Notre parcours a commencé lorsque notre fondateur, après avoir découvert les bienfaits du CBD pour soulager ses propres problèmes de stress et d'anxiété, a décidé de créer une gamme de produits qui répondrait aux plus hautes exigences de qualité et d'efficacité.
              </p>
            </div>
            <div className={styles.storyImage}>
              <img src="/images/BudaKush/web/about-equipe.webp" alt="L'équipe BudaKush en boutique à Perpignan" className={styles.imagePlaceholder} style={{ padding: 0, objectFit: "cover", width: "100%", height: "auto" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Notre Mission Section */}
      <section className={`${styles.aboutSection} ${styles.missionSection}`}>
        <div className={styles.container}>
          <div className={styles.sectionTitle}>
            <h2>Notre <span>Mission</span></h2>
          </div>
          <div className={styles.missionContent}>
            <div className={styles.missionImage}>
              <img src="/images/BudaKush/web/about-production.webp" alt="Fleurs CBD et produits BudaKush" className={styles.imagePlaceholder} style={{ padding: 0, objectFit: "cover", width: "100%", height: "auto" }} />
            </div>
            <div className={styles.missionText}>
              <p>
                Chez BudaKush CBD, notre mission est de démocratiser l'accès à des produits CBD de la plus haute qualité, cultivés et fabriqués dans le respect de l'environnement et de votre bien-être.
              </p>
              <p>
                Nous sommes convaincus que le CBD peut jouer un rôle important dans l'amélioration de la qualité de vie de nombreuses personnes, et nous nous engageons à proposer des produits innovants, sûrs et efficaces.
              </p>
              <p>
                Nous mettons un point d'honneur à éduquer notre communauté sur les bienfaits du CBD et à dissiper les idées reçues sur ce composé naturel extraordinaire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs Section */}
      <section className={styles.aboutSection}>
        <div className={styles.container}>
          <div className={styles.sectionTitle}>
            <h2>Nos <span>Valeurs</span></h2>
          </div>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <div className={styles.valueIconInner}>
                  <FontAwesomeIcon icon={faAward} />
                </div>
              </div>
              <h3>Qualité</h3>
              <p>Nous ne faisons aucun compromis sur la qualité de nos produits, depuis la sélection des graines jusqu'à l'emballage final.</p>
            </div>
            
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <div className={styles.valueIconInner}>
                  <FontAwesomeIcon icon={faShieldAlt} />
                </div>
              </div>
              <h3>Transparence</h3>
              <p>Nous partageons ouvertement nos méthodes de production et les résultats des tests de laboratoire indépendants pour chacun de nos produits.</p>
            </div>
            
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <div className={styles.valueIconInner}>
                  <FontAwesomeIcon icon={faRecycle} />
                </div>
              </div>
              <h3>Durabilité</h3>
              <p>Nous nous engageons à minimiser notre impact environnemental à travers des pratiques agricoles durables et des emballages écologiques.</p>
            </div>
            
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <div className={styles.valueIconInner}>
                  <FontAwesomeIcon icon={faLightbulb} />
                </div>
              </div>
              <h3>Innovation</h3>
              <p>Nous investissons constamment dans la recherche pour développer des produits innovants qui répondent aux besoins évolutifs de nos clients.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Équipe Section */}
      <section className={`${styles.aboutSection} ${styles.teamSection}`}>
        <div className={styles.container}>
          <div className={styles.sectionTitle}>
            <h2>Notre <span>Équipe</span></h2>
          </div>
          <p className={styles.teamIntro}>
            BudaKush CBD, c'est avant tout une équipe passionnée et dévouée, composée d'experts dans divers domaines, tous unis par la même passion pour le CBD et ses bienfaits.
          </p>
          
          <div className={styles.teamGrid}>
            <div className={styles.teamMember}>
              <div className={styles.memberImage}>
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <h3>Jean Dubois</h3>
              <p className={styles.memberRole}>Fondateur & CEO</p>
              <p>Passionné de botanique et d'agriculture durable, Jean a fondé BudaKush CBD avec la vision de créer des produits CBD qui respectent à la fois la nature et les consommateurs.</p>
            </div>
            
            <div className={styles.teamMember}>
              <div className={styles.memberImage}>
                <FontAwesomeIcon icon={faHeart} />
              </div>
              <h3>Marie Laurent</h3>
              <p className={styles.memberRole}>Responsable Qualité</p>
              <p>Pharmacienne de formation, Marie supervise tous les aspects de la qualité et s'assure que chaque produit répond aux normes les plus strictes.</p>
            </div>
            
            <div className={styles.teamMember}>
              <div className={styles.memberImage}>
                <FontAwesomeIcon icon={faLeaf} />
              </div>
              <h3>Pierre Moreau</h3>
              <p className={styles.memberRole}>Chef des Opérations</p>
              <p>Fort de 15 ans d'expérience dans l'agriculture biologique, Pierre veille à ce que nos pratiques de culture soient toujours respectueuses de l'environnement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Certifications Section */}
      <section className={styles.aboutSection}>
        <div className={styles.container}>
          <div className={styles.sectionTitle}>
            <h2>Nos <span>Certifications</span></h2>
          </div>
          <div className={styles.certificationsGrid}>
            <div className={styles.certificationCard}>
              <div className={styles.certificationIcon}>
                <div className={styles.certificationIconInner}>
                  <FontAwesomeIcon icon={faSeedling} />
                </div>
              </div>
              <h3>Agriculture Biologique</h3>
              <p>Tous nos plants de chanvre sont cultivés selon les principes de l'agriculture biologique, sans pesticides ni produits chimiques.</p>
            </div>
            
            <div className={styles.certificationCard}>
              <div className={styles.certificationIcon}>
                <div className={styles.certificationIconInner}>
                  <FontAwesomeIcon icon={faAward} />
                </div>
              </div>
              <h3>ISO 9001</h3>
              <p>Notre processus de production est certifié ISO 9001, garantissant un système de gestion de la qualité rigoureux.</p>
            </div>
            
            <div className={styles.certificationCard}>
              <div className={styles.certificationIcon}>
                <div className={styles.certificationIconInner}>
                  <FontAwesomeIcon icon={faShieldAlt} />
                </div>
              </div>
              <h3>GMP (Good Manufacturing Practices)</h3>
              <p>Nos installations respectent les Bonnes Pratiques de Fabrication, assurant la sécurité et la qualité de nos produits.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 