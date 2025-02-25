import React, { useState } from 'react';
import { firestore } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const AddServiceForm = () => {
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(firestore, 'services'), {
        name: serviceName,
        description: serviceDescription,
      });
      setMessage('Service added successfully!');
    } catch (err) {
      setMessage('Error adding service: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleAddService}>
      <input
        type="text"
        placeholder="Service Name"
        value={serviceName}
        onChange={(e) => setServiceName(e.target.value)}
        required
      />
      <textarea
        placeholder="Service Description"
        value={serviceDescription}
        onChange={(e) => setServiceDescription(e.target.value)}
        required
      />
      <button type="submit">Add Service</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default AddServiceForm;
