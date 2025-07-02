export const CVTestData = {
  resume: {
    personalInfo: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phone: '+1-555-123-4567',
      location: 'New York, NY',
      linkedin: 'https://linkedin.com/in/johnsmith',
      summary: 'Experienced software engineer with 5+ years of expertise in full-stack development'
    },
    experience: [
      {
        jobTitle: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'New York, NY',
        startDate: '2021-01',
        endDate: 'Present',
        description: 'Led development of microservices architecture, improving system performance by 40%'
      },
      {
        jobTitle: 'Software Developer',
        company: 'StartUp Inc',
        location: 'San Francisco, CA',
        startDate: '2019-06',
        endDate: '2020-12',
        description: 'Developed and maintained RESTful APIs serving 100k+ daily users'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of California',
        location: 'Berkeley, CA',
        graduationDate: '2019-05',
        gpa: '3.8'
      }
    ],
    skills: [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
      'AWS', 'Docker', 'PostgreSQL', 'MongoDB', 'Git'
    ]
  },
  
  jobDescription: {
    title: 'Senior Full Stack Developer',
    company: 'Innovative Tech Solutions',
    location: 'Remote',
    description: `We are seeking an experienced Full Stack Developer to join our dynamic team.
    
    Requirements:
    - 5+ years of experience in software development
    - Strong proficiency in JavaScript/TypeScript
    - Experience with React and Node.js
    - Knowledge of cloud platforms (AWS/Azure/GCP)
    - Experience with Docker and Kubernetes
    - Familiarity with CI/CD pipelines
    - Understanding of microservices architecture
    - Experience with PostgreSQL and MongoDB
    - Excellent problem-solving skills
    - Strong communication and leadership abilities
    
    Responsibilities:
    - Design and develop scalable web applications
    - Implement RESTful APIs and GraphQL endpoints
    - Collaborate with cross-functional teams
    - Mentor junior developers
    - Participate in code reviews
    - Optimize application performance
    - Ensure code quality through testing`,
    keywords: ['JavaScript', 'React', 'Node.js', 'AWS', 'Full Stack', 'TypeScript', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'GraphQL', 'CI/CD', 'microservices']
  },
  
  sampleResume: {
    fileName: 'sample-resume.pdf',
    filePath: '/fixtures/files/sample-resume.pdf',
    fileSize: '245KB',
    mimeType: 'application/pdf'
  },
  
  templates: {
    professional: 'Professional Template',
    modern: 'Modern Template',
    creative: 'Creative Template',
    executive: 'Executive Template'
  }
};