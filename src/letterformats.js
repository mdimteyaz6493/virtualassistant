// Leave Application Template
export const leaveApplicationTemplate = (name, date, startDate, endDate, reason) => `
    To,
    The Manager,
    Company Name,
    Address

    Date: ${date}

    Subject: Leave Application

    Respected Sir/Madam,

    I, ${name}, am writing this to inform you that I require leave 
    from ${startDate} to ${endDate} due to ${reason}. I request you to kindly grant me leave for the mentioned days.

    Thank you for your understanding.

    Sincerely,
    ${name}
`;

// Job Application Template
export const jobApplicationTemplate = (name, date, position) => `
    To,
    The Hiring Manager,
    Company Name,
    Address

    Date: ${date}

    Subject: Application for the Position of ${position}

    Respected Sir/Madam,

    I, ${name}, am writing to apply for the position of ${position} at your esteemed company. I am confident that my skills and experience make me a strong candidate for the role.I am eager to contribute to your company and learn more about the industry.
   
    I have attached my resume for your review. I hope to have the opportunity to discuss my qualifications in further detail.
    

    Thank you for considering my application.

    Sincerely,
    ${name}
`;
