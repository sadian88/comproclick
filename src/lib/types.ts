
export interface PersonalData {
  fullName?: string;
  companyName?: string;
  phone?: string;
  email?: string;
  country?: string;
}

export interface ProjectPocketItem {
  id: string; // Unique ID for each project item
  projectType?: string;
  projectTypeOther?: string;
  projectCategory?: string;
  projectCategoryOther?: string;
  timeline?: string;
  idea?: string; // Project idea/description
  refinedIdea?: string; // Stored separately if AI was used
}

export type StepKey = 'hero' | 'personalDetails' | 'projectDesigner' | 'requestPocket';

export const initialPersonalData: PersonalData = {
  fullName: '',
  companyName: '',
  phone: '',
  email: '',
  country: '',
};

export const initialProjectPocketItem: Omit<ProjectPocketItem, 'id'> = {
  projectType: '',
  projectTypeOther: '',
  projectCategory: '',
  projectCategoryOther: '',
  timeline: '',
  idea: '',
  refinedIdea: '',
};
