import React from 'react';

export default function values() {
  return [
    {
      id: 1,
      title: "Nos valeurs",
      descriptin: (
        <p>
          {" "}
          1. Responsabilité;
          <br /> 2. Discipline; <br /> 3. Innovation;
          <br /> 4. Efficacité;
          <br /> 5. Performance.
        </p>
      ),
      image: "/src/assets/exploration/villa.jpg",
      alt: "image villa",
    
    },
    {
      id: 2,
      title: "Notre mission",
      descriptin: (
        <p>
          {" "}
          Rendre l'investissement immobilier accessible à tous.
          <br />
          Loger des personnes physiques et morales dans le monde en général et
          en Afrique en particulier, tout en facilitant le financement et la
          gestion immobilière, basé sur l'intégrité, la transparence et le
          professionnalisme.{" "}
        </p>
      ),
      image: "/src/assets/exploration/immeuble.jpg",
      alt: "image immeuble",
  
    },
    {
      id: 3,
      title: "Notre vision",
      descriptin:
        "Concourir à un monde meilleur en multipliant les emplois et en mettant à disposition de la population une offre variée de biens immobiliers.",
      image: "/src/assets/exploration/appartement.jpg",
      alt: "image appatement",
     
    },
    {
      id: 4,
      title: "Notre engagement",
      descriptin:
        " Chez EFFICACE, nous croyons en la responsabilité sociale et en l'engagement envers notre communauté.",
      image: "/src/assets/exploration/terrain.jpg ",
      alt: "image terrain",
    
    },
  ];
}
