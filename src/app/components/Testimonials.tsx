import styles from '../styles.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';

const testimonials = [
  {
    id: 1,
    rating: 5,
    text: "L'accueil était formidable, comme à la maison. Ils ont vraiment écouté nos besoins et nos goûts. Très professionnel, avec 10 % de réduction à chaque deux achats, et il y a toujours un petit supplément sur la balance qu'il ne facture pas.",
    author: "- B. Kr · Il y a 2 mois"
  },
  {
    id: 2,
    rating: 5,
    text: "Honnêtement, le meilleur magasin CBD de Perpignan, et je le pense vraiment. J'ai tout essayé et il n'y a pas de comparaison ! Qualité, goût, arôme et des conseils précieux de la part d'une équipe compétente et passionnée. N'hésitez plus !",
    author: "- Cha Laso · Il y a 2 semaines"
  },
  {
    id: 3,
    rating: 5,
    text: "L'équipe était extrêmement accueillante. C'était ma première visite pour un produit « petit budget » et j'ai été sincèrement surpris par la qualité. Je les recommande vivement ! ⭐️⭐️⭐️⭐️⭐️",
    author: "- Chaillot Emeric · Il y a 2 ans"
  }
];

const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FontAwesomeIcon key={`full-${i}`} icon={faStar} />);
  }
  
  if (hasHalfStar) {
    stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} />);
  }

  return stars;
};

const Testimonials = () => {
  return (
    <section className={styles.testimonials}>
      <h2>Ce que disent nos clients</h2>
      
      <div className={styles.testimonialContainer}>
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className={styles.testimonial}>
            <div className={styles.stars}>
              {renderStars(testimonial.rating)}
            </div>
            <p>{testimonial.text}</p>
            <p className={styles.author}>{testimonial.author}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials; 