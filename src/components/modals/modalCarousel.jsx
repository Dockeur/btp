import React, { useState } from 'react';
import Modal from 'react-modal';


const YourComponent1 = ({ selectedTerrain }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const openModal = (imageIndex) => {
    setSelectedImageIndex(imageIndex);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
    setModalIsOpen(false);
  };

  const navigate = (direction) => {
    const newIndex =
      direction === 'next'
        ? (selectedImageIndex + 1) % selectedTerrain.images.length
        : (selectedImageIndex - 1 + selectedTerrain.images.length) %
          selectedTerrain.images.length;
    setSelectedImageIndex(newIndex);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {selectedTerrain.images.map((image, imageIndex) => (
        <div key={imageIndex} onClick={() => openModal(imageIndex)}>
          <img
            src={image}
            alt={`Image ${imageIndex + 1}`}
            className="object-cover w-full h- rounded-md cursor-pointer"
          />
        </div>
      ))}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
      >
        {selectedImageIndex !== null && (
          <>
            <img
              src={selectedTerrain.images[selectedImageIndex]}
              alt={`Image ${selectedImageIndex + 1}`}
              className="object-contain w-full h-full"
            />
            <button onClick={() => navigate('prev')}>Précédent</button>
            <button onClick={() => navigate('next')}>Suivant</button>
          </>
        )}
        <button onClick={closeModal}>Fermer</button>
      </Modal>
    </div>
  );
};

export default YourComponent1;
