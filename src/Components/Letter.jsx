import React, { useState } from 'react';
import { jobApplicationTemplate, leaveApplicationTemplate } from '../letterformats'; // Import letter templates

const Letter = () => {
  const [letter, setLetter] = useState("");
  const [type, setType] = useState("leave");
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    reason: '',
    position: ''
  });
  const [copySuccess, setCopySuccess] = useState(""); // State to show copy success message

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const currentDate = new Date().toLocaleDateString();

    if (type === 'leave') {
      const leaveLetter = leaveApplicationTemplate(
        formData.name,
        currentDate,
        formData.startDate,
        formData.endDate,
        formData.reason
      );
      setLetter(leaveLetter);
    } else if (type === 'job') {
      const jobLetter = jobApplicationTemplate(
        formData.name,
        currentDate,
        formData.position
      );
      setLetter(jobLetter);
    }
  };

// Handle copy to clipboard
const handleCopy = async () => {
    if (letter) {
      try {
        await navigator.clipboard.writeText(letter);
        setCopySuccess("Letter copied to clipboard!"); // Success message
      } catch (err) {
        console.error("Failed to copy: ", err);
        setCopySuccess("Failed to copy letter."); // Error message
      }
    }
  };
  

  return (
    <>
      <section className='letter_cont'>
        <form onSubmit={handleSubmit} className='letter_form'>
          <div style={styles.formGroup}>
            <label style={styles.label}>Select Letter Type:</label>
            <select value={type} onChange={(e) => setType(e.target.value)} style={styles.input}>
              <option value="leave">Leave Application</option>
              <option value="job">Job Application</option>
            </select>
          </div>

          {/* Common fields */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          {/* Conditional fields based on selected type */}
          {type === 'leave' && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>Start Date:</label>
                <input
                  type="text"
                  name="startDate"
                  placeholder="e.g., 10th October 2024"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>End Date:</label>
                <input
                  type="text"
                  name="endDate"
                  placeholder="e.g., 20th October 2024"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Reason for Leave:</label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
            </>
          )}

          {type === 'job' && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>Job Position:</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
            </>
          )}

          <button type="submit" style={styles.button}>Generate Letter</button>
        </form>

        {/* Display the generated letter */}
        {letter && (
          <>
           <div className="output">
          <div className="letter">
          <pre>{letter}</pre>
          <button onClick={handleCopy} style={styles.copyButton}>Copy Letter</button>
          </div>
           
            {copySuccess && <p style={styles.copyMessage}>{copySuccess}</p>}
           </div>
          </>
        )}
      </section>
    </>
  );
};

export default Letter;

// CSS styles as JavaScript object
const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'block',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  copyButton: {
    padding: '8px',
    fontSize: '14px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  copyMessage: {
    marginTop: '10px',
    fontSize: '14px',
    color: 'green',
  },
  output: {
    marginTop: '20px',
    padding: '15px',
    borderRadius: '5px',
    backgroundColor: '#f1f1f1',
    fontSize: '14px',
    whiteSpace: 'pre-wrap',
  }
};
