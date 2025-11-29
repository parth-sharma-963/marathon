// Pre-built form templates for quick generation
export const FORM_TEMPLATES = {
  jobApplication: {
    title: 'Job Application Form',
    description: 'Standard job application form',
    schema: {
      title: 'Job Application',
      fields: [
        {
          name: 'fullName',
          type: 'text' as const,
          required: true,
          placeholder: 'Enter your full name',
        },
        {
          name: 'email',
          type: 'email' as const,
          required: true,
          placeholder: 'your@email.com',
        },
        {
          name: 'phone',
          type: 'text' as const,
          required: true,
          placeholder: '+1 (555) 000-0000',
        },
        {
          name: 'resume',
          type: 'image' as const,
          required: true,
          placeholder: 'Upload your resume (PDF)',
        },
        {
          name: 'coverLetter',
          type: 'text' as const,
          required: false,
          placeholder: 'Optional cover letter',
        },
      ],
    },
  },
  signup: {
    title: 'User Signup Form',
    description: 'Basic user registration form',
    schema: {
      title: 'Sign Up',
      fields: [
        {
          name: 'username',
          type: 'text' as const,
          required: true,
          placeholder: 'Choose a username',
        },
        {
          name: 'email',
          type: 'email' as const,
          required: true,
          placeholder: 'your@email.com',
        },
        {
          name: 'profilePicture',
          type: 'image' as const,
          required: false,
          placeholder: 'Upload profile picture',
        },
        {
          name: 'bio',
          type: 'text' as const,
          required: false,
          placeholder: 'Tell us about yourself',
        },
      ],
    },
  },
  survey: {
    title: 'Customer Feedback Survey',
    description: 'Collect customer feedback',
    schema: {
      title: 'Feedback Survey',
      fields: [
        {
          name: 'satisfaction',
          type: 'select' as const,
          required: true,
          options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'],
        },
        {
          name: 'feedback',
          type: 'text' as const,
          required: false,
          placeholder: 'Your feedback...',
        },
        {
          name: 'email',
          type: 'email' as const,
          required: false,
          placeholder: 'Optional email for follow-up',
        },
      ],
    },
  },
  eventRegistration: {
    title: 'Event Registration Form',
    description: 'Register for an event',
    schema: {
      title: 'Event Registration',
      fields: [
        {
          name: 'name',
          type: 'text' as const,
          required: true,
          placeholder: 'Your full name',
        },
        {
          name: 'email',
          type: 'email' as const,
          required: true,
          placeholder: 'your@email.com',
        },
        {
          name: 'numberOfAttendees',
          type: 'number' as const,
          required: true,
          placeholder: 'How many people?',
        },
        {
          name: 'dietaryRestrictions',
          type: 'text' as const,
          required: false,
          placeholder: 'Any dietary restrictions?',
        },
        {
          name: 'agreeToTerms',
          type: 'checkbox' as const,
          required: true,
        },
      ],
    },
  },
}

export function getTemplateByName(templateName: keyof typeof FORM_TEMPLATES) {
  return FORM_TEMPLATES[templateName]
}

export function listTemplates() {
  return Object.entries(FORM_TEMPLATES).map(([key, value]) => ({
    id: key,
    title: value.title,
    description: value.description,
  }))
}
